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
