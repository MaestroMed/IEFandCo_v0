import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ZoneForm } from "../ZoneForm";

export default async function EditZonePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db.select().from(schema.zones).where(eq(schema.zones.id, id)).limit(1);
  if (rows.length === 0) notFound();
  const z = rows[0];

  return (
    <>
      <Topbar
        title={z.name}
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Zones", href: "/admin/content/zones" },
          { label: z.name },
        ]}
      />
      <div className="p-8">
        <ZoneForm
          zoneId={z.id}
          initial={{
            slug: z.slug,
            name: z.name,
            code: z.code,
            region: z.region,
            tagline: z.tagline,
            intro: z.intro,
            cities: z.cities || "",
            slaUrgence: z.slaUrgence,
            slaStandard: z.slaStandard,
            hubs: z.hubs || "",
            kpisJson: z.kpisJson || "",
            testimonialJson: z.testimonialJson || "",
            faqJson: z.faqJson || "",
            centerLat: z.centerLat || "",
            centerLng: z.centerLng || "",
            seoTitle: z.seoTitle || "",
            seoDescription: z.seoDescription || "",
            coverMediaId: z.coverMediaId || "",
            visible: z.visible,
            orderIdx: String(z.orderIdx),
          }}
        />
      </div>
    </>
  );
}
