import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { Building2, Plus } from "lucide-react";
import { ClientsGrid } from "./ClientsGrid";
import { EmptyState } from "@/components/admin/EmptyState";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const rows = await db.select().from(schema.clients).orderBy(asc(schema.clients.orderIdx));

  return (
    <>
      <Topbar title="Clients" breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Clients" }]} />

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {rows.length} client{rows.length > 1 ? "s" : ""}
          </p>
          <Link
            href="/admin/clients/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Ajouter un client
          </Link>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="Aucun client"
            description="Ajoutez vos references clients a afficher sur la vitrine."
            actionLabel="Ajouter un client"
            actionHref="/admin/clients/new"
          />
        ) : (
          <ClientsGrid rows={rows} />
        )}
      </div>
    </>
  );
}
