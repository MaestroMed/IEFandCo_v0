# IEF & CO — Site vitrine + backoffice B2B

> Métallerie-serrurerie B2B en Île-de-France. Site "Forged Light" + CMS complet + SEO monopole local.

**Stack** : Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Drizzle ORM · SQLite (dev) → Postgres (prod) · Motion v12 · TipTap · Resend · Anthropic Claude.

---

## Quick start

```bash
# Install
npm install

# Env vars
cp .env.example .env.local
# → remplir RESEND_API_KEY, SESSION_SECRET au minimum

# Init DB + seed
npx drizzle-kit push
npx tsx src/db/seed.ts

# Dev
npm run dev
# → http://localhost:3000
```

**Admin** : http://localhost:3000/admin/login — login par défaut après seed : `admin@iefandco.com` / `admin1234` (à changer en prod).

---

## Architecture

```
src/
├── app/                    # Next 15 App Router (173 routes)
│   ├── (public pages)      # Homepage, services, zones, maintenance, comparatifs, glossaire, blog...
│   ├── admin/              # Backoffice (auth group + authed group)
│   └── api/                # Server routes (contact, devis, AI, auth...)
├── components/
│   ├── home/               # Hero, Services, Stats, Testimonials, FAQ, CTA
│   ├── layout/             # Navbar, Footer, ScrollProgress, PageProgress, StickyMobileCTA
│   ├── ui/                 # Button, Photo, Reveal, ThemeToggle, ClientLogoBadge, SectionHeading…
│   ├── admin/              # Sidebar, Topbar, CommandPalette, MediaPicker, AIReplyButton...
│   └── forms/              # ContactForm, DevisMultiStep
├── data/                   # Source of truth for static content (services, zones, brands, glossary, comparatifs, blog, realisations, depannage)
├── db/                     # Drizzle schema + client + seed
├── lib/                    # content adapter (DB → fallback static), auth, seo, photoMap, fonts
└── hooks/                  # useScrollProgress, useInView, useMediaQuery
```

### Routes (173 au total)

| Type | URLs | Routes |
|------|------|--------|
| Statiques | 14 | `/`, `/services`, `/realisations`, `/blog`, `/contact`, `/devis`, `/a-propos`, `/assisteo`, `/zones-intervention`, `/comparatifs`, `/glossaire`, `/depannage`, `/maintenance/contrats`, + légales |
| Services | 7 | `/services/[slug]` |
| Blog | 8 | `/blog/[slug]` |
| Réalisations | 6 | `/realisations/[slug]` |
| Zones IDF | 8 | `/zones/[slug]` |
| Maintenance marques | 4 | `/maintenance/[brand]` |
| Comparatifs | 5 | `/comparatif/[slug]` |
| Glossaire | 44 | `/glossaire/[term]` |
| **Dépannage combos** | **40** | `/depannage/[service]/[zone]` (5 services × 8 zones) |
| Admin | 37 | `/admin/*` (CMS + CRM + GMAO) |

---

## Documents stratégiques

- **[ULTRAPLAN.md](./ULTRAPLAN.md)** — Vision "monopole maintenance B2B" + roadmap 18 mois (Phases A→E)
- **[BACKOFFICE-PLAN.md](./BACKOFFICE-PLAN.md)** — Plan du backoffice (déjà livré)

---

## Déploiement

### Vercel (recommandé)

```bash
# Deploy
vercel

# ou via GitHub integration → Vercel auto-deploy sur push main
```

**Variables d'env à configurer dans Vercel** (voir `.env.example`) :
- `RESEND_API_KEY` · `CONTACT_TO_EMAIL` · `CONTACT_FROM_EMAIL`
- `ANTHROPIC_API_KEY` (optionnel, pour AI drafted replies)
- `SESSION_SECRET` (généré avec `openssl rand -hex 32`)
- `DATABASE_URL` (Vercel Postgres recommandé)
- `NEXT_PUBLIC_SITE_URL` · `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` (optionnel)

### Email (Resend)

1. Compte sur [resend.com](https://resend.com)
2. Ajouter le domaine `iefandco.com`
3. Configurer DKIM + SPF + DMARC dans ton DNS (Resend fournit les records exacts)
4. Une fois le domaine vérifié, paste la clé API dans `RESEND_API_KEY`

### Database

- **Dev** : SQLite automatique à `.data/iefandco.db` (zero config)
- **Prod** : Postgres via Vercel Postgres, Supabase ou Neon. Le schema Drizzle est Postgres-compatible — il suffit de changer `src/db/index.ts` pour utiliser `drizzle-orm/postgres-js` + connecter via `DATABASE_URL`.

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server avec Turbopack (http://localhost:3000) |
| `npm run build` | Build prod (stable, ~30s) |
| `npm run start` | Serve le build prod |
| `npm run lint` | ESLint |
| `npx drizzle-kit push` | Pousse le schema à la DB |
| `npx tsx src/db/seed.ts` | Seed data (admin user + services + FAQ + blog + clients + team + projects) |

---

## Performance

- **173 routes SSG** compilées en ~30s
- **Homepage** : 18 kB gzipped (dont Hero carousel lazy-loaded)
- **First Load JS shared** : 115 kB
- **Schema.org** sur toutes les pages (LocalBusiness, Service, FAQPage, BreadcrumbList, Article, DefinedTerm)

---

## Contenu principal piloté par DB

Via `src/lib/content.ts`, toutes les pages publiques lisent depuis la DB avec fallback sur les fichiers `src/data/*.ts` si la DB est vide. Modifier depuis le backoffice propage immédiatement côté public.

Tables pilotées : services, blog_posts, realisations, clients, testimonials, team_members, homepage_faq, leads, media, users, redirects, maintenance (sites/equipment/visits/contracts), emails (templates/log).

---

## SEO stratégie

Voir **[ULTRAPLAN.md](./ULTRAPLAN.md)** pour la stratégie complète. En résumé :

- **Phase A** (faite) : Foundations + ecosystem (zones, marques, comparatifs, glossaire, contrats)
- **Phase B** (faite) : 40 combos `depannage × zone` pour le SEO local
- **Phase C** (en cours) : 20 pillar articles + 100 cluster articles long-tail
- **Phase D** : Conversion (quote builder, portail client, live chat)
- **Phase E** : Backlinks + autorité

---

## License

Propriétaire · IEF & CO · 2026
