"use client";

/**
 * ZonesMap — carte interactive des 8 départements d'intervention IEF & CO.
 *
 * Comportement :
 *  - Si `NEXT_PUBLIC_MAPBOX_TOKEN` est défini → Mapbox GL via react-map-gl
 *    (style `dark-v11`, markers cuivre, popup au hover, clic → /zones/[slug]).
 *  - Sinon → fallback SVG stylisé de l'Île-de-France avec les 8 départements
 *    positionnés comme pastilles cliquables (expérience propre sans token).
 *
 * Le composant est client-only ; importé via `dynamic({ ssr: false })`.
 */

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Map, { Marker, Popup } from "react-map-gl/mapbox";
import type { MapRef } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { zones, type Zone } from "@/data/zones";

const SIEGE_SLUG = "val-d-oise";

// Projection simple lat/lng → % dans la viewbox SVG pour le fallback.
// Cadrage choisi pour englober l'Île-de-France (~48.0–49.3°N / 1.4–3.6°E).
const FALLBACK_BOUNDS = {
  minLng: 1.4,
  maxLng: 3.55,
  minLat: 48.05,
  maxLat: 49.25,
};

function projectFallback(lat: number, lng: number): { x: number; y: number } {
  const { minLng, maxLng, minLat, maxLat } = FALLBACK_BOUNDS;
  const x = ((lng - minLng) / (maxLng - minLng)) * 100;
  // y inversé — le nord est en haut
  const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
  return { x, y };
}

interface ZonesMapProps {
  /** Hauteur du conteneur (par défaut : 500px) */
  height?: number;
  /** Style override */
  className?: string;
}

export default function ZonesMap({ height = 500, className }: ZonesMapProps) {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const hasToken = Boolean(token && token.length > 0);

  if (!hasToken) {
    return <ZonesMapFallback height={height} className={className} />;
  }

  return <ZonesMapMapbox height={height} className={className} token={token!} />;
}

// ─────────────────────────────────────────────────────────────
//  MAPBOX VARIANT (token présent)
// ─────────────────────────────────────────────────────────────

