import { Topbar } from "@/components/admin/Topbar";
import { db, schema } from "@/db";
import { eq } from "drizzle-orm";
import { HeroForm } from "./HeroForm";

export const dynamic = "force-dynamic";

const HERO_ID = "default";

export default async function AdminHomepageHeroPage() {
  const rows = await db
    .select({
      id: schema.homepageHero.id,
      enabled: schema.homepageHero.enabled,
      eyebrow: schema.homepageHero.eyebrow,
      title: schema.homepageHero.title,
      subtitle: schema.homepageHero.subtitle,
      ctaPrimaryLabel: schema.homepageHero.ctaPrimaryLabel,
      ctaPrimaryHref: schema.homepageHero.ctaPrimaryHref,
      ctaSecondaryLabel: schema.homepageHero.ctaSecondaryLabel,
      ctaSecondaryHref: schema.homepageHero.ctaSecondaryHref,
      mediaId: schema.homepageHero.mediaId,
      posterMediaId: schema.homepageHero.posterMediaId,
      overlayOpacity: schema.homepageHero.overlayOpacity,
    })
    .from(schema.homepageHero)
    .where(eq(schema.homepageHero.id, HERO_ID))
    .limit(1);

  const hero = rows[0];

  // Pre-resolve media URLs to render the preview server-side initially.
  let mediaUrl: string | null = null;
  let mediaMime: string | null = null;
  let posterUrl: string | null = null;
  if (hero?.mediaId) {
    const m = await db.select().from(schema.media).where(eq(schema.media.id, hero.mediaId)).limit(1);
    if (m.length > 0) {
      mediaUrl = m[0].url;
      mediaMime = m[0].mime;
    }
  }
  if (hero?.posterMediaId) {
    const m = await db.select().from(schema.media).where(eq(schema.media.id, hero.posterMediaId)).limit(1);
    if (m.length > 0) posterUrl = m[0].url;
  }

  return (
    <>
      <Topbar
        title="Hero homepage"
        breadcrumb={[
          { label: "Admin", href: "/admin" },
          { label: "Site" },
          { label: "Hero" },
        ]}
      />
      <div className="p-8">
        <HeroForm
          initial={
            hero
              ? {
                  enabled: hero.enabled ?? false,
                  eyebrow: hero.eyebrow || "",
                  title: hero.title || "",
                  subtitle: hero.subtitle || "",
                  ctaPrimaryLabel: hero.ctaPrimaryLabel || "",
                  ctaPrimaryHref: hero.ctaPrimaryHref || "",
                  ctaSecondaryLabel: hero.ctaSecondaryLabel || "",
                  ctaSecondaryHref: hero.ctaSecondaryHref || "",
                  mediaId: hero.mediaId || "",
                  posterMediaId: hero.posterMediaId || "",
                  overlayOpacity: String(hero.overlayOpacity ?? 50),
                }
              : undefined
          }
          initialMedia={{ mediaUrl, mediaMime, posterUrl }}
        />
      </div>
    </>
  );
}
