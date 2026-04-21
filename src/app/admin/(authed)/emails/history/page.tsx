import { Topbar } from "@/components/admin/Topbar";
import Link from "next/link";
import { History, Mail, Search } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";
import { getEmailLog, getTemplates } from "../queries";
import { EMAIL_LOG_STATUSES, EMAIL_LOG_STATUS_LABELS } from "../constants";
import { HistoryClient } from "./HistoryClient";

export const dynamic = "force-dynamic";

interface SearchParams {
  status?: string;
  template?: string;
  q?: string;
  from?: string;
  to?: string;
}

export default async function EmailHistoryPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const templates = await getTemplates();

  const logs = await getEmailLog({
    status: (EMAIL_LOG_STATUSES as readonly string[]).includes(params.status || "") ? (params.status as "sent" | "failed" | "queued") : undefined,
    template: params.template || undefined,
    from: params.from ? new Date(params.from) : undefined,
    to: params.to ? new Date(params.to) : undefined,
    q: params.q || undefined,
  });

  const inputCls = "rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary";
  const inputStyle = { border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" };

  return (
    <>
      <Topbar
        title="Historique emails"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Emails", href: "/admin/emails" },
          { label: "Historique" },
        ]}
      />
      <div className="p-8 space-y-6">
        <div className="flex gap-1 border-b" style={{ borderColor: "var(--border)" }}>
          <Link href="/admin/emails/templates" className="flex items-center gap-2 px-4 py-2.5 text-sm border-b-2" style={{ borderColor: "transparent", color: "var(--text-muted)" }}>
            <Mail className="h-3.5 w-3.5" /> Templates
          </Link>
          <Link href="/admin/emails/history" className="flex items-center gap-2 px-4 py-2.5 text-sm border-b-2" style={{ borderColor: "var(--color-primary)", color: "var(--text)", fontWeight: 600 }}>
            <History className="h-3.5 w-3.5" /> Historique
          </Link>
        </div>

        <form method="get" action="/admin/emails/history" className="flex flex-wrap gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              name="q"
              placeholder="Rechercher par destinataire ou sujet..."
              defaultValue={params.q || ""}
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-primary"
              style={{ border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" }}
            />
          </div>
          <select name="status" defaultValue={params.status || ""} className={inputCls} style={inputStyle}>
            <option value="">Tous status</option>
            {EMAIL_LOG_STATUSES.map((s) => (
              <option key={s} value={s}>{EMAIL_LOG_STATUS_LABELS[s]}</option>
            ))}
          </select>
          <select name="template" defaultValue={params.template || ""} className={inputCls} style={inputStyle}>
            <option value="">Tous templates</option>
            {templates.map((t) => (
              <option key={t.key} value={t.key}>{t.name}</option>
            ))}
          </select>
          <input type="date" name="from" defaultValue={params.from || ""} className={`${inputCls} font-mono`} style={inputStyle} />
          <input type="date" name="to" defaultValue={params.to || ""} className={`${inputCls} font-mono`} style={inputStyle} />
          <button type="submit" className="rounded-lg px-4 py-2 text-sm" style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
            Filtrer
          </button>
        </form>

        {logs.length === 0 ? (
          <EmptyState
            icon={History}
            title="Aucun email"
            description="Aucun email envoye ne correspond aux filtres."
          />
        ) : (
          <HistoryClient
            logs={logs.map((row) => ({
              id: row.log.id,
              toAddress: row.log.toAddress,
              fromAddress: row.log.fromAddress,
              subject: row.log.subject,
              bodyHtml: row.log.bodyHtml,
              templateKey: row.log.templateKey,
              status: row.log.status,
              errorMessage: row.log.errorMessage,
              leadId: row.log.leadId,
              sentAt: new Date(row.log.sentAt).toISOString(),
              sentByName: row.sentByUser?.name || null,
            }))}
          />
        )}
      </div>
    </>
  );
}
