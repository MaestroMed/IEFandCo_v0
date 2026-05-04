/**
 * StatsForge — wrapper server async.
 *
 * Lit l'override `home-stats` dans `page_heroes` pour permettre à l'admin
 * d'éditer l'image de fond, l'opacity et l'intensité de l'overlay central
 * via /admin/site/heroes/home-stats. Le rendu réel (avec hooks et
 * animations) est dans `StatsForgeClient`.
 */

import { getPageHero } from "@/lib/content";
import { StatsForgeClient } from "./StatsForgeClient";

export async function StatsForge() {
  const heroOverride = await getPageHero("home-stats");
  const bgImageUrl = heroOverride?.mediaUrl;
  const bgOpacity = (heroOverride?.opacity ?? 100) / 100;
  const bgObjectPosition = heroOverride?.objectPosition ?? "center 50%";
  const overlayCenterStrength = heroOverride?.overlayLeft ?? 55;

  return (
    <StatsForgeClient
      bgImageUrl={bgImageUrl}
      bgImageAlt={heroOverride?.mediaAlt ?? ""}
      bgOpacity={bgOpacity}
      bgObjectPosition={bgObjectPosition}
      overlayCenterStrength={overlayCenterStrength}
    />
  );
}
