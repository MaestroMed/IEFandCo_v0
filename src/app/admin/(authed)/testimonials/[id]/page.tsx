import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { TestimonialForm } from "../TestimonialForm";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rows = await db.select().from(schema.testimonials).where(eq(schema.testimonials.id, id)).limit(1);
  if (rows.length === 0) notFound();
  const t = rows[0];

  return (
    <>
      <Topbar
        title={t.author}
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Temoignages", href: "/admin/testimonials" },
          { label: t.author },
        ]}
      />
      <div className="p-8">
        <TestimonialForm
          testimonialId={t.id}
          initial={{
            author: t.author,
            company: t.company || "",
            quote: t.quote,
            rating: t.rating,
            visible: t.visible,
            orderIdx: String(t.orderIdx),
            photoMediaId: t.photoMediaId || "",
          }}
        />
      </div>
    </>
  );
}
