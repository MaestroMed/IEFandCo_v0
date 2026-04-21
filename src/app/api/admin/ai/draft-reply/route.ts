/**
 * AI-drafted lead reply.
 *
 * If ANTHROPIC_API_KEY is set, calls the Anthropic Messages API with
 * claude-sonnet-4-5 to generate a personalized response. Otherwise returns
 * a templated draft with a `dev: true` flag so the UI can hint that we're
 * in dev mode.
 */

import { NextResponse } from "next/server";
import { db, schema } from "@/db";
import { getSession } from "@/lib/admin/auth";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const MODEL = "claude-sonnet-4-5";

const SYSTEM_PROMPT = `Tu es l'assistant commercial de IEF & CO, une entreprise familiale de metallerie et serrurerie basee en region parisienne, fondee dans les annees 1980. Specialites : portes industrielles, portails, structures metalliques, menuiserie, coupe-feu, automatismes, maintenance preventive et corrective.

Ton role : rediger une reponse en francais, professionnelle et chaleureuse, a un message recu via le formulaire de contact ou de devis du site iefandco.com.

Regles strictes :
- Reponse en francais soutenu mais accessible (pas de "vous etes" sur-poli, pas de jargon corporate).
- Maximum 6 phrases.
- Toujours commencer par "Bonjour {prenom}," (sans emoji).
- Reformuler brievement la demande pour montrer qu'on a bien lu.
- Annoncer un prochain pas concret (rappel sous 24h, visite technique, devis chiffre, etc.).
- Mentionner notre numero direct : 01 34 05 87 03.
- Signer simplement "L'equipe IEF & CO" — la signature de l'utilisateur est ajoutee automatiquement, donc ne pas signer avec un prenom.
- Ne pas inventer de prix, delais precis, ou engagements techniques.
- Pas d'emojis, pas de markdown, pas de **gras**, juste du texte brut paragraphes.`;

function buildTemplate(lead: { firstName: string; service?: string | null; subject?: string | null }) {
  const subj = lead.subject || lead.service || "votre demande";
  return `Bonjour ${lead.firstName},

Merci pour votre message concernant ${subj}.

Nous avons bien pris en compte votre demande. Un membre de notre equipe vous contactera dans les 24h pour discuter plus en detail de votre projet et organiser, si necessaire, une visite technique.

Dans l'intervalle, n'hesitez pas a nous joindre directement au 01 34 05 87 03.

Cordialement,
L'equipe IEF & CO`;
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  try {
    const body = (await req.json()) as { leadId?: string };
    if (!body.leadId) return NextResponse.json({ ok: false, error: "leadId requis" }, { status: 400 });

    const lead = (await db.select().from(schema.leads).where(eq(schema.leads.id, body.leadId)).limit(1))[0];
    if (!lead) return NextResponse.json({ ok: false, error: "Lead introuvable" }, { status: 404 });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ ok: true, draft: buildTemplate(lead), dev: true });
    }

    const userPrompt = `Demande recue le ${new Date(lead.receivedAt).toLocaleDateString("fr-FR")}.
Type : ${lead.type === "devis" ? "demande de devis" : "contact"}
Prenom : ${lead.firstName}
Nom : ${lead.lastName}
${lead.company ? `Entreprise : ${lead.company}` : ""}
${lead.service ? `Service concerne : ${lead.service}` : ""}
${lead.subject ? `Sujet : ${lead.subject}` : ""}

Message du client :
"""
${lead.message}
"""

Redige la reponse maintenant.`;

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 600,
        system: [
          { type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
        ],
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!r.ok) {
      const txt = await r.text();
      console.error("[anthropic]", r.status, txt);
      return NextResponse.json({
        ok: true,
        draft: buildTemplate(lead),
        dev: true,
        warning: `Anthropic API a renvoye ${r.status}, fallback template utilise.`,
      });
    }

    const data = await r.json() as {
      content: { type: string; text?: string }[];
    };
    const text = (data.content || [])
      .filter((b) => b.type === "text" && typeof b.text === "string")
      .map((b) => b.text as string)
      .join("\n")
      .trim();

    if (!text) {
      return NextResponse.json({ ok: true, draft: buildTemplate(lead), dev: true, warning: "Reponse vide, fallback utilise." });
    }
    return NextResponse.json({ ok: true, draft: text });
  } catch (e) {
    console.error("[ai draft-reply]", e);
    return NextResponse.json({ ok: false, error: (e as Error).message }, { status: 500 });
  }
}
