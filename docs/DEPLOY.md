# Déploiement IEF & CO — Vercel + Supabase + IONOS DNS

Guide pas-à-pas pour passer le site en production sur `iefandco.com`.

---

## 0. Pré-requis

- [ ] Compte **Vercel** lié au repo GitHub `MaestroMed/IEFandCo_v0`
- [ ] Compte **Supabase** (free tier suffit pour démarrer)
- [ ] Compte **Resend** (free 3000 emails/mois)
- [ ] Accès **IONOS** au DNS du domaine `iefandco.com`
- [ ] Accès **WordPress IONOS** de l'ancien site (pour exporter les URLs et planifier les 301)

---

## 1. Supabase — création de la base + Storage

1. Crée un projet Supabase (région `eu-west-3 / Paris` pour la latence FR).
2. Dans **Project Settings → Database → Connection Pooling** copie l'URL **Pooler** (port 6543, `?pgbouncer=true`).  
   Format : `postgres://postgres.xxxx:PASSWORD@aws-0-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true`
3. Note aussi l'URL **Direct connection** (port 5432) → utile pour `drizzle-kit push` qui ne supporte pas PgBouncer.
4. Dans **Project Settings → API** copie :
   - `Project URL` → `SUPABASE_URL`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ NE PAS confondre avec anon key — le service role bypass RLS, requis pour upload depuis server actions)
