"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Mail, Phone, Building2, Globe, Calendar, MessageSquare, Send, Trash2, UserPlus, FileText } from "lucide-react";
import { updateLeadStatus, addLeadNote, replyToLead, deleteLead } from "../actions";
import { LEAD_STATUSES } from "../constants";
import { AIReplyButton } from "@/components/admin/AIReplyButton";
import type { Lead, LeadEvent, User } from "@/db/schema";

interface Props {
  lead: Lead;
  events: { event: LeadEvent; actor: Pick<User, "id" | "name" | "email"> | null }[];
}

const STATUS_LABELS: Record<string, string> = {
  new: "Nouveau",
  contacted: "Contacte",
  in_progress: "En cours",
  quoted: "Devis envoye",
  won: "Gagne",
  lost: "Perdu",
};

export function LeadDetail({ lead, events }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState<"message" | "reply" | "note" | "timeline">("message");
  const [replySubject, setReplySubject] = useState(`Re: ${lead.subject || "Votre demande IEF & CO"}`);
  const [replyBody, setReplyBody] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [lossReason, setLossReason] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const payload = lead.payloadJson ? JSON.parse(lead.payloadJson) as Record<string, string> : {};

  function handleStatusChange(status: typeof LEAD_STATUSES[number]) {
    startTransition(async () => {
      const result = await updateLeadStatus(lead.id, status, status === "lost" ? lossReason : undefined);
      if (result.ok) toast.success(`Statut change : ${STATUS_LABELS[status]}`);
      else toast.error(result.error || "Erreur");
    });
  }

  function handleReply(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await replyToLead(lead.id, replySubject, replyBody);
      if (result.ok) {
        toast.success("Reponse envoyee");
        setReplyBody("");
        setActiveTab("timeline");
      } else {
        toast.error(result.error || "Erreur");
      }
    });
  }

  function handleAddNote(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const result = await addLeadNote(lead.id, noteContent);
      if (result.ok) {
        toast.success("Note ajoutee");
        setNoteContent("");
        setActiveTab("timeline");
      } else {
        toast.error(result.error || "Erreur");
      }
    });
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteLead(lead.id);
      if (result.ok) {
        toast.success("Lead supprime");
        router.push("/admin/leads");
      }
    });
  }

  return (
    <div className="p-8 grid gap-6 lg:grid-cols-[1fr_320px]">
      {/* Main column */}
      <div className="space-y-6 min-w-0">
        {/* Identity card */}
        <div className="rounded-xl p-6" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider"
                  style={{
                    background: lead.type === "devis" ? "rgba(225,16,33,0.1)" : "rgba(196,133,92,0.1)",
                    color: lead.type === "devis" ? "var(--color-primary)" : "var(--color-copper)",
                  }}>
                  {lead.type}
                </span>
                {lead.priority === "high" && (
                  <span className="text-xs text-primary font-semibold">● URGENT</span>
                )}
              </div>
              <h2 className="mt-2 font-display text-2xl font-bold" style={{ color: "var(--text)" }}>
                {lead.firstName} {lead.lastName}
              </h2>
              {lead.company && (
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>{lead.company}</p>
              )}
            </div>
            <div className="text-right">
              <p className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                Recu le {new Date(lead.receivedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
              <p className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                {new Date(lead.receivedAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
              </p>
            </div>
          </div>

          {/* Contact quick links */}
          <div className="flex flex-wrap gap-2 mt-4">
            <a
              href={`mailto:${lead.email}`}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors hover:bg-[var(--bg-muted)]"
              style={{ border: "1px solid var(--border)", color: "var(--text)" }}
            >
              <Mail className="h-3.5 w-3.5" /> {lead.email}
            </a>
            {lead.phone && (
              <a
                href={`tel:${lead.phone}`}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition-colors hover:bg-[var(--bg-muted)]"
                style={{ border: "1px solid var(--border)", color: "var(--text)" }}
              >
                <Phone className="h-3.5 w-3.5" /> {lead.phone}
              </a>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b" style={{ borderColor: "var(--border)" }}>
          {[
            { key: "message", label: "Message", icon: MessageSquare },
            { key: "reply", label: "Repondre", icon: Send },
            { key: "note", label: "Ajouter note", icon: FileText },
            { key: "timeline", label: `Timeline (${events.length})`, icon: Calendar },
          ].map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key as typeof activeTab)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm transition-colors border-b-2"
                style={{
                  borderColor: active ? "var(--color-primary)" : "transparent",
                  color: active ? "var(--text)" : "var(--text-muted)",
                  fontWeight: active ? 600 : 400,
                }}
              >
                <Icon className="h-3.5 w-3.5" />
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="rounded-xl p-6" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          {activeTab === "message" && (
            <div className="space-y-4">
              {lead.subject && (
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Sujet</p>
                  <p className="font-semibold" style={{ color: "var(--text)" }}>{lead.subject}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Message</p>
                <div className="whitespace-pre-wrap leading-relaxed" style={{ color: "var(--text)" }}>{lead.message}</div>
              </div>
              {Object.keys(payload).length > 0 && (
                <div>
                  <p className="text-xs font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Details supplementaires</p>
                  <dl className="space-y-1">
                    {Object.entries(payload).filter(([, v]) => v).map(([k, v]) => (
                      <div key={k} className="flex gap-3 text-sm">
                        <dt className="w-24 capitalize" style={{ color: "var(--text-muted)" }}>{k}</dt>
                        <dd style={{ color: "var(--text)" }}>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          )}

          {activeTab === "reply" && (
            <form onSubmit={handleReply} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>A</label>
                <input
                  type="text"
                  value={lead.email}
                  readOnly
                  className="w-full rounded-lg px-3 py-2 text-sm"
                  style={{ border: "1px solid var(--border)", background: "var(--bg-muted)", color: "var(--text-muted)" }}
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>Sujet</label>
                <input
                  type="text"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  required
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary"
                  style={{ border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" }}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Message</label>
                  <AIReplyButton leadId={lead.id} onUse={(text) => setReplyBody(text)} />
                </div>
                <textarea
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  required
                  rows={10}
                  placeholder={`Bonjour ${lead.firstName},\n\nMerci pour votre demande...\n\nCordialement,`}
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-y"
                  style={{ border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" }}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Votre signature sera ajoutee automatiquement.
                </p>
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  <Send className="h-3.5 w-3.5" />
                  {pending ? "Envoi..." : "Envoyer"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "note" && (
            <form onSubmit={handleAddNote} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider mb-1.5" style={{ color: "var(--text-muted)" }}>Note interne</label>
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  required
                  rows={6}
                  placeholder="Ajouter une note interne sur ce lead (visible par l'equipe seulement)..."
                  className="w-full rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary resize-y"
                  style={{ border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" }}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {pending ? "Ajout..." : "Ajouter la note"}
                </button>
              </div>
            </form>
          )}

          {activeTab === "timeline" && (
            <div className="space-y-4">
              {events.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: "var(--text-muted)" }}>
                  Aucune action enregistree. Repondez ou ajoutez une note pour commencer la timeline.
                </p>
              ) : (
                <ol className="space-y-4 relative border-l pl-6" style={{ borderColor: "var(--border)" }}>
                  {events.map(({ event, actor }) => (
                    <li key={event.id} className="relative">
                      <span className="absolute -left-[25px] top-1 h-2 w-2 rounded-full" style={{ background: "var(--color-copper)" }} />
                      <div className="flex items-baseline gap-2">
                        <span className="text-xs font-mono uppercase tracking-wider" style={{ color: "var(--color-copper)" }}>
                          {event.type.replace("_", " ")}
                        </span>
                        <span className="text-[10px] font-mono" style={{ color: "var(--text-muted)" }}>
                          {new Date(event.at).toLocaleString("fr-FR")}
                        </span>
                      </div>
                      {actor && (
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>par {actor.name}</p>
                      )}
                      <EventContent event={event} />
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Side column — status + actions */}
      <aside className="space-y-4">
        <div className="rounded-xl p-5" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <h3 className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Statut</h3>
          <div className="space-y-2">
            {LEAD_STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                disabled={pending}
                className="w-full text-left rounded-lg px-3 py-2 text-sm transition-colors disabled:opacity-50"
                style={{
                  background: lead.status === s ? "var(--bg-muted)" : "transparent",
                  color: lead.status === s ? "var(--text)" : "var(--text-muted)",
                  fontWeight: lead.status === s ? 600 : 400,
                  border: lead.status === s ? "1px solid var(--border-strong)" : "1px solid transparent",
                }}
              >
                {lead.status === s && "● "}{STATUS_LABELS[s]}
              </button>
            ))}
          </div>
          {lead.status === "lost" && (
            <div className="mt-3">
              <label className="block text-xs font-mono uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>Raison</label>
              <input
                type="text"
                value={lead.lossReason || lossReason}
                onChange={(e) => setLossReason(e.target.value)}
                onBlur={() => handleStatusChange("lost")}
                placeholder="prix / concurrent / timing"
                className="w-full rounded-lg px-2 py-1.5 text-xs"
                style={{ border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" }}
              />
            </div>
          )}
        </div>

        <div className="rounded-xl p-5" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <h3 className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Meta</h3>
          <dl className="space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Globe className="h-3 w-3" style={{ color: "var(--text-muted)" }} />
              <dt style={{ color: "var(--text-muted)" }}>Source :</dt>
              <dd style={{ color: "var(--text)" }}>{lead.source || "—"}</dd>
            </div>
            {lead.ip && (
              <div className="flex items-center gap-2">
                <Building2 className="h-3 w-3" style={{ color: "var(--text-muted)" }} />
                <dt style={{ color: "var(--text-muted)" }}>IP :</dt>
                <dd className="font-mono" style={{ color: "var(--text)" }}>{lead.ip}</dd>
              </div>
            )}
            <div className="flex items-center gap-2">
              <UserPlus className="h-3 w-3" style={{ color: "var(--text-muted)" }} />
              <dt style={{ color: "var(--text-muted)" }}>Assigne :</dt>
              <dd style={{ color: "var(--text)" }}>{lead.assignedTo || "Non assigne"}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-xl p-5" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
          <h3 className="font-mono text-xs uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>Actions</h3>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center gap-2 text-sm text-primary hover:opacity-80 transition-opacity"
            >
              <Trash2 className="h-3.5 w-3.5" /> Supprimer ce lead
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs" style={{ color: "var(--text)" }}>Confirmer la suppression ?</p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={pending}
                  className="rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
                >
                  Supprimer definitivement
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="rounded-lg px-3 py-1.5 text-xs"
                  style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}
                >
                  Annuler
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}

function EventContent({ event }: { event: LeadEvent }) {
  const payload = event.payloadJson ? JSON.parse(event.payloadJson) : null;
  if (!payload) return null;

  if (event.type === "note") {
    return (
      <p className="mt-2 text-sm whitespace-pre-wrap rounded-lg p-3" style={{ background: "var(--bg-muted)", color: "var(--text)" }}>
        {payload.content as string}
      </p>
    );
  }
  if (event.type === "status_change") {
    return (
      <p className="mt-1 text-sm" style={{ color: "var(--text)" }}>
        <span style={{ color: "var(--text-muted)" }}>{payload.from}</span> → <strong>{payload.to}</strong>
      </p>
    );
  }
  if (event.type === "email_sent") {
    return (
      <div className="mt-2 rounded-lg p-3" style={{ background: "var(--bg-muted)" }}>
        <p className="text-xs font-semibold mb-1" style={{ color: "var(--text)" }}>{payload.subject as string}</p>
        <p className="text-sm whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{payload.body as string}</p>
      </div>
    );
  }
  if (event.type === "assignment") {
    return <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>Assigne a {payload.to || "Personne"}</p>;
  }
  return null;
}
