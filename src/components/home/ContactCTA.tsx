/**
 * ContactCTA — wrapper server async.
 *
 * Lit l'override `home-cta` dans `page_heroes` pour permettre à l'admin
 * de configurer une image de fond éditable depuis le BO. Le rendu réel
 * (avec hooks/animations/embers) est dans `ContactCTAClient`.
 */

import { getPageHero } from "@/lib/content";
import { ContactCTAClient } from "./ContactCTAClient";

export async function ContactCTA() {
  const heroOverride = await getPageHero("home-cta");
  const bgImageUrl = heroOverride?.mediaUrl;
  const bgOpacity = (heroOverride?.opacity ?? 100) / 100;
  const bgObjectPosition = heroOverride?.objectPosition ?? "center 50%";
  const overlayCenterStrength = heroOverride?.overlayLeft ?? 60;

  return (
    <ContactCTAClient
      bgImageUrl={bgImageUrl}
      bgImageAlt={heroOverride?.mediaAlt ?? ""}
      bgOpacity={bgOpacity}
      bgObjectPosition={bgObjectPosition}
      overlayCenterStrength={overlayCenterStrength}
    />
  );
}
