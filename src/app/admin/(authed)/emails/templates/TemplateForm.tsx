"use client";

import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import DOMPurify from "isomorphic-dompurify";
import { createTemplate, deleteTemplate, updateTemplate } from "../actions";
import { DEFAULT_TEMPLATE_VARIABLES } from "../constants";

interface TemplateFormProps {
  templateId?: string;
  initial?: {
    key?: string;
    name?: string;
    subject?: string;
    bodyHtml?: string;
    variables?: string | null;
  };
}

const labelCls = "block text-[11px] font-mono uppercase tracking-[0.15em] mb-1.5";
const inputCls = "w-full rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

const SAMPLE_VALUES: Record<string, string> = {
  firstName: "Camille",
  lastName: "Durand",
  email: "camille@exemple.fr",
  company: "Logistique Roissy SAS",
  serviceTitle: "Portail industriel coulissant",
  equipmentType: "Porte sectionnelle",
  visitDate: new Date().toLocaleDateString("fr-FR"),
};

function renderTemplate(text: string, vars: Record<string, string>): string {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, k) => vars[k] ?? `{{${k}}}`);
}

export function TemplateForm({ templateId, initial }: TemplateFormProps) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [form, setForm] = useState({
    key: initial?.key || "",
    name: initial?.name || "",
    subject: initial?.subject || "",
    bodyHtml: initial?.bodyHtml || "",
    variables: initial?.variables || "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const previewVars = useMemo(() => {
    const declared = (form.variables || DEFAULT_TEMPLATE_VARIABLES.join(",")).split(",").map((s) => s.trim()).filter(Boolean);
    const map: Record<string, string> = {};
    for (const v of declared) map[v] = SAMPLE_VALUES[v] ?? `[${v}]`;
    return map;
  }, [form.variables]);

  const renderedSubject = useMemo(() => renderTemplate(form.subject, previewVars), [form.subject, previewVars]);
  const renderedBody = useMemo(() => {
    const raw = renderTemplate(form.bodyHtml, previewVars);
    return DOMPurify.sanitize(raw, { USE_PROFILES: { html: true } });
  }, [form.bodyHtml, previewVars]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.subject.trim() || !form.bodyHtml.trim()) {
      toast.error("Nom, sujet et corps requis");
      return;
    }
    if (!templateId && !form.key.trim()) {
      toast.error("Cle requise");
      return;
    }
    start(async () => {
      const payload = {
        name: form.name,
        subject: form.subject,
        bodyHtml: form.bodyHtml,
        variables: form.variables || null,
      };
      const res = templateId
        ? await updateTemplate(templateId, payload)
        : await createTemplate({ ...payload, key: form.key.trim() });
      if (res.ok) {
        toast.success(templateId ? "Template mis a jour" : "Template cree");
        if (!templateId && "id" in res) router.push(`/admin/emails/templates/${res.id}`);
        else router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  function onDelete() {
    if (!templateId) return;
    start(async () => {
      const res = await deleteTemplate(templateId);
      if (res.ok) {
        toast.success("Template supprime");
        router.push("/admin/emails/templates");
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-mono" style={{ color: "var(--text-muted)" }}>
          {pending && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" /> En cours...
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => router.push("/admin/emails/templates")}
            className="rounded-lg border px-5 py-2.5 text-sm font-medium"
            style={{ borderColor: "var(--border)", color: "var(--text)" }}
          >
            Annuler
          </button>
          <button type="submit" disabled={pending} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            {templateId ? "Enregistrer" : "Creer le template"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Identite</h2>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Nom</label>
              <input className={inputCls} style={inputStyle} value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Reponse standard contact" />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Cle</label>
              <input
                className={`${inputCls} font-mono`}
                style={{ ...inputStyle, opacity: templateId ? 0.6 : 1 }}
                value={form.key}
                onChange={(e) => update("key", e.target.value)}
                readOnly={!!templateId}
                placeholder="reply-contact"
              />
              <p className="mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                Identifiant interne, immuable apres creation. Ex: reply-contact, reply-devis, reminder-maintenance.
              </p>
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Sujet</label>
              <input className={inputCls} style={inputStyle} value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="Re: votre demande" />
            </div>
            <div>
              <label className={labelCls} style={{ color: "var(--text-muted)" }}>Variables (separees par virgules)</label>
              <input className={`${inputCls} font-mono`} style={inputStyle} value={form.variables} onChange={(e) => update("variables", e.target.value)} placeholder="firstName,serviceTitle" />
              <p className="mt-1 text-[10px]" style={{ color: "var(--text-muted)" }}>
                Utilisez {`{{firstName}}`} dans le sujet ou le corps pour interpoler.
              </p>
            </div>
          </section>

          <section className="rounded-xl p-6 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Corps HTML / texte</h2>
            <textarea
              className={`${inputCls} font-mono`}
              style={{ ...inputStyle, minHeight: 320 }}
              rows={14}
              value={form.bodyHtml}
              onChange={(e) => update("bodyHtml", e.target.value)}
              placeholder="<p>Bonjour {{firstName}},</p>"
            />
          </section>

          {templateId && (
            <section className="rounded-xl p-6 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
              <h2 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Zone dangereuse</h2>
              {!confirmDelete ? (
                <button type="button" onClick={() => setConfirmDelete(true)} className="inline-flex items-center gap-2 text-sm text-primary hover:opacity-80">
                  <Trash2 className="h-3.5 w-3.5" /> Supprimer ce template
                </button>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs" style={{ color: "var(--text)" }}>Confirmer la suppression ?</p>
                  <div className="flex gap-2">
                    <button type="button" onClick={onDelete} disabled={pending} className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">
                      Supprimer
                    </button>
                    <button type="button" onClick={() => setConfirmDelete(false)} className="rounded-lg px-3 py-1.5 text-xs" style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                      Annuler
                    </button>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl overflow-hidden sticky top-24" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-muted)" }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--color-copper)" }}>
                Apercu
              </p>
              <p className="mt-1 text-sm font-medium" style={{ color: "var(--text)" }}>{renderedSubject || "(sujet vide)"}</p>
            </div>
            <div className="p-4 prose prose-sm max-w-none" style={{ color: "var(--text)" }}>
              <div dangerouslySetInnerHTML={{ __html: renderedBody || "<em style='color: var(--text-muted)'>(corps vide)</em>" }} />
            </div>
            <div className="px-4 py-3" style={{ borderTop: "1px solid var(--border)", background: "var(--bg-muted)" }}>
              <p className="text-[10px] font-mono uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Valeurs de demonstration</p>
              <dl className="space-y-1 text-xs">
                {Object.entries(previewVars).map(([k, v]) => (
                  <div key={k} className="flex gap-2">
                    <dt className="font-mono" style={{ color: "var(--color-copper)" }}>{`{{${k}}}`}</dt>
                    <dd style={{ color: "var(--text-muted)" }}>{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </aside>
      </div>
    </form>
  );
}
