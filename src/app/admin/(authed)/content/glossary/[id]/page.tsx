import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { GlossaryForm } from "../GlossaryForm";

export default async function EditGlossaryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db.select().from(schema.glossaryTerms).where(eq(schema.glossaryTerms.id, id)).limit(1);
  if (rows.length === 0) notFound();
  const t = rows[0];

  return (
    <>
      <Topbar
        title={t.term}
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Glossaire", href: "/admin/content/glossary" },
          { label: t.term },
        ]}
      />
      <div className="p-8">
        <GlossaryForm
          termId={t.id}
          initial={{
            slug: t.slug,
            term: t.term,
            category: t.category,
            shortDef: t.shortDef,
            fullDef: t.fullDef,
            relatedSlugs: t.relatedSlugs || "",
            relatedServices: t.relatedServices || "",
            visible: t.visible,
            orderIdx: String(t.orderIdx),
          }}
        />
      </div>
    </>
  );
}
