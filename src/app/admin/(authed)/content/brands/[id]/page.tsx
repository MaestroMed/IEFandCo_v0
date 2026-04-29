import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { BrandForm } from "../BrandForm";

export default async function EditBrandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db.select().from(schema.maintenanceBrands).where(eq(schema.maintenanceBrands.id, id)).limit(1);
  if (rows.length === 0) notFound();
  const b = rows[0];

  return (
    <>
      <Topbar
        title={b.name}
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Marques", href: "/admin/content/brands" },
          { label: b.name },
        ]}
      />
      <div className="p-8">
        <BrandForm
          brandId={b.id}
          initial={{
            slug: b.slug,
            name: b.name,
            tagline: b.tagline,
            intro: b.intro,
            productsJson: b.productsJson || "",
            failuresJson: b.failuresJson || "",
            strengthsJson: b.strengthsJson || "",
            faqJson: b.faqJson || "",
            searchVolume: b.searchVolume || "",
            accentColor: b.accentColor || "",
            seoTitle: b.seoTitle || "",
            seoDescription: b.seoDescription || "",
            logoMediaId: b.logoMediaId || "",
            coverMediaId: b.coverMediaId || "",
            visible: b.visible,
            orderIdx: String(b.orderIdx),
          }}
        />
      </div>
    </>
  );
}
