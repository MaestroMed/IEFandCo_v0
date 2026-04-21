import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { asc } from "drizzle-orm";
import Link from "next/link";
import { MessageSquare, Plus } from "lucide-react";
import { TestimonialCards } from "./TestimonialCards";
import { EmptyState } from "@/components/admin/EmptyState";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const rows = await db.select().from(schema.testimonials).orderBy(asc(schema.testimonials.orderIdx));

  return (
    <>
      <Topbar title="Temoignages" breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Temoignages" }]} />

      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            {rows.length} temoignage{rows.length > 1 ? "s" : ""}
          </p>
          <Link
            href="/admin/testimonials/new"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Ajouter un temoignage
          </Link>
        </div>

        {rows.length === 0 ? (
          <EmptyState
            icon={MessageSquare}
            title="Aucun temoignage"
            description="Ajoutez des citations de clients satisfaits."
            actionLabel="Ajouter un temoignage"
            actionHref="/admin/testimonials/new"
          />
        ) : (
          <TestimonialCards rows={rows} />
        )}
      </div>
    </>
  );
}
