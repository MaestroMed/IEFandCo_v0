/**
 * Seed script — migrates src/data/*.ts content into the database.
 * Run with: npx tsx src/db/seed.ts
 */

import { db } from "./index";
import { users, services, subServices, serviceFaqs, blogPosts, testimonials, clients, teamMembers, projects, emailTemplates } from "./schema";
import { eq } from "drizzle-orm";
import { services as staticServices } from "../data/services";
import { blogPosts as staticBlog } from "../data/blog";
import { testimonials as staticTestimonials } from "../data/testimonials";
import { clients as staticClients } from "../data/clients";
import { realisations as staticProjects } from "../data/realisations";
import { homepageFAQ } from "../data/faq";
import { hash } from "@node-rs/argon2";
import { randomUUID } from "node:crypto";

function cuid() {
  return randomUUID().replace(/-/g, "").slice(0, 24);
}

async function main() {
  console.log("🌱 Seeding IEF & CO database...");

  // ── Default admin user ──
  const existingAdmin = await db.select().from(users).limit(1);
  if (existingAdmin.length === 0) {
    const passwordHash = await hash("admin1234", { algorithm: 2 });
    await db.insert(users).values({
      id: cuid(),
      email: "admin@iefandco.com",
      name: "Administrateur",
      passwordHash,
      role: "owner",
    });
    console.log("   ✓ Created default admin: admin@iefandco.com / admin1234");
  }

  // ── Services + sub-services + FAQs ──
  const existingServices = await db.select().from(services).limit(1);
  if (existingServices.length === 0) {
    for (let i = 0; i < staticServices.length; i++) {
      const s = staticServices[i];
      const serviceId = cuid();
      await db.insert(services).values({
        id: serviceId,
        slug: s.slug,
        title: s.title,
        shortTitle: s.shortTitle,
        shortDescription: s.shortDescription,
        fullDescription: s.fullDescription,
        icon: s.icon,
        accentColor: s.accentColor,
        seoTitle: s.seo.title,
        seoDescription: s.seo.description,
        orderIdx: i,
      });
      for (let j = 0; j < s.subServices.length; j++) {
        await db.insert(subServices).values({
          id: cuid(),
          serviceId,
          title: s.subServices[j].title,
          description: s.subServices[j].description,
          orderIdx: j,
        });
      }
      for (let j = 0; j < s.faq.length; j++) {
        await db.insert(serviceFaqs).values({
          id: cuid(),
          serviceId,
          question: s.faq[j].question,
          answer: s.faq[j].answer,
          orderIdx: j,
          scope: "service",
        });
      }
    }
    console.log(`   ✓ Seeded ${staticServices.length} services + sub-services + FAQs`);
  }

  // ── Homepage FAQs (no serviceId) ──
  const existingHomeFaqs = await db.select().from(serviceFaqs).where(eq(serviceFaqs.scope, "homepage")).limit(1);
  if (existingHomeFaqs.length === 0) {
    for (let i = 0; i < homepageFAQ.length; i++) {
      await db.insert(serviceFaqs).values({
        id: cuid(),
        serviceId: null,
        question: homepageFAQ[i].question,
        answer: homepageFAQ[i].answer,
        orderIdx: i,
        scope: "homepage",
      });
    }
    console.log(`   ✓ Seeded ${homepageFAQ.length} homepage FAQs`);
  }

  // ── Blog posts ──
  const existingPosts = await db.select().from(blogPosts).limit(1);
  if (existingPosts.length === 0) {
    for (const p of staticBlog) {
      // Serialize sections as TipTap JSON doc (minimal)
      const tiptapDoc = {
        type: "doc",
        content: p.sections.flatMap((section) => {
          const blocks: unknown[] = [];
          if (section.heading) {
            blocks.push({ type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: section.heading }] });
          }
          for (const para of section.paragraphs) {
            blocks.push({ type: "paragraph", content: [{ type: "text", text: para }] });
          }
          return blocks;
        }),
      };
      const contentHtml = p.sections.map((s) => {
        let h = "";
        if (s.heading) h += `<h2>${s.heading}</h2>`;
        for (const para of s.paragraphs) h += `<p>${para}</p>`;
        return h;
      }).join("");
      await db.insert(blogPosts).values({
        id: cuid(),
        slug: p.slug,
        title: p.title,
        excerpt: p.excerpt,
        content: JSON.stringify(tiptapDoc),
        contentHtml,
        category: p.category,
        tags: "",
        readingMinutes: p.readingMinutes,
        status: "published",
        publishedAt: new Date(p.dateISO),
      });
    }
    console.log(`   ✓ Seeded ${staticBlog.length} blog posts`);
  }

  // ── Testimonials ──
  const existingTestim = await db.select().from(testimonials).limit(1);
  if (existingTestim.length === 0) {
    for (let i = 0; i < staticTestimonials.length; i++) {
      const t = staticTestimonials[i];
      await db.insert(testimonials).values({
        id: cuid(),
        author: t.name,
        company: t.company,
        quote: t.text,
        rating: t.rating,
        orderIdx: i,
      });
    }
    console.log(`   ✓ Seeded ${staticTestimonials.length} testimonials`);
  }

  // ── Clients ──
  const existingClients = await db.select().from(clients).limit(1);
  if (existingClients.length === 0) {
    for (let i = 0; i < staticClients.length; i++) {
      await db.insert(clients).values({
        id: cuid(),
        name: staticClients[i].name,
        orderIdx: i,
      });
    }
    console.log(`   ✓ Seeded ${staticClients.length} clients`);
  }

  // ── Team (from /a-propos) ──
  const existingTeam = await db.select().from(teamMembers).limit(1);
  if (existingTeam.length === 0) {
    const teamData = [
      { name: "Otman Fariad", role: "President / Fondateur", expertise: "Expert metallerie et gestion de projet.", initials: "OF" },
      { name: "Bureau d'etude", role: "Conception & calcul", expertise: "Modelisation 3D, notes de calcul Eurocode 3, plans d'execution.", initials: "BE" },
      { name: "Atelier", role: "Fabrication & soudure", expertise: "Soudeurs qualifies MAG/TIG, travail de l'acier, inox et aluminium.", initials: "AT" },
      { name: "Chantier", role: "Pose & installation", expertise: "Equipes terrain formees au travail en hauteur.", initials: "CH" },
    ];
    for (let i = 0; i < teamData.length; i++) {
      await db.insert(teamMembers).values({
        id: cuid(),
        ...teamData[i],
        orderIdx: i,
      });
    }
    console.log(`   ✓ Seeded ${teamData.length} team members`);
  }

  // ── Projects (realisations) ──
  const existingProj = await db.select().from(projects).limit(1);
  if (existingProj.length === 0) {
    for (let i = 0; i < staticProjects.length; i++) {
      const p = staticProjects[i];
      await db.insert(projects).values({
        id: cuid(),
        slug: p.slug,
        title: p.title,
        category: p.category,
        clientName: p.client,
        location: p.location,
        year: p.year,
        description: p.description,
        highlight: p.highlight,
        status: "published",
        orderIdx: i,
      });
    }
    console.log(`   ✓ Seeded ${staticProjects.length} projects`);
  }

  // ── Email templates ──
  const existingTemplates = await db.select().from(emailTemplates).limit(1);
  if (existingTemplates.length === 0) {
    const templates = [
      {
        key: "reply-contact",
        name: "Reponse standard contact",
        subject: "Re: votre demande IEF & CO",
        bodyHtml: `<p>Bonjour {{firstName}},</p>
<p>Merci pour votre message. Nous avons bien recu votre demande et reviendrons vers vous dans les meilleurs delais (sous 24h ouvrees).</p>
<p>Si votre demande est urgente, n'hesitez pas a nous joindre au <strong>01 34 05 87 03</strong>.</p>
<p>Cordialement,<br>L'equipe IEF &amp; CO</p>`,
        variables: "firstName,lastName,email",
      },
      {
        key: "reply-devis",
        name: "Reponse devis",
        subject: "Votre demande de devis pour {{serviceTitle}}",
        bodyHtml: `<p>Bonjour {{firstName}},</p>
<p>Nous avons bien recu votre demande de devis pour <strong>{{serviceTitle}}</strong>.</p>
<p>Notre bureau d'etude analyse votre projet et reviendra vers vous sous 48h ouvrees avec une proposition chiffree.</p>
<p>Pour toute question complementaire ou si vous souhaitez planifier une visite technique, contactez-nous au <strong>01 34 05 87 03</strong>.</p>
<p>Cordialement,<br>L'equipe IEF &amp; CO</p>`,
        variables: "firstName,serviceTitle,company",
      },
      {
        key: "reminder-maintenance",
        name: "Rappel visite de maintenance",
        subject: "Rappel: visite de maintenance le {{visitDate}}",
        bodyHtml: `<p>Bonjour,</p>
<p>Ceci est un rappel pour la visite de maintenance de votre <strong>{{equipmentType}}</strong> prevue le <strong>{{visitDate}}</strong>.</p>
<p>Notre technicien interviendra dans le creneau convenu. Merci de prevoir l'acces aux equipements.</p>
<p>En cas d'empechement, contactez-nous au <strong>01 34 05 87 03</strong> au moins 24h a l'avance.</p>
<p>Cordialement,<br>L'equipe IEF &amp; CO</p>`,
        variables: "equipmentType,visitDate,firstName",
      },
      {
        key: "welcome-contract",
        name: "Bienvenue contrat de maintenance",
        subject: "Bienvenue parmi nos clients sous contrat",
        bodyHtml: `<p>Bonjour {{firstName}},</p>
<p>Bienvenue parmi les clients sous contrat de maintenance IEF &amp; CO.</p>
<p>Votre contrat est desormais actif. Vous beneficiez d'un suivi personnalise, d'un acces prioritaire en cas d'urgence et de visites preventives planifiees.</p>
<p>Votre interlocuteur reste joignable au <strong>01 34 05 87 03</strong> ou par email a <a href="mailto:contact@iefandco.com">contact@iefandco.com</a>.</p>
<p>Au plaisir de collaborer avec vous,<br>L'equipe IEF &amp; CO</p>`,
        variables: "firstName,company",
      },
    ];
    for (const t of templates) {
      await db.insert(emailTemplates).values({ id: cuid(), ...t });
    }
    console.log(`   ✓ Seeded ${templates.length} email templates`);
  }

  console.log("✅ Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