5. Dans **Storage** :
   - Crée un bucket `media`
   - Active **Public** (les médias sont publiquement servis depuis `https://<projet>.supabase.co/storage/v1/object/public/media/...`)
   - Policies : laisse les défauts (public read OK, le service role gère l'écrit)

### Pousser le schéma + seed

Depuis ton poste local :

```bash
# Direct URL pour les migrations (pas pooler) — accepte port 5432
export DATABASE_URL="postgres://postgres.xxxx:PASSWORD@aws-0-eu-west-3.pooler.supabase.com:5432/postgres"

npx drizzle-kit push        # crée toutes les tables (incluant homepage_hero, page_seo, glossary_terms, zones, comparators, brands, depannage_services)
npx tsx src/db/seed.ts      # seed admin + services + FAQ + blog + clients + team + projects + glossaire + zones + brands + comparatifs + dépannage
npx tsx src/db/seed-emails.ts  # seed 4 templates email
```

Login admin par défaut : `admin@iefandco.com` / `admin1234` — **change le mot de passe immédiatement** depuis `/admin/users`.

**Le seed idempotent** : il vérifie chaque table avant insert. Tu peux le relancer sans risque de doublons.

---

## 2. Resend — emails transactionnels

1. Crée un compte sur [resend.com](https://resend.com).
2. **Domains → Add Domain** : ajoute `iefandco.com`.
3. Resend te donne 3 enregistrements DNS (DKIM × 2 + SPF + DMARC). Ajoute-les chez IONOS :

| Type | Nom | Valeur |
|------|-----|--------|
| TXT | `resend._domainkey.iefandco.com` | (valeur Resend) |
| TXT | `iefandco.com` | `v=spf1 include:_spf.resend.com ~all` |
| TXT | `_dmarc.iefandco.com` | `v=DMARC1; p=quarantine; rua=mailto:contact@iefandco.com` |

4. Attends la propagation (5-30 min) puis valide chez Resend.
5. Crée une clé API (`API Keys → Create`) → note-la pour `RESEND_API_KEY`.

---

## 3. Vercel — déploiement

1. **Import Project** depuis GitHub : `MaestroMed/IEFandCo_v0`. Vercel détecte Next.js.
2. **Build & Output settings** : laisse les défauts (le `vercel.json` du repo prend le relais — `cdg1` region, headers sécurité, `ignoreCommand` pour bloquer les preview builds des branches feature).
3. **Environment Variables** (à régler avant le premier deploy) :

| Variable | Valeur | Scope |
|---|---|---|
| `DATABASE_URL` | URL Pooler Supabase (port 6543) | Production + Preview |
| `SUPABASE_URL` | URL projet Supabase | Production + Preview |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role secret (PAS anon) | Production + Preview |
| `SUPABASE_STORAGE_BUCKET` | `media` (default) | Production |
| `RESEND_API_KEY` | ta clé Resend | Production |
| `CONTACT_TO_EMAIL` | `contact@iefandco.com` | Production |
| `CONTACT_FROM_EMAIL` | `noreply@iefandco.com` | Production |
| `SESSION_SECRET` | `openssl rand -hex 32` (au moins 32 chars) | Production |
| `ANTHROPIC_API_KEY` | (optionnel, pour Brouillon IA) | Production |
| `NEXT_PUBLIC_SITE_URL` | `https://iefandco.com` | Production |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | token public Mapbox restreint à `iefandco.com` | Production |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | (optionnel) | Production |

4. **Deploy** depuis main → un build Vercel se lance.

---

## 4. Domaine — DNS IONOS → Vercel

1. Sur Vercel : **Project Settings → Domains** → ajoute `iefandco.com` et `www.iefandco.com`.
2. Vercel te donne 2 enregistrements DNS à régler chez IONOS :
   - `iefandco.com` → A `76.76.21.21` (apex)
   - `www.iefandco.com` → CNAME `cname.vercel-dns.com`
3. **AVANT** de basculer le DNS : préviens du downtime potentiel et fais une sauvegarde du site WP IONOS (export complet + base SQL) au cas où.
4. Bascule les DNS chez IONOS (le TTL court d'abord, ex 300s, pour itérer rapidement si besoin).
5. Attends propagation (`dig iefandco.com` doit pointer vers Vercel). En général < 1h.
6. Vercel auto-provisionne un certificat SSL Let's Encrypt.

---

## 5. Redirections 301 depuis l'ancien WP

**Critique** pour ne pas perdre de trafic SEO.

### a) Lister les URLs de l'ancien site

Depuis WordPress IONOS, exporte le sitemap :
- `https://iefandco.com/sitemap.xml` (avant bascule DNS — tu peux aussi consulter Google Search Console)
- Ou via plugin Yoast / RankMath → Tools → Export sitemap

### b) Mapper les anciennes URLs vers les nouvelles

Crée un fichier `redirects.csv` à la racine du repo (NE PAS COMMIT — `.gitignore` le couvre via le wildcard `*.csv`) :

```csv
# from,to[,statusCode]
/services/portails-cloture,/services/portails-clotures
/wp-content/uploads/2023/old-image.jpg,/images/photos/realisation-portail-noir.jpg
/blog/2024/article-perimee,/blog/maintenance-obligatoire-portes-industrielles
```

Conventions :
- Première colonne = chemin **exact** sur l'ancien site (commence par `/`)
- Deuxième colonne = chemin sur le nouveau (relatif) ou URL absolue
- Troisième colonne = code HTTP (défaut 301). Utilise 302 pour redirections temporaires.

### c) Importer en base

```bash
export DATABASE_URL="<URL Pooler Supabase>"
npx tsx scripts/import-wp-redirects.ts ./redirects.csv
```

Le middleware (`src/middleware.ts`) lit cette table à chaque requête — les 301 s'appliquent immédiatement, pas besoin de redeploy.

### d) Vérification

```bash
curl -I https://iefandco.com/services/portails-cloture
# HTTP/2 301
# location: /services/portails-clotures
```

Tu peux aussi gérer les redirections depuis le backoffice : `/admin/seo/redirects`.

---

## 6. Mapbox — restriction du token

Le token public Mapbox est exposé côté navigateur. Restreins-le par domaine :
1. [Mapbox account → Tokens](https://account.mapbox.com/access-tokens/)
2. Sur le token utilisé dans `NEXT_PUBLIC_MAPBOX_TOKEN`, **URL restrictions** :
   - `https://iefandco.com/*`
   - `https://www.iefandco.com/*`
   - `https://*.vercel.app/*` (pour les preview deploys de main si tu en autorises plus tard)

---

## 7. Backoffice — premier setup contenu

Une fois Vercel + Supabase + DNS opérationnels, login admin et configure le contenu :

### Hero homepage configurable
- `/admin/site/hero` — active le hero éditable
- Upload une vidéo MP4 (recommandé < 8 MB) ou une photo HD
- Configure : eyebrow, titre (multi-ligne supporté), sous-titre, 2 CTAs, opacité de l'overlay
- L'image/vidéo passe automatiquement en plein écran avec overlay sombre — preview fidèle au rendu prod

### Photos par service
- `/admin/services` — chaque service peut avoir son cover (image ou vidéo) qui remplace l'illustration blueprint dans le hero de `/services/[slug]`

### Galerie projets
- `/admin/projects/[id]` — section "Galerie projet" : ajoute autant de photos que tu veux, dans l'ordre. Elles apparaissent dans une grille 3 colonnes après la timeline du projet.

### Cover blog
- `/admin/blog/[id]` — `coverMediaId` : photo ou vidéo qui remplace la photo générique par catégorie

### SEO pages statiques
- `/admin/site/page-seo` — override le titre, description, OG image pour les pages `home`, `services-index`, `realisations-index`, `blog-index`, `glossaire-index`, `zones-intervention`, `a-propos`, `contact`, etc.

### Contenu SEO migrable depuis BO
- `/admin/content/glossary` — 44 termes glossaire
- `/admin/content/zones` — 8 départements IDF
- `/admin/content/brands` — 4 marques maintenance (Hörmann, Crawford, Maviflex, Came)
- `/admin/content/comparators` — 5 comparatifs (porte sectionnelle vs rideau, etc.)
- `/admin/content/depannage` — 8 services dépannage (génère 40 combos × 8 zones)

Le site retombera sur `src/data/*.ts` si une table est vide — donc tu peux migrer progressivement.

---

## 8. Smoke test post-deploy

Checklist à valider après mise en ligne :

- [ ] `https://iefandco.com` charge en HTTPS
- [ ] `https://www.iefandco.com` redirige vers `iefandco.com` (Vercel le fait auto)
- [ ] `/services/fermetures-industrielles` (et les 6 autres) renvoient 200
- [ ] `/devis` → soumets un devis test → email reçu sur `contact@iefandco.com`
- [ ] `/contact` → idem
- [ ] `/admin/login` → connecté, dashboard OK
- [ ] `/sitemap.xml` liste les 173 URLs
- [ ] `/robots.txt` interdit `/admin/` et `/api/`
- [ ] `/og-default.jpg` n'existe PAS (volontaire) → l'OG par défaut vient de `/opengraph-image` (1200×630 généré dynamiquement)
- [ ] Test 301 : `curl -I https://iefandco.com<une_ancienne_url>` → 301 vers la nouvelle URL
- [ ] Lighthouse mobile sur `/` → Performance ≥ 90, SEO ≥ 95, A11y ≥ 95

---

## 9. Backup régulier

Supabase fait des backups automatiques toutes les 24h sur le free tier (rétention 7 jours). Pour un backup manuel :

```bash
pg_dump "$DATABASE_URL" > backup-$(date +%F).sql
```

À ranger dans un drive privé hors de GitHub.

---

## 10. Troubleshooting

**"DATABASE_URL not configured"** dans les logs Vercel → la var n'est pas set sur l'env Production. Re-vérifie dans Vercel Settings.

**Le formulaire devis renvoie 403 "Origine non autorisée"** → le `Origin` header ne matche pas. Vérifie `NEXT_PUBLIC_SITE_URL` pointe bien sur le domaine final (avec/sans `www`).

**Build Vercel timeout sur SSG** → augmente `maxDuration` dans `next.config.ts` (défaut 60s) ou réduis le nombre de routes prerenderées.

**Mails non reçus** → vérifie DKIM/SPF/DMARC validés chez Resend. Vérifie que `CONTACT_FROM_EMAIL` utilise bien le domaine vérifié (pas `gmail.com`).

**Preview deploy malgré `vercel.json`** → la première fois il faut que `main` soit déjà déployée pour que `deploymentEnabled.main: true` lise la config. Force un deploy depuis main, puis les branches `claude/*` ne lanceront plus de preview.

---

**Date** : 2026-04-29  
**Maintainer** : Mehdi