function ZonesMapMapbox({
  height,
  className,
  token,
}: {
  height: number;
  className?: string;
  token: string;
}) {
  const router = useRouter();
  const [hoveredZone, setHoveredZone] = useState<Zone | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const initialViewState = useMemo(
    () => ({
      longitude: 2.3522,
      latitude: 48.8566,
      zoom: 8.5,
    }),
    [],
  );

  return (
    <div className={className}>
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          height,
          border: "1px solid var(--border-strong)",
          boxShadow: "var(--card-shadow)",
          background: "#0C0C10",
        }}
      >
        {!mapLoaded && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center"
            style={{ background: "#0C0C10" }}
          >
            <div className="flex flex-col items-center gap-3">
              <div
                className="h-8 w-8 animate-spin rounded-full"
                style={{
                  border: "2px solid rgba(196, 133, 92, 0.2)",
                  borderTopColor: "var(--color-copper)",
                }}
              />
              <span
                className="font-mono text-[11px] uppercase tracking-[0.2em]"
                style={{ color: "var(--color-copper)" }}
              >
                Chargement de la carte
              </span>
            </div>
          </div>
        )}

        <Map
          mapboxAccessToken={token}
          initialViewState={initialViewState}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          style={{ width: "100%", height: "100%" }}
          attributionControl={false}
          onLoad={() => setMapLoaded(true)}
          ref={(r: MapRef | null) => {
            // Forcer un resize après montage pour les conteneurs dynamiques
            if (r) requestAnimationFrame(() => r.resize());
          }}
        >
          {zones.map((zone) => {
            const isSiege = zone.slug === SIEGE_SLUG;
            return (
              <Marker
                key={zone.slug}
                longitude={zone.center.lng}
                latitude={zone.center.lat}
                anchor="center"
                onClick={(e) => {
                  e.originalEvent.stopPropagation();
                  router.push(`/zones/${zone.slug}`);
                }}
              >
                <button
                  type="button"
                  aria-label={`Voir la zone ${zone.name}`}
                  onMouseEnter={() => setHoveredZone(zone)}
                  onMouseLeave={() => setHoveredZone(null)}
                  onFocus={() => setHoveredZone(zone)}
                  onBlur={() => setHoveredZone(null)}
                  className="group relative flex h-10 w-10 items-center justify-center rounded-full font-mono text-xs font-bold transition-transform duration-200 hover:scale-125 focus:scale-125 focus:outline-none"
                  style={{
                    background: isSiege
                      ? "var(--color-primary)"
                      : "linear-gradient(135deg, #D4A574 0%, #C4855C 100%)",
                    color: "#fff",
                    border: isSiege
                      ? "2px solid rgba(255,255,255,0.9)"
                      : "2px solid rgba(255,255,255,0.85)",
                    boxShadow: isSiege
                      ? "0 0 0 4px rgba(225, 16, 33, 0.25), 0 4px 14px rgba(225, 16, 33, 0.45)"
                      : "0 0 0 3px rgba(196, 133, 92, 0.22), 0 4px 12px rgba(0,0,0,0.4)",
                    cursor: "pointer",
                  }}
                >
                  {zone.code}
                  {isSiege && (
                    <span
                      className="pointer-events-none absolute -top-1 -right-1 h-3 w-3 rounded-full"
                      style={{
                        background: "#fff",
                        boxShadow: "0 0 0 2px var(--color-primary)",
                      }}
                    />
                  )}
                </button>
              </Marker>
            );
          })}

          {hoveredZone && (
            <Popup
              longitude={hoveredZone.center.lng}
              latitude={hoveredZone.center.lat}
              closeButton={false}
              closeOnClick={false}
              anchor="bottom"
              offset={22}
              className="zones-map-popup"
            >
              <div
                style={{
                  minWidth: 220,
                  background: "#14141A",
                  color: "#F5F5F2",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(196, 133, 92, 0.3)",
                  fontFamily: "var(--font-body)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--color-copper)",
                    marginBottom: 4,
                  }}
                >
                  {hoveredZone.code} · {hoveredZone.region}
                  {hoveredZone.slug === SIEGE_SLUG && (
                    <span
                      style={{
                        marginLeft: 8,
                        padding: "1px 6px",
                        borderRadius: 4,
                        background: "var(--color-primary)",
                        color: "#fff",
                        fontSize: 9,
                      }}
                    >
                      Siège
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 4,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {hoveredZone.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    lineHeight: 1.4,
                    color: "#B8B8B3",
                    marginBottom: 8,
                  }}
                >
                  {hoveredZone.tagline}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: 8,
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "#7A7A75",
                      }}
                    >
                      Urgence
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--color-copper)",
                      }}
                    >
                      {hoveredZone.slaUrgence}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "#7A7A75",
                    }}
                  >
                    Cliquer →
                  </div>
                </div>
              </div>
            </Popup>
          )}
        </Map>

        {/* Attribution Mapbox discrète, coin bas droite */}
        <div
          className="pointer-events-none absolute bottom-1.5 right-2 font-mono text-[9px] opacity-60"
          style={{ color: "#B8B8B3" }}
        >
          © Mapbox © OpenStreetMap
        </div>
      </div>

      <ZonesMapLegend />

      {/* Styles pour le popup Mapbox (override du chrome par défaut) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .zones-map-popup .mapboxgl-popup-content {
              background: transparent !important;
              padding: 0 !important;
              box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4) !important;
              border-radius: 10px !important;
            }
            .zones-map-popup .mapboxgl-popup-tip {
              border-top-color: #14141a !important;
              border-bottom-color: #14141a !important;
            }
            .zones-map-popup .mapboxgl-popup-close-button {
              display: none;
            }
          `,
        }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  FALLBACK SVG (pas de token)
// ─────────────────────────────────────────────────────────────

function ZonesMapFallback({
  height,
  className,
}: {
  height: number;
  className?: string;
}) {
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const hoveredZone = hoveredSlug
    ? zones.find((z) => z.slug === hoveredSlug) ?? null
    : null;

  return (
    <div className={className}>
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          height,
          border: "1px solid var(--border-strong)",
          boxShadow: "var(--card-shadow)",
          background:
            "radial-gradient(ellipse 80% 60% at 50% 40%, #14141A 0%, #0A0A0C 70%, #050508 100%)",
        }}
      >
        {/* Grille blueprint en fond */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(196, 133, 92, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(196, 133, 92, 0.06) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Label région — coin haut gauche */}
        <div
          className="absolute top-4 left-4 z-20 flex items-center gap-2.5"
          style={{ color: "var(--color-copper)" }}
        >
          <span
            className="h-px w-6"
            style={{ background: "var(--color-copper)" }}
          />
          <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
            Île-de-France · 8 départements
          </span>
        </div>

        {/* Avis fallback discret — coin haut droite */}
        <div
          className="absolute top-4 right-4 z-20 rounded-md px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.2em]"
          style={{
            background: "rgba(196, 133, 92, 0.12)",
            color: "var(--color-copper)",
            border: "1px solid rgba(196, 133, 92, 0.22)",
          }}
        >
          Vue schématique
        </div>

        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          aria-label="Carte de l'Île-de-France avec les 8 départements d'intervention IEF & CO"
        >
          <defs>
            <radialGradient id="zonesMapBg" cx="50%" cy="45%" r="55%">
              <stop offset="0%" stopColor="rgba(196, 133, 92, 0.10)" />
              <stop offset="100%" stopColor="rgba(196, 133, 92, 0)" />
            </radialGradient>

            <radialGradient id="zonesMapParis" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(225, 16, 33, 0.18)" />
              <stop offset="100%" stopColor="rgba(225, 16, 33, 0)" />
            </radialGradient>

            <filter id="zonesMapGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="0.6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Halo doux autour de la région */}
          <rect x="0" y="0" width="100" height="100" fill="url(#zonesMapBg)" />

          {/* Contour stylisé de l'IDF — une forme organique
              qui englobe grossièrement les 8 départements.
              (Ce n'est pas un GeoJSON précis mais donne le "coup d'œil".) */}
          <path
            d="M 18 28
               Q 14 22, 22 18
               Q 32 12, 44 14
               Q 55 10, 68 14
               Q 82 18, 86 30
               Q 92 42, 86 56
               Q 90 70, 80 80
               Q 70 90, 56 88
               Q 44 92, 30 86
               Q 18 82, 14 70
               Q 8 58, 14 46
               Q 10 36, 18 28 Z"
            fill="rgba(196, 133, 92, 0.04)"
            stroke="rgba(196, 133, 92, 0.35)"
            strokeWidth="0.3"
            strokeDasharray="1.2 0.8"
            filter="url(#zonesMapGlow)"
          />

          {/* Halo rouge centré sur Paris */}
          {(() => {
            const paris = zones.find((z) => z.slug === "paris")!;
            const { x, y } = projectFallback(paris.center.lat, paris.center.lng);
            return (
              <circle
                cx={x}
                cy={y}
                r={16}
                fill="url(#zonesMapParis)"
              />
            );
          })()}

          {/* Lignes de connexion Siège → chaque département
              (donne un effet "maillage" depuis Groslay) */}
          {(() => {
            const siege = zones.find((z) => z.slug === SIEGE_SLUG)!;
            const siegeP = projectFallback(siege.center.lat, siege.center.lng);
            return zones
              .filter((z) => z.slug !== SIEGE_SLUG)
              .map((z) => {
                const p = projectFallback(z.center.lat, z.center.lng);
                return (
                  <line
                    key={`line-${z.slug}`}
                    x1={siegeP.x}
                    y1={siegeP.y}
                    x2={p.x}
                    y2={p.y}
                    stroke="rgba(196, 133, 92, 0.18)"
                    strokeWidth="0.2"
                    strokeDasharray="0.6 0.6"
                  />
                );
              });
          })()}

          {/* Noms des communes hors-zone (Beauvais, Chartres, Reims...) — très discrets */}
          <text
            x="8"
            y="12"
            fontSize="1.8"
            fill="rgba(184, 184, 179, 0.22)"
            fontFamily="var(--font-mono)"
            letterSpacing="0.15em"
          >
            BEAUVAIS
          </text>
          <text
            x="88"
            y="12"
            fontSize="1.8"
            fill="rgba(184, 184, 179, 0.22)"
            fontFamily="var(--font-mono)"
            letterSpacing="0.15em"
            textAnchor="end"
          >
            REIMS
          </text>
          <text
            x="8"
            y="96"
            fontSize="1.8"
            fill="rgba(184, 184, 179, 0.22)"
            fontFamily="var(--font-mono)"
            letterSpacing="0.15em"
          >
            CHARTRES
          </text>
          <text
            x="92"
            y="96"
            fontSize="1.8"
            fill="rgba(184, 184, 179, 0.22)"
            fontFamily="var(--font-mono)"
            letterSpacing="0.15em"
            textAnchor="end"
          >
            AUXERRE
          </text>
        </svg>

        {/* Pastilles cliquables — absolu, positionnées % */}
        {zones.map((zone) => {
          const { x, y } = projectFallback(
            zone.center.lat,
            zone.center.lng,
          );
          const isSiege = zone.slug === SIEGE_SLUG;
          const isHovered = hoveredSlug === zone.slug;

          return (
            <Link
              key={zone.slug}
              href={`/zones/${zone.slug}`}
              aria-label={`Voir la zone ${zone.name}`}
              className="absolute z-10 flex items-center justify-center rounded-full font-mono text-xs font-bold transition-all duration-300 focus:outline-none"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%) scale(${isHovered ? 1.18 : 1})`,
                width: isSiege ? 46 : 40,
                height: isSiege ? 46 : 40,
                background: isSiege
                  ? "var(--color-primary)"
                  : "linear-gradient(135deg, #D4A574 0%, #C4855C 100%)",
                color: "#fff",
                border: isSiege
                  ? "2px solid rgba(255,255,255,0.9)"
                  : "2px solid rgba(255,255,255,0.85)",
                boxShadow: isSiege
                  ? "0 0 0 5px rgba(225, 16, 33, 0.22), 0 8px 20px rgba(225, 16, 33, 0.45)"
                  : "0 0 0 4px rgba(196, 133, 92, 0.18), 0 6px 16px rgba(0,0,0,0.45)",
              }}
              onMouseEnter={() => setHoveredSlug(zone.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              onFocus={() => setHoveredSlug(zone.slug)}
              onBlur={() => setHoveredSlug(null)}
            >
              {zone.code}
              {isSiege && (
                <span
                  className="pointer-events-none absolute -top-1 -right-1 h-3 w-3 rounded-full"
                  style={{
                    background: "#fff",
                    boxShadow: "0 0 0 2px var(--color-primary)",
                  }}
                />
              )}
            </Link>
          );
        })}

        {/* Popup au hover pour le fallback */}
        {hoveredZone && (() => {
          const { x, y } = projectFallback(
            hoveredZone.center.lat,
            hoveredZone.center.lng,
          );
          return (
            <div
              className="pointer-events-none absolute z-20"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                transform: "translate(-50%, calc(-100% - 34px))",
                minWidth: 220,
              }}
            >
              <div
                style={{
                  background: "#14141A",
                  color: "#F5F5F2",
                  padding: "12px 14px",
                  borderRadius: 10,
                  border: "1px solid rgba(196, 133, 92, 0.3)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--color-copper)",
                    marginBottom: 4,
                  }}
                >
                  {hoveredZone.code} · {hoveredZone.region}
                  {hoveredZone.slug === SIEGE_SLUG && (
                    <span
                      style={{
                        marginLeft: 8,
                        padding: "1px 6px",
                        borderRadius: 4,
                        background: "var(--color-primary)",
                        color: "#fff",
                        fontSize: 9,
                      }}
                    >
                      Siège
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    fontWeight: 700,
                    marginBottom: 4,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {hoveredZone.name}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    lineHeight: 1.4,
                    color: "#B8B8B3",
                    marginBottom: 8,
                  }}
                >
                  {hoveredZone.tagline}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingTop: 8,
                    borderTop: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: 9,
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "#7A7A75",
                      }}
                    >
                      Urgence
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--color-copper)",
                      }}
                    >
                      {hoveredZone.slaUrgence}
                    </div>
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10,
                      color: "#7A7A75",
                    }}
                  >
                    Cliquer →
                  </div>
                </div>
              </div>
              {/* Flèche du popup vers le marker */}
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: -7,
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "7px solid transparent",
                  borderRight: "7px solid transparent",
                  borderTop: "7px solid rgba(196, 133, 92, 0.3)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  bottom: -6,
                  transform: "translateX(-50%)",
                  width: 0,
                  height: 0,
                  borderLeft: "6px solid transparent",
                  borderRight: "6px solid transparent",
                  borderTop: "6px solid #14141A",
                }}
              />
            </div>
          );
        })()}

        {/* Attribution discrète — coin bas droite */}
        <div
          className="pointer-events-none absolute bottom-2 right-3 font-mono text-[9px] opacity-50"
          style={{ color: "#B8B8B3" }}
        >
          Vue schématique · IEF & CO
        </div>
      </div>

      <ZonesMapLegend />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  LEGENDE — partagée entre les deux variantes
// ─────────────────────────────────────────────────────────────

function ZonesMapLegend() {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-3 w-3 rounded-full"
          style={{
            background: "var(--color-primary)",
            boxShadow: "0 0 0 2px rgba(225, 16, 33, 0.18)",
          }}
        />
        <span style={{ color: "var(--text-secondary)" }}>
          Siège (Val-d&apos;Oise)
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-3 w-3 rounded-full"
          style={{
            background:
              "linear-gradient(135deg, #D4A574 0%, #C4855C 100%)",
            boxShadow: "0 0 0 2px rgba(196, 133, 92, 0.18)",
          }}
        />
        <span style={{ color: "var(--text-secondary)" }}>
          Zone d&apos;intervention
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span
          className="inline-block h-3 w-3 rounded-full border"
          style={{
            background: "transparent",
            borderColor: "var(--border-strong)",
          }}
        />
        <span style={{ color: "var(--text-muted)" }}>Partenaire</span>
      </div>
    </div>
  );
}
