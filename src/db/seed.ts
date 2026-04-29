/**
 * Seed script — migrates src/data/*.ts content into the database.
 * Run with: npx tsx src/db/seed.ts
 */

import { db } from "./index";
import {
  users,
  services,
  subServices,
  serviceFaqs,
  blogPosts,
  testimonials,
  clients,
  teamMembers,
  projects,
  emailTemplates,
  glossaryTerms,
  zones,
  maintenanceBrands,
  comparators,
  comparatorRows,
  comparatorUseCases,
  comparatorFaqs,
  depannageServices,
} from "./schema";
import { eq } from "drizzle-orm";
import { services as staticServices } from "../data/services";
import { blogPosts as staticBlog } from "../data/blog";
import { testimonials as staticTestimonials } from "../data/testimonials";
import { clients as staticClients } from "../data/clients";
import { realisations as staticProjects } from "../data/realisations";
import { homepageFAQ } from "../data/faq";
import { glossary as staticGlossary } from "../data/glossary";
import { zones as staticZones } from "../data/zones";
import { brands as staticBrands } from "../data/brands";
import { comparatifs as staticComparators } from "../data/comparatifs";
import { depannageServices as staticDepannage } from "../data/depannage";
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
      { name: "Otman Fariad", role: "Président / Fondateur", expertise: "Expert métallerie et gestion de projet.", initials: "OF" },
      { name: "Bureau d'étude", role: "Conception & calcul", expertise: "Modélisation 3D, notes de calcul Eurocode 3, plans d'exécution.", initials: "BE" },
      { name: "Atelier", role: "Fabrication & soudure", expertise: "Soudeurs qualifiés MAG/TIG, travail de l'acier, inox et aluminium.", initials: "AT" },
      { name: "Chantier", role: "Pose & installation", expertise: "Équipes terrain formées au travail en hauteur.", initials: "CH" },
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
        name: "Réponse standard contact",
        subject: "Re : votre demande IEF & CO",
        bodyHtml: `<p>Bonjour {{firstName}},</p>
<p>Merci pour votre message. Nous avons bien reçu votre demande et reviendrons vers vous dans les meilleurs délais (sous 24h ouvrées).</p>
<p>Si votre demande est urgente, n'hésitez pas à nous joindre au <strong>01 34 05 87 03</strong>.</p>
<p>Cordialement,<br>L'équipe IEF &amp; CO</p>`,
        variables: "firstName,lastName,email",
      },
      {
        key: "reply-devis",
        name: "Réponse devis",
        subject: "Votre demande de devis pour {{serviceTitle}}",
        bodyHtml: `<p>Bonjour {{firstName}},</p>
<p>Nous avons bien reçu votre demande de devis pour <strong>{{serviceTitle}}</strong>.</p>
<p>Notre bureau d'étude analyse votre projet et reviendra vers vous sous 48h ouvrées avec une proposition chiffrée.</p>
<p>Pour toute question complémentaire ou si vous souhaitez planifier une visite technique, contactez-nous au <strong>01 34 05 87 03</strong>.</p>
<p>Cordialement,<br>L'équipe IEF &amp; CO</p>`,
        variables: "firstName,serviceTitle,company",
      },
      {
        key: "reminder-maintenance",
        name: "Rappel visite de maintenance",
        subject: "Rappel : visite de maintenance le {{visitDate}}",
        bodyHtml: `<p>Bonjour,</p>
<p>Ceci est un rappel pour la visite de maintenance de votre <strong>{{equipmentType}}</strong> prévue le <strong>{{visitDate}}</strong>.</p>
<p>Notre technicien interviendra dans le créneau convenu. Merci de prévoir l'accès aux équipements.</p>
<p>En cas d'empêchement, contactez-nous au <strong>01 34 05 87 03</strong> au moins 24h à l'avance.</p>
<p>Cordialement,<br>L'équipe IEF &amp; CO</p>`,
        variables: "equipmentType,visitDate,firstName",
      },
      {
        key: "welcome-contract",
        name: "Bienvenue contrat de maintenance",
        subject: "Bienvenue parmi nos clients sous contrat",
        bodyHtml: `<p>Bonjour {{firstName}},</p>
<p>Bienvenue parmi les clients sous contrat de maintenance IEF &amp; CO.</p>
<p>Votre contrat est désormais actif. Vous bénéficiez d'un suivi personnalisé, d'un accès prioritaire en cas d'urgence et de visites préventives planifiées.</p>
<p>Votre interlocuteur reste joignable au <strong>01 34 05 87 03</strong> ou par email à <a href="mailto:contact@iefandco.com">contact@iefandco.com</a>.</p>
<p>Au plaisir de collaborer avec vous,<br>L'équipe IEF &amp; CO</p>`,
        variables: "firstName,company",
      },
    ];
    for (const t of templates) {
      await db.insert(emailTemplates).values({ id: cuid(), ...t });
    }
    console.log(`   ✓ Seeded ${templates.length} email templates`);
  }

  // ── Glossary ──
  const existingGloss = await db.select().from(glossaryTerms).limit(1);
  if (existingGloss.length === 0) {
    for (let i = 0; i < staticGlossary.length; i++) {
      const t = staticGlossary[i];
      await db.insert(glossaryTerms).values({
        id: cuid(),
        slug: t.slug,
        term: t.term,
        category: t.category,
        shortDef: t.shortDef,
        fullDef: t.fullDef,
        relatedSlugs: t.related ? t.related.join(",") : null,
        relatedServices: t.relatedServices ? t.relatedServices.join(",") : null,
        orderIdx: i,
      });
    }
    console.log(`   ✓ Seeded ${staticGlossary.length} glossary terms`);
  }

  // ── Zones ──
  const existingZones = await db.select().from(zones).limit(1);
  if (existingZones.length === 0) {
    for (let i = 0; i < staticZones.length; i++) {
      const z = staticZones[i];
      await db.insert(zones).values({
        id: cuid(),
        slug: z.slug,
        name: z.name,
        code: z.code,
        region: z.region,
        tagline: z.tagline,
        intro: z.intro,
        cities: z.cities.join(","),
        slaUrgence: z.slaUrgence,
        slaStandard: z.slaStandard,
        hubs: z.hubs.join(","),
        kpisJson: JSON.stringify(z.kpis),
        testimonialJson: z.testimonial ? JSON.stringify(z.testimonial) : null,
        faqJson: JSON.stringify(z.faq),
        centerLat: String(z.center.lat),
        centerLng: String(z.center.lng),
        seoTitle: z.seo.title,
        seoDescription: z.seo.description,
        orderIdx: i,
      });
    }
    console.log(`   ✓ Seeded ${staticZones.length} zones`);
  }

  // ── Maintenance brands ──
  const existingBrands = await db.select().from(maintenanceBrands).limit(1);
  if (existingBrands.length === 0) {
    for (let i = 0; i < staticBrands.length; i++) {
      const b = staticBrands[i];
      await db.insert(maintenanceBrands).values({
        id: cuid(),
        slug: b.slug,
        name: b.name,
        tagline: b.tagline,
        intro: b.intro,
        productsJson: JSON.stringify(b.products),
        failuresJson: JSON.stringify(b.commonFailures),
        strengthsJson: JSON.stringify(b.advantages),
        faqJson: JSON.stringify(b.faq),
        accentColor: b.accentColor,
        seoTitle: b.seo.title,
        seoDescription: b.seo.description,
        orderIdx: i,
      });
    }
    console.log(`   ✓ Seeded ${staticBrands.length} maintenance brands`);
  }

  // ── Comparators (+ rows, use cases, faqs) ──
  const existingComps = await db.select().from(comparators).limit(1);
  if (existingComps.length === 0) {
    for (let i = 0; i < staticComparators.length; i++) {
      const c = staticComparators[i];
      const compId = cuid();
      await db.insert(comparators).values({
        id: compId,
        slug: c.slug,
        title: c.title,
        optionAName: c.optionAName,
        optionBName: c.optionBName,
        tagline: c.tagline,
        intro: c.intro,
        verdict: c.verdict,
        category: c.category,
        accent: c.accent,
        seoTitle: c.seo.title,
        seoDescription: c.seo.description,
        orderIdx: i,
      });
      for (let j = 0; j < c.rows.length; j++) {
        const r = c.rows[j];
        await db.insert(comparatorRows).values({
          id: cuid(),
          comparatorId: compId,
          criterion: r.criterion,
          optionA: r.optionA,
          optionB: r.optionB,
          winner: r.winner,
          orderIdx: j,
        });
      }
      for (let j = 0; j < c.useCases.length; j++) {
        const u = c.useCases[j];
        await db.insert(comparatorUseCases).values({
          id: cuid(),
          comparatorId: compId,
          scenario: u.scenario,
          recommendation: u.recommendation,
          reason: u.reason,
          orderIdx: j,
        });
      }
      for (let j = 0; j < c.faq.length; j++) {
        const f = c.faq[j];
        await db.insert(comparatorFaqs).values({
          id: cuid(),
          comparatorId: compId,
          question: f.question,
          answer: f.answer,
          orderIdx: j,
        });
      }
    }
    console.log(`   ✓ Seeded ${staticComparators.length} comparators (+ rows + useCases + faqs)`);
  }

  // ── Dépannage services ──
  const existingDep = await db.select().from(depannageServices).limit(1);
  if (existingDep.length === 0) {
    for (let i = 0; i < staticDepannage.length; i++) {
      const d = staticDepannage[i];
      await db.insert(depannageServices).values({
        id: cuid(),
        slug: d.slug,
        label: d.label,
        tagline: d.tagline,
        intro: d.intro,
        businessImpact: d.businessImpact,
        accentColor: d.accentColor,
        brands: d.brands.join(","),
        failuresJson: JSON.stringify(d.commonFailures),
        partsInStock: d.partsInStock.join(","),
        relatedServices: d.relatedServices.join(","),
        seoTitle: d.seo.title,
        seoDescription: d.seo.description,
        orderIdx: i,
      });
    }
    console.log(`   ✓ Seeded ${staticDepannage.length} dépannage services`);
  }

  console.log("✅ Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
