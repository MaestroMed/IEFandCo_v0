import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ServiceTabs } from "./ServiceTabs";

export default async function EditServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [rows, subs, faqs] = await Promise.all([
    db.select().from(schema.services).where(eq(schema.services.id, id)).limit(1),
    db
      .select()
      .from(schema.subServices)
      .where(eq(schema.subServices.serviceId, id))
      .orderBy(asc(schema.subServices.orderIdx)),
    db
      .select()
      .from(schema.serviceFaqs)
      .where(eq(schema.serviceFaqs.serviceId, id))
      .orderBy(asc(schema.serviceFaqs.orderIdx)),
  ]);

  if (rows.length === 0) notFound();
  const service = rows[0];

  return (
    <>
      <Topbar
        title={service.title}
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Services", href: "/admin/services" },
          { label: service.title },
        ]}
      />
      <div className="p-8">
        <ServiceTabs service={service} subServices={subs} faqs={faqs} />
      </div>
    </>
  );
}
