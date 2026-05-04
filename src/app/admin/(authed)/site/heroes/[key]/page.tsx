import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { PAGE_HERO_KEYS } from "../constants";
import { PageHeroForm } from "./PageHeroForm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ key: string }>;
}

export default async function AdminPageHeroEditPage({ params }: PageProps) {
  const { key } = await params;
  const entry = PAGE_HERO_KEYS.find((p) => p.key === key);
  if (!entry) notFound();

  const rows = await db
    .select()
    .from(schema.pageHeroes)
    .where(eq(schema.pageHeroes.key, key))
    .limit(1);

  const row = rows[0];

  // Pre-resolve media URL for initial preview (server side)
  let mediaUrl: string | null = null;
  let mediaMime: string | null = null;
  if (row?.mediaId) {
    const m = await db
      .select()
      .from(schema.media)
      .where(eq(schema.media.id, row.mediaId))
      .limit(1);
    if (m.length > 0) {
      mediaUrl = m[0].url;
      mediaMime = m[0].mime;
    }
  }

  return (
    <>
      <Topbar
        title={`Hero — ${entry.label}`}
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Site" },
          { label: "Heros pages", href: "/admin/site/heroes" },
          { label: entry.label },
        ]}
      />
      <div className="p-8">
        <PageHeroForm
          pageKey={key}
          pageLabel={entry.label}
          pagePath={entry.description}
          existing={!!row}
          initial={
            row
              ? {
                  enabled: row.enabled,
                  eyebrow: row.eyebrow || "",
                  title: row.title || "",
                  intro: row.intro || "",
                  mediaId: row.mediaId || "",
                  objectPosition: row.objectPosition || "center 50%",
                  opacity: String(row.opacity ?? 100),
                  overlayLeft: String(row.overlayLeft ?? 70),
                }
              : undefined
          }
          initialMedia={{ mediaUrl, mediaMime }}
        />
      </div>
    </>
  );
}
