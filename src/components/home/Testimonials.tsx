/**
 * Testimonials — wrapper server async.
 *
 * Lit l'override `home-testimonials` dans `page_heroes` pour permettre à
 * l'admin de configurer une image de fond (warm) éditable depuis le BO.
 * Le rendu réel (carrousel + animations) est dans `TestimonialsClient`.
 */

import { getPageHero } from "@/lib/content";
import type { Testimonial } from "@/data/testimonials";
import { TestimonialsClient } from "./TestimonialsClient";

export async function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const heroOverride = await getPageHero("home-testimonials");
  const bgImageUrl = heroOverride?.mediaUrl;
  const bgOpacity = (heroOverride?.opacity ?? 100) / 100;
  const bgObjectPosition = heroOverride?.objectPosition ?? "center 50%";
  const overlayCenterStrength = heroOverride?.overlayLeft ?? 35;

  return (
    <TestimonialsClient
      testimonials={testimonials}
      bgImageUrl={bgImageUrl}
      bgImageAlt={heroOverride?.mediaAlt ?? ""}
      bgOpacity={bgOpacity}
      bgObjectPosition={bgObjectPosition}
      overlayCenterStrength={overlayCenterStrength}
    />
  );
}
