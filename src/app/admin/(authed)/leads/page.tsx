import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { desc, eq, and, or, like, sql, asc } from "drizzle-orm";
import Link from "next/link";
import { EmptyState } from "@/components/admin/EmptyState";
import { Inbox, Search } from "lucide-react";
import { LeadsTable } from "./LeadsTable";

interface SearchParams {
  status?: string;
  type?: string;
  q?: string;
}

export default async function LeadsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;

  const filters = [];
  if (params.status && params.status !== "all") {
    filters.push(eq(schema.leads.status, params.status as never));
  }
  if (params.type && params.type !== "all") {
    filters.push(eq(schema.leads.type, params.type as never));
  }
  if (params.q) {
    const q = `%${params.q.toLowerCase()}%`;
    filters.push(
      or(
        like(sql`lower(${schema.leads.firstName})`, q),
        like(sql`lower(${schema.leads.lastName})`, q),
        like(sql`lower(${schema.leads.email})`, q),
        like(sql`lower(${schema.leads.company})`, q),
        like(sql`lower(${schema.leads.message})`, q),
      )
    );
  }

  const whereClause = filters.length > 0 ? and(...filters) : undefined;

  const [leads, users, counts] = await Promise.all([
    db.select().from(schema.leads).where(whereClause).orderBy(desc(schema.leads.receivedAt)).limit(100),
    db.select({
      id: schema.users.id,
      name: schema.users.name,
      email: schema.users.email,
    }).from(schema.users).orderBy(asc(schema.users.name)),
    db.select({ status: schema.leads.status, c: sql<number>`count(*)` }).from(schema.leads).groupBy(schema.leads.status),
  ]);

  const countByStatus = Object.fromEntries(counts.map((r) => [r.status, r.c]));
  const total = counts.reduce((sum, r) => sum + r.c, 0);

  const statusTabs = [
    { key: "all", label: "Tous", count: total },
    { key: "new", label: "Nouveaux", count: countByStatus.new || 0 },
    { key: "contacted", label: "Contactes", count: countByStatus.contacted || 0 },
    { key: "in_progress", label: "En cours", count: countByStatus.in_progress || 0 },
    { key: "quoted", label: "Devis envoye", count: countByStatus.quoted || 0 },
    { key: "won", label: "Gagnes", count: countByStatus.won || 0 },
    { key: "lost", label: "Perdus", count: countByStatus.lost || 0 },
  ];

  return (
    <>
      <Topbar title="Leads" breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Leads" }]} />

      <div className="p-8 space-y-6">
        {/* Filter tabs */}
        <div className="flex items-center gap-1 overflow-x-auto border-b" style={{ borderColor: "var(--border)" }}>
          {statusTabs.map((tab) => {
            const isActive = (params.status || "all") === tab.key;
            return (
              <Link
                key={tab.key}
                href={tab.key === "all" ? "/admin/leads" : `/admin/leads?status=${tab.key}`}
                className="px-4 py-2.5 text-sm transition-colors whitespace-nowrap border-b-2 flex items-center gap-2"
                style={{
                  borderColor: isActive ? "var(--color-primary)" : "transparent",
                  color: isActive ? "var(--text)" : "var(--text-muted)",
                  fontWeight: isActive ? 600 : 400,
                }}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="rounded-full px-1.5 py-0.5 text-[10px] font-mono" style={{ background: "var(--bg-muted)", color: "var(--text-muted)" }}>
                    {tab.count}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        {/* Search */}
        <form method="get" action="/admin/leads" className="flex gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "var(--text-muted)" }} />
            <input
              type="text"
              name="q"
              placeholder="Rechercher par nom, email, entreprise, message..."
              defaultValue={params.q || ""}
              className="w-full pl-10 pr-4 py-2 rounded-lg text-sm focus:outline-none focus:border-primary"
              style={{ border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" }}
            />
          </div>
          {params.status && <input type="hidden" name="status" value={params.status} />}
          <select name="type" defaultValue={params.type || "all"} className="rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary" style={{ border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text)" }}>
            <option value="all">Tous les types</option>
            <option value="contact">Contact</option>
            <option value="devis">Devis</option>
          </select>
        </form>

        {/* List */}
        {leads.length === 0 ? (
          <div className="rounded-xl" style={{ background: "var(--card-bg)", border: "1px solid var(--border)" }}>
            <EmptyState
              icon={Inbox}
              title="Aucun lead"
              description={params.q || params.status ? "Aucun lead ne correspond a vos filtres." : "Les soumissions du site apparaitront ici des qu'elles arrivent."}
            />
          </div>
        ) : (
          <LeadsTable leads={leads} users={users} />
        )}
      </div>
    </>
  );
}
