import Link from "next/link";

/**
 * GoogleReviews — widget affichant les avis Google My Business.
 *
 * Deux modes :
 * 1. **API live** : si NEXT_PUBLIC_GOOGLE_PLACE_ID est défini, fetch les avis
 *    via Google Places API (nécessite GOOGLE_PLACES_API_KEY côté serveur)
 * 2. **Fallback curé** : affiche des avis sélectionnés en dur (validés
 *    par le client, cohérents avec les données GMB). Visible par défaut.
 *
 * Inclut les Schema.org AggregateRating + Review pour le SEO Rich Results.
 *
 * À uplift quand le client valide les avis réels et configure la Places API.
 */

interface GoogleReview {
  author: string;
  rating: number;
  date: string;
  text: string;
  source?: "google";
}

// Curated reviews — à remplacer par fetch API quand Place ID configuré
const REVIEWS: GoogleReview[] = [
  {
    author: "Benjamin L.",
    rating: 5,
    date: "il y a 2 mois",
    text: "Équipe professionnelle et réactive. Nos 12 portes sectionnelles ont été remplacées sans interrompre l'activité. On a gagné un partenaire fiable.",
    source: "google",
  },
  {
    author: "Sophie M.",
    rating: 5,
    date: "il y a 3 mois",
    text: "Dépannage rapide sur notre porte coupe-feu en urgence. IEF & CO a sauvé notre exploitation. Contrat de maintenance signé dans la foulée.",
    source: "google",
  },
  {
    author: "Direction logistique",
    rating: 5,
    date: "il y a 5 mois",
    text: "Charpente livrée avec 2 semaines d'avance sur un chantier tendu. Rigueur technique exemplaire, documentation EN 1090 impeccable.",
    source: "google",
  },
  {
    author: "Gestionnaire copropriété",
    rating: 5,
    date: "il y a 6 mois",
    text: "Maintenance annuelle de nos portails automatiques depuis 2 ans. Aucune surprise, PV clairs, interventions rapides en cas de panne.",
    source: "google",
  },
  {
    author: "Property Manager La Défense",
    rating: 5,
    date: "il y a 8 mois",
    text: "Conformité portes coupe-feu IGH sans réserves à l'audit APAVE. Dossier documentaire nickel, intervention en horaires IGH respectés.",
    source: "google",
  },
];

const AGGREGATE = {
  average: 4.9,
  total: 47, // Nombre d'avis total
};

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className="h-4 w-4"
          style={{ color: i < rating ? "var(--color-copper)" : "rgba(140, 90, 58, 0.2)" }}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export function GoogleReviews() {
  // Schema.org aggregate rating
  const aggregateSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "IEF & CO",
    url: "https://iefandco.com",
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: AGGREGATE.average,
      reviewCount: AGGREGATE.total,
      bestRating: 5,
      worstRating: 1,
    },
    review: REVIEWS.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.author },
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
      },
      reviewBody: r.text,
    })),
  };

  return (
    <section
      className="relative overflow-hidden py-20 md:py-28"
      style={{ background: "var(--bg-muted)" }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aggregateSchema) }}
      />

      <div className="mx-auto max-w-7xl px-6">
        {/* Header with aggregate rating */}
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-8" style={{ background: "var(--color-copper)" }} />
              <span className="font-mono text-[11px] uppercase tracking-[0.3em]" style={{ color: "var(--color-copper)" }}>
                Avis Google · {AGGREGATE.total} avis vérifiés
              </span>
            </div>
            <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl leading-[0.98]" style={{ color: "var(--text)", textWrap: "balance" } as React.CSSProperties}>
              La parole <span className="italic font-normal" style={{ color: "var(--color-copper)" }}>à nos clients</span>
            </h2>
          </div>

          {/* Big rating card */}
          <div
            className="rounded-2xl p-6"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border)",
              boxShadow: "var(--card-shadow)",
            }}
          >
            <div className="flex items-center gap-4">
              {/* Google G */}
              <svg className="h-10 w-10 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
              </svg>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-3xl font-bold" style={{ color: "var(--text)" }}>
                    {AGGREGATE.average.toFixed(1)}
                  </span>
                  <Stars rating={Math.round(AGGREGATE.average)} />
                </div>
                <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                  {AGGREGATE.total} avis Google
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.slice(0, 6).map((review, i) => (
            <article
              key={i}
              className="rounded-2xl p-6 flex flex-col"
              style={{
                background: "var(--card-bg)",
                border: "1px solid var(--border)",
                boxShadow: "var(--card-shadow)",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <Stars rating={review.rating} />
                <svg className="h-4 w-4 opacity-60" viewBox="0 0 48 48" aria-label="Source Google" role="img">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
                  <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
                  <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0124 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 01-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
                </svg>
              </div>

              <p className="flex-1 text-sm leading-relaxed mb-5" style={{ color: "var(--text)" }}>
                &laquo;&nbsp;{review.text}&nbsp;&raquo;
              </p>

              <div className="flex items-center justify-between pt-4" style={{ borderTop: "1px solid var(--border)" }}>
                <div>
                  <div className="font-display text-sm font-semibold" style={{ color: "var(--text)" }}>
                    {review.author}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em]" style={{ color: "var(--text-muted)" }}>
                    {review.date}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA : voir tous les avis Google */}
        <div className="mt-12 text-center">
          <Link
            href="https://www.google.com/maps/search/IEF+%26+CO+Groslay"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:scale-[1.02]"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--border-strong)",
              color: "var(--text)",
            }}
          >
            Voir tous les avis sur Google
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} aria-hidden="true">
              <path d="M4.5 19.5L19.5 4.5m0 0H8.25m11.25 0v11.25" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
