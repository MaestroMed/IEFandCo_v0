"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import { EMAIL_LOG_STATUS_LABELS } from "../constants";

interface LogRow {
  id: string;
  toAddress: string;
  fromAddress: string;
  subject: string;
  bodyHtml: string;
  templateKey: string | null;
  status: "sent" | "failed" | "queued";
  errorMessage: string | null;
  leadId: string | null;
  sentAt: string;
  sentByName: string | null;
}

export function HistoryClient({ logs }: { logs: LogRow[] }) {
  const [open, setOpen] = useState<LogRow | null>(null);

  return (
    <>
      <div className="rounded-xl overflow-hidden" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)", background: "var(--bg-muted)" }}>
              <th className="px-4 py-3 font-medium">Envoye</th>
              <th className="px-4 py-3 font-medium">A</th>
              <th className="px-4 py-3 font-medium">Sujet</th>
              <th className="px-4 py-3 font-medium">Template</th>
              <th className="px-4 py-3 font-medium">Par</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Lead</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                className="border-t cursor-pointer transition-colors hover:bg-[var(--bg-muted)]"
                style={{ borderColor: "var(--border)" }}
                onClick={() => setOpen(log)}
              >
                <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--text-muted)" }}>
                  {new Date(log.sentAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                </td>
                <td className="px-4 py-3" style={{ color: "var(--text)" }}>{log.toAddress}</td>
                <td className="px-4 py-3 truncate max-w-[300px]" style={{ color: "var(--text-muted)" }}>{log.subject}</td>
                <td className="px-4 py-3 font-mono text-xs" style={{ color: "var(--color-copper)" }}>
                  {log.templateKey || "—"}
                </td>
                <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>{log.sentByName || "—"}</td>
                <td className="px-4 py-3">
                  <StatusPill status={log.status} />
                </td>
                <td className="px-4 py-3 text-xs" onClick={(e) => e.stopPropagation()}>
                  {log.leadId ? (
                    <Link href={`/admin/leads/${log.leadId}`} className="hover:text-primary font-mono" style={{ color: "var(--color-copper)" }}>
                      {log.leadId.slice(0, 8)}
                    </Link>
                  ) : (
                    <span style={{ color: "var(--text-muted)" }}>—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {open && <LogPreview log={open} onClose={() => setOpen(null)} />}
    </>
  );
}

function StatusPill({ status }: { status: "sent" | "failed" | "queued" }) {
  const colors: Record<string, { bg: string; fg: string }> = {
    sent: { bg: "rgba(60,170,140,0.15)", fg: "#3CAA8C" },
    failed: { bg: "rgba(225,16,33,0.12)", fg: "var(--color-primary)" },
    queued: { bg: "rgba(196,133,92,0.12)", fg: "var(--color-copper)" },
  };
  const c = colors[status] || colors.sent;
  return (
    <span className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider" style={{ background: c.bg, color: c.fg }}>
      {EMAIL_LOG_STATUS_LABELS[status]}
    </span>
  );
}

function LogPreview({ log, onClose }: { log: LogRow; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose} style={{ background: "rgba(0,0,0,0.5)" }}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-xl relative" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
        <button onClick={onClose} className="absolute right-3 top-3 rounded-lg p-1.5 transition-colors hover:bg-[var(--bg-muted)] z-10" style={{ color: "var(--text-muted)" }}>
          <X className="h-4 w-4" />
        </button>
        <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
          <div className="flex items-center gap-2 mb-2">
            <StatusPill status={log.status} />
            {log.templateKey && (
              <span className="text-xs font-mono" style={{ color: "var(--color-copper)" }}>{log.templateKey}</span>
            )}
          </div>
          <h3 className="font-display text-lg font-bold" style={{ color: "var(--text)" }}>{log.subject}</h3>
          <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
            <div className="flex gap-2">
              <dt className="font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>De</dt>
              <dd style={{ color: "var(--text)" }}>{log.fromAddress}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>A</dt>
              <dd style={{ color: "var(--text)" }}>{log.toAddress}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Date</dt>
              <dd style={{ color: "var(--text)" }}>{new Date(log.sentAt).toLocaleString("fr-FR")}</dd>
            </div>
            {log.sentByName && (
              <div className="flex gap-2">
                <dt className="font-mono uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Par</dt>
                <dd style={{ color: "var(--text)" }}>{log.sentByName}</dd>
              </div>
            )}
          </dl>
          {log.errorMessage && (
            <p className="mt-3 text-xs rounded-lg p-2" style={{ background: "rgba(225,16,33,0.08)", color: "var(--color-primary)" }}>
              {log.errorMessage}
            </p>
          )}
        </div>
        <div className="overflow-y-auto p-6 prose prose-sm max-w-none" style={{ color: "var(--text)" }}>
          <div dangerouslySetInnerHTML={{ __html: log.bodyHtml }} />
        </div>
      </div>
    </div>
  );
}
