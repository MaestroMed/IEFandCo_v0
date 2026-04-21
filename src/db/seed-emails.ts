/**
 * Seed default email templates only.
 * Run with: npx tsx src/db/seed-emails.ts
 */

import { db } from "./index";
import { emailTemplates } from "./schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";

function cuid() {
  return randomUUID().replace(/-/g, "").slice(0, 24);
}

const TEMPLATES = [
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

async function main() {
  console.log("📧 Seeding email templates...");
  let inserted = 0;
  let skipped = 0;
  for (const t of TEMPLATES) {
    const existing = await db.select().from(emailTemplates).where(eq(emailTemplates.key, t.key)).limit(1);
    if (existing.length > 0) {
      skipped++;
      continue;
    }
    await db.insert(emailTemplates).values({ id: cuid(), ...t });
    inserted++;
  }
  console.log(`   ✓ Inserted ${inserted}, skipped ${skipped} existing`);
  console.log("✅ Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
