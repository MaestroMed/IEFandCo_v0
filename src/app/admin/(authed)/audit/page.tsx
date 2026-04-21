import { Topbar } from "@/components/admin/Topbar";
import { History } from "lucide-react";
import { EmptyState } from "@/components/admin/EmptyState";
import { getAuditEntries, getAuditFilterChoices } from "./queries";
import { AuditTimeline } from "./AuditTimeline";
import { PAGE_SIZE } from "./constants";

export const dynamic = "force-dynamic";

interface SearchParams {
  user?: string;
  entity?: string;
  action?: string;
  from?: string;
  to?: string;
  page?: string;
}

export default async function AuditPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page) || 1);

  const [{ entries, total, totalPages }, choices] = await Promise.all([
    getAuditEntries({
      userId: params.user || undefined,
      entity: params.entity || undefined,
      action: params.action || undefined,
      from: params.from ? new Date(params.from) : undefined,
      to: params.to ? new Date(params.to) : undefined,
      page,
      pageSize: PAGE_SIZE,
    }),
    getAuditFilterChoices(),
  ]);

  return (
    <>
      <Topbar
        title="Audit"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Audit" },
        ]}
      />

      <div className="p-8 space-y-6">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          {total} entree{total > 1 ? "s" : ""} au total. Le journal d&apos;audit n&apos;est pas encore alimente par toutes les actions ; les entrees apparaissent au fur et a mesure que les helpers <code className="font-mono">logAudit</code> sont integres.
        </p>

        <FilterForm
          choices={choices}
          current={{
            user: params.user || "",
            entity: params.entity || "",
            action: params.action || "",
            from: params.from || "",
            to: params.to || "",
          }}
        />

        {entries.length === 0 ? (
          <EmptyState
            icon={History}
            title="Aucune entree"
            description={Object.keys(params).length > 0 ? "Aucune entree ne correspond aux filtres choisis." : "Le journal d'audit est vide pour l'instant."}
          />
        ) : (
          <>
            <AuditTimeline
              entries={entries.map((row) => ({
                id: row.entry.id,
                userId: row.entry.userId,
                actorName: row.actor?.name || null,
                actorEmail: row.actor?.email || null,
                entity: row.entry.entity,
                entityId: row.entry.entityId,
                action: row.entry.action,
                diffJson: row.entry.diffJson,
                at: row.entry.at.getTime(),
              }))}
            />
            <Pagination page={page} totalPages={totalPages} params={params} />
          </>
        )}
      </div>
    </>
  );
}

function FilterForm({
  choices,
  current,
}: {
  choices: { users: { id: string; name: string; email: string }[]; entities: string[]; actions: string[] };
  current: { user: string; entity: string; action: string; from: string; to: string };
}) {
  const inputCls = "rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary";
  const inputStyle = { border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" };

  return (
    <form method="get" action="/admin/audit" className="flex flex-wrap gap-3">
      <select name="user" defaultValue={current.user} className={inputCls} style={inputStyle}>
        <option value="">Tous utilisateurs</option>
        {choices.users.map((u) => (
          <option key={u.id} value={u.id}>{u.name}</option>
        ))}
      </select>
      <select name="entity" defaultValue={current.entity} className={inputCls} style={inputStyle}>
        <option value="">Toutes entites</option>
        {choices.entities.map((e) => (
          <option key={e} value={e}>{e}</option>
        ))}
      </select>
      <select name="action" defaultValue={current.action} className={inputCls} style={inputStyle}>
        <option value="">Toutes actions</option>
        {choices.actions.map((a) => (
          <option key={a} value={a}>{a}</option>
        ))}
      </select>
      <input type="date" name="from" defaultValue={current.from} className={`${inputCls} font-mono`} style={inputStyle} />
      <input type="date" name="to" defaultValue={current.to} className={`${inputCls} font-mono`} style={inputStyle} />
      <button type="submit" className="rounded-lg px-4 py-2 text-sm" style={{ border: "1px solid var(--border)", color: "var(--text)" }}>
        Filtrer
      </button>
    </form>
  );
}

function Pagination({ page, totalPages, params }: { page: number; totalPages: number; params: SearchParams }) {
  if (totalPages <= 1) return null;

  function buildUrl(p: number) {
    const sp = new URLSearchParams();
    if (params.user) sp.set("user", params.user);
    if (params.entity) sp.set("entity", params.entity);
    if (params.action) sp.set("action", params.action);
    if (params.from) sp.set("from", params.from);
    if (params.to) sp.set("to", params.to);
    if (p > 1) sp.set("page", String(p));
    const q = sp.toString();
    return `/admin/audit${q ? `?${q}` : ""}`;
  }

  return (
    <div className="flex items-center justify-between text-sm" style={{ color: "var(--text-muted)" }}>
      <span className="font-mono text-xs">Page {page} / {totalPages}</span>
      <div className="flex gap-2">
        {page > 1 && (
          <a
            href={buildUrl(page - 1)}
            className="rounded-lg px-4 py-2 text-sm"
            style={{ border: "1px solid var(--border)", color: "var(--text)" }}
          >
            ← Precedent
          </a>
        )}
        {page < totalPages && (
          <a
            href={buildUrl(page + 1)}
            className="rounded-lg px-4 py-2 text-sm"
            style={{ border: "1px solid var(--border)", color: "var(--text)" }}
          >
            Suivant →
          </a>
        )}
      </div>
    </div>
  );
}
