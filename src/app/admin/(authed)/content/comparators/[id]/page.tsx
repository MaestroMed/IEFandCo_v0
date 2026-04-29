import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { asc, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ComparatorForm } from "../ComparatorForm";

export default async function EditComparatorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [rows, criteriaRows, useCases, faqs] = await Promise.all([
    db.select().from(schema.comparators).where(eq(schema.comparators.id, id)).limit(1),
    db.select().from(schema.comparatorRows).where(eq(schema.comparatorRows.comparatorId, id)).orderBy(asc(schema.comparatorRows.orderIdx)),
    db.select().from(schema.comparatorUseCases).where(eq(schema.comparatorUseCases.comparatorId, id)).orderBy(asc(schema.comparatorUseCases.orderIdx)),
    db.select().from(schema.comparatorFaqs).where(eq(schema.comparatorFaqs.comparatorId, id)).orderBy(asc(schema.comparatorFaqs.orderIdx)),
  ]);
  if (rows.length === 0) notFound();
  const c = rows[0];

  return (
    <>
      <Topbar
        title={c.title}
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Comparatifs", href: "/admin/content/comparators" },
          { label: c.title },
        ]}
      />
      <div className="p-8">
        <ComparatorForm
          comparatorId={c.id}
          initial={{
            slug: c.slug,
            title: c.title,
            optionAName: c.optionAName,
            optionBName: c.optionBName,
            tagline: c.tagline,
            intro: c.intro,
            verdict: c.verdict,
            category: c.category,
            accent: c.accent,
            seoTitle: c.seoTitle || "",
            seoDescription: c.seoDescription || "",
            visible: c.visible,
            orderIdx: String(c.orderIdx),
          }}
          rows={criteriaRows.map((r) => ({
            id: r.id,
            criterion: r.criterion,
            optionA: r.optionA,
            optionB: r.optionB,
            winner: r.winner,
            orderIdx: r.orderIdx,
          }))}
          useCases={useCases.map((u) => ({
            id: u.id,
            scenario: u.scenario,
            recommendation: u.recommendation,
            reason: u.reason,
            orderIdx: u.orderIdx,
          }))}
          faqs={faqs.map((f) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
            orderIdx: f.orderIdx,
          }))}
        />
      </div>
    </>
  );
}
