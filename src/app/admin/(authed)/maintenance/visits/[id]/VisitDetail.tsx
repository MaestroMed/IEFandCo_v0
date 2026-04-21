"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Calendar, CheckCircle2, Download, Loader2, Trash2, Wrench } from "lucide-react";
import { deleteVisit, markVisitDone, updateVisit } from "../../actions";
import { VISIT_STATUSES, VISIT_STATUS_LABELS, VISIT_TYPE_LABELS } from "../../constants";
import type { Equipment, MaintenanceVisit, Site, User } from "@/db/schema";

interface Props {
  visit: MaintenanceVisit;
  site: Site | null;
  equipment: Equipment | null;
  technician: Pick<User, "id" | "name" | "email"> | null;
}

const inputCls = "w-full rounded-lg px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30";
const inputStyle = { background: "var(--bg-surface)", border: "1px solid var(--border)", color: "var(--text)" };

export function VisitDetail({ visit, site, equipment, technician }: Props) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [reportMd, setReportMd] = useState(visit.reportMd || "");
  const [duration, setDuration] = useState(visit.durationMinutes ? String(visit.durationMinutes) : "");
  const [status, setStatus] = useState(visit.status);
  const [notes, setNotes] = useState(visit.notes || "");

  function handleSave() {
    start(async () => {
      const res = await updateVisit(visit.id, {
        status,
        reportMd,
        durationMinutes: duration ? Number(duration) : null,
        notes,
      });
      if (res.ok) {
        toast.success("Enregistre");
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  function handleMarkDone() {
    start(async () => {
      const res = await markVisitDone(visit.id, duration ? Number(duration) : undefined, reportMd);
      if (res.ok) {
        toast.success("Visite cloturee");
        setStatus("done");
        router.refresh();
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  function handleDelete() {
    start(async () => {
      const res = await deleteVisit(visit.id);
      if (res.ok) {
        toast.success("Visite supprimee");
        router.push("/admin/maintenance/visits");
      } else {
        toast.error(res.error || "Erreur");
      }
    });
  }

  function downloadPV() {
    const dateStr = new Date(visit.scheduledFor).toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" });
    const doneStr = visit.doneAt ? new Date(visit.doneAt).toLocaleString("fr-FR", { dateStyle: "full", timeStyle: "short" }) : "—";

    const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>PV de visite ${visit.id.slice(0, 8)} — IEF & CO</title>
<style>
  body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #1a1a1a; max-width: 780px; margin: 32px auto; padding: 0 32px; }
  header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 16px; border-bottom: 2px solid #c4855c; margin-bottom: 24px; }
  .brand { font-weight: 800; font-size: 24px; letter-spacing: -0.02em; }
  .brand span { color: #c4855c; }
  .label { color: #666; text-transform: uppercase; letter-spacing: 0.15em; font-size: 10px; font-family: monospace; margin-bottom: 4px; }
  h1 { font-size: 20px; margin: 0 0 4px; }
  h2 { font-size: 14px; margin: 24px 0 8px; padding-bottom: 4px; border-bottom: 1px solid #ddd; text-transform: uppercase; letter-spacing: 0.1em; color: #c4855c; }
  table.kv td { padding: 4px 0; vertical-align: top; }
  table.kv td:first-child { color: #666; width: 180px; padding-right: 16px; }
  pre.report { background: #f5f5f0; padding: 16px; border-left: 3px solid #c4855c; white-space: pre-wrap; font-family: inherit; line-height: 1.6; font-size: 13px; }
  .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-top: 48px; }
  .signature { border-top: 1px solid #999; padding-top: 8px; min-height: 80px; }
  .signature .name { font-size: 11px; color: #666; }
  footer { margin-top: 64px; padding-top: 16px; border-top: 1px solid #ddd; text-align: center; font-size: 10px; color: #888; }
  @media print { body { margin: 0; max-width: none; } header { padding-top: 16px; } }
</style>
</head>
<body>
  <header>
    <div>
      <div class="brand">IEF<span>&amp;</span>CO</div>
      <div style="font-size: 11px; color: #666; margin-top: 4px;">Constructions metalliques · Maintenance industrielle</div>
    </div>
    <div style="text-align: right;">
      <div class="label">PV n°</div>
      <div style="font-family: monospace; font-size: 14px;">${escapeHtml(visit.id.slice(0, 8).toUpperCase())}</div>
    </div>
  </header>

  <h1>Proces-verbal de visite de maintenance</h1>
  <p style="color: #666; margin-top: 0;">Type : <strong>${escapeHtml(VISIT_TYPE_LABELS[visit.type as keyof typeof VISIT_TYPE_LABELS])}</strong> · Status : <strong>${escapeHtml(VISIT_STATUS_LABELS[visit.status as keyof typeof VISIT_STATUS_LABELS])}</strong></p>

  <h2>Site</h2>
  <table class="kv">
    <tr><td>Client</td><td>${escapeHtml(site?.clientName || "—")}</td></tr>
    <tr><td>Site</td><td>${escapeHtml(site?.label || "—")}</td></tr>
    <tr><td>Adresse</td><td>${escapeHtml([site?.address, site?.postalCode, site?.city].filter(Boolean).join(", ") || "—")}</td></tr>
    <tr><td>Contact sur place</td><td>${escapeHtml(site?.contactName || "—")} ${site?.contactPhone ? `· ${escapeHtml(site.contactPhone)}` : ""}</td></tr>
  </table>

  <h2>Equipement</h2>
  <table class="kv">
    <tr><td>Type</td><td>${escapeHtml(equipment?.type || "—")}</td></tr>
    <tr><td>Libelle</td><td>${escapeHtml(equipment?.label || "—")}</td></tr>
    <tr><td>Marque / modele</td><td>${escapeHtml([equipment?.brand, equipment?.model].filter(Boolean).join(" ") || "—")}</td></tr>
    <tr><td>N° serie</td><td>${escapeHtml(equipment?.serial || "—")}</td></tr>
    <tr><td>Localisation</td><td>${escapeHtml(equipment?.location || "—")}</td></tr>
  </table>

  <h2>Intervention</h2>
  <table class="kv">
    <tr><td>Date prevue</td><td>${escapeHtml(dateStr)}</td></tr>
    <tr><td>Date realisee</td><td>${escapeHtml(doneStr)}</td></tr>
    <tr><td>Duree</td><td>${visit.durationMinutes ? `${visit.durationMinutes} min` : "—"}</td></tr>
    <tr><td>Technicien</td><td>${escapeHtml(technician?.name || "—")}</td></tr>
  </table>

  <h2>Rapport d&rsquo;intervention</h2>
  <pre class="report">${escapeHtml(reportMd || "Aucun rapport saisi.")}</pre>

  <div class="signatures">
    <div>
      <div class="signature"><div class="name">Signature technicien IEF &amp; CO</div></div>
    </div>
    <div>
      <div class="signature"><div class="name">Signature client</div></div>
    </div>
  </div>

  <footer>
    IEF &amp; CO · 01 34 05 87 03 · contact@iefandco.com<br>
    Conformite EN 1090-1 (EXC2) · Documentation conservee 10 ans
  </footer>

  <script>setTimeout(() => window.print(), 400);</script>
</body>
</html>`;

    const w = window.open("", "_blank");
    if (!w) {
      toast.error("Le navigateur bloque la fenetre, autorisez les popups");
      return;
    }
    w.document.open();
    w.document.write(html);
    w.document.close();
  }

  return (
    <div className="p-8 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6 min-w-0">
        {/* Identity */}
        <div className="rounded-xl p-6" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
                  style={{ background: "rgba(196,133,92,0.12)", color: "var(--color-copper)" }}>
                  {VISIT_TYPE_LABELS[visit.type as keyof typeof VISIT_TYPE_LABELS]}
                </span>
                <VisitStatusPill status={status} />
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold" style={{ color: "var(--text)" }}>
                {site?.clientName || "Site"} {site?.label && <span style={{ color: "var(--text-muted)" }}>— {site.label}</span>}
              </h2>
              {equipment && (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  <Wrench className="inline h-3 w-3 mr-1" />
                  {equipment.label || equipment.type}
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                {new Date(visit.scheduledFor).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
              <p className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                {new Date(visit.scheduledFor).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>
        </div>

        {/* Report */}
        <section className="rounded-xl p-6 space-y-4" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <h3 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Rapport d&apos;intervention</h3>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Markdown supporte. Decrivez ce qui a ete fait, les points de controle, defauts releves et recommandations.
          </p>
          <textarea
            value={reportMd}
            onChange={(e) => setReportMd(e.target.value)}
            rows={16}
            placeholder={`# Operations realisees\n- Controle visuel general\n- Test de cycle complet\n- Graissage articulations\n\n# Constatations\n\n# Recommandations`}
            className="w-full rounded-lg px-3 py-3 text-sm font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 resize-y"
            style={inputStyle}
          />
        </section>

        {/* Notes */}
        <section className="rounded-xl p-6 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <h3 className="font-display font-semibold text-base" style={{ color: "var(--text)" }}>Notes internes</h3>
          <textarea className={inputCls} style={inputStyle} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </section>
      </div>

      {/* Sidebar */}
      <aside className="space-y-4">
        <div className="rounded-xl p-5 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <h3 className="font-mono text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Status</h3>
          <select className={inputCls} style={inputStyle} value={status} onChange={(e) => setStatus(e.target.value as typeof status)}>
            {VISIT_STATUSES.map((s) => (
              <option key={s} value={s}>{VISIT_STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        <div className="rounded-xl p-5 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <h3 className="font-mono text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Duree</h3>
          <div className="flex items-center gap-2">
            <input type="number" min={0} value={duration} onChange={(e) => setDuration(e.target.value)} className={`${inputCls} font-mono`} style={inputStyle} placeholder="0" />
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>min</span>
          </div>
        </div>

        <div className="rounded-xl p-5 space-y-3" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <h3 className="font-mono text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Technicien</h3>
          <p className="text-sm" style={{ color: "var(--text)" }}>{technician?.name || "Non assigne"}</p>
          {technician?.email && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{technician.email}</p>}
        </div>

        <div className="rounded-xl p-5 space-y-2" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <h3 className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Actions</h3>
          <button
            onClick={handleSave}
            disabled={pending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Enregistrer
          </button>
          {visit.status !== "done" && (
            <button
              onClick={handleMarkDone}
              disabled={pending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: "#3CAA8C" }}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Marquer comme terminee
            </button>
          )}
          <button
            onClick={downloadPV}
            className="w-full inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium"
            style={{ border: "1px solid var(--border)", color: "var(--text)" }}
          >
            <Download className="h-3.5 w-3.5" /> Generer PV
          </button>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} className="w-full inline-flex items-center justify-center gap-2 text-xs text-primary hover:opacity-80 pt-2">
              <Trash2 className="h-3.5 w-3.5" /> Supprimer
            </button>
          ) : (
            <div className="space-y-2 pt-2">
              <p className="text-xs" style={{ color: "var(--text)" }}>Confirmer ?</p>
              <div className="flex gap-2">
                <button onClick={handleDelete} disabled={pending} className="flex-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">
                  Oui
                </button>
                <button onClick={() => setConfirmDelete(false)} className="flex-1 rounded-lg px-3 py-1.5 text-xs" style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
                  Non
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl p-5" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <h3 className="font-mono text-xs uppercase tracking-wider mb-2" style={{ color: "var(--text-muted)" }}>Historique</h3>
          <ul className="space-y-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <li className="flex gap-2">
              <Calendar className="h-3 w-3 mt-0.5 shrink-0" />
              <span>Cree le {new Date(visit.createdAt).toLocaleDateString("fr-FR")}</span>
            </li>
            {visit.doneAt && (
              <li className="flex gap-2">
                <CheckCircle2 className="h-3 w-3 mt-0.5 shrink-0" style={{ color: "#3CAA8C" }} />
                <span>Cloturee le {new Date(visit.doneAt).toLocaleString("fr-FR")}</span>
              </li>
            )}
          </ul>
        </div>
      </aside>
    </div>
  );
}

function VisitStatusPill({ status }: { status: string }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    scheduled: { bg: "rgba(59,130,180,0.12)", fg: "#3B82B4" },
    in_progress: { bg: "rgba(196,133,92,0.15)", fg: "var(--color-copper)" },
    done: { bg: "rgba(60,170,140,0.15)", fg: "#3CAA8C" },
    cancelled: { bg: "var(--bg-muted)", fg: "var(--text-muted)" },
  };
  const c = colors[status] || colors.scheduled;
  return (
    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider" style={{ background: c.bg, color: c.fg }}>
      {VISIT_STATUS_LABELS[status as keyof typeof VISIT_STATUS_LABELS] || status}
    </span>
  );
}

function escapeHtml(str: string | null | undefined): string {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
