import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { DepannageForm } from "../DepannageForm";

export default async function EditDepannagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db.select().from(schema.depannageServices).where(eq(schema.depannageServices.id, id)).limit(1);
  if (rows.length === 0) notFound();
  const s = rows[0];

  return (
    <>
      <Topbar
        title={s.label}
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Depannage", href: "/admin/content/depannage" },
          { label: s.label },
        ]}
      />
      <div className="p-8">
        <DepannageForm
          serviceId={s.id}
          initial={{
            slug: s.slug,
            label: s.label,
            tagline: s.tagline,
            intro: s.intro,
            businessImpact: s.businessImpact,
            accentColor: s.accentColor,
            brands: s.brands || "",
            failuresJson: s.failuresJson || "",
            partsInStock: s.partsInStock || "",
            relatedServices: s.relatedServices || "",
            seoTitle: s.seoTitle || "",
            seoDescription: s.seoDescription || "",
            visible: s.visible,
            orderIdx: String(s.orderIdx),
          }}
        />
      </div>
    </>
  );
}
