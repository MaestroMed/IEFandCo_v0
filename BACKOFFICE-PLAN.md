# IEF & CO — Backoffice : Ultraplan state-of-the-art

> Un **cockpit metier** pour un metallier, pas un "CMS generique" de plus.
> Objectif : piloter A→Z le site vitrine, les leads, les projets, le contenu,
> et les operations commerciales depuis une seule interface, au niveau de ce
> que font Linear, Notion, Vercel Dashboard.

---

## 1. Vision

Pas un WordPress deguise. Pas un Wix ameliore. Un **outil que Otman Fariad et
son equipe utilisent chaque jour** — parce qu'il leur fait gagner du temps sur
leur vrai metier (gerer des projets, repondre aux leads, suivre la maintenance).

### Les 3 usages quotidiens a optimiser

1. **"Un prospect a rempli le formulaire de devis"** → notification + lecture + qualification + reponse en moins de 2 min
2. **"Je viens de finir un chantier, je veux l'ajouter au portfolio"** → 90 secondes du telephone au site publie
3. **"Le client demande un rappel pour sa maintenance semestrielle"** → calendrier automatise, email personnalise, PV genere

Si ces 3 workflows ne sont pas fluides, tout le reste est accessoire.

---

## 2. Stack technique

| Couche | Choix | Pourquoi |
|---|---|---|
| Frontend | **Next.js 15** (meme app) sous `/admin` | Un seul deploy, un seul codebase |
| Auth | **Clerk** (ou NextAuth + Passkeys) | Passkeys + 2FA + roles out-of-the-box |
| Database | **Neon Postgres** (serverless) | Free tier 0.5GB, branches pour preview, auto-scale |
| ORM | **Drizzle** + drizzle-kit | TypeScript-first, migrations en SQL lisible |
| File storage | **Vercel Blob** (ou Cloudflare R2) | Integration native Next, CDN inclus |
| Email | **Resend** (deja configure) | Templates React + analytics |
| Rich text | **TipTap** (Lexical en backup) | Extensible, markdown export, collaborative-ready |
| Search | **Postgres full-text** + tRPC endpoint | Zero dependency externe |
| Realtime | **SWR** + **Pusher** (ou Supabase Realtime) | Notifications push, live updates |
| Analytics | **Vercel Analytics** + **Plausible** embed | Privacy-first, RGPD-safe |
| Jobs / cron | **Vercel Cron** + **Inngest** pour workflows | Relances auto, digest emails |
| UI Components | **shadcn/ui** (stylise IEF & CO) + **cmdk** | Command palette, data tables, forms |

---

## 3. Architecture

```
/admin
├── / (dashboard overview)
├── /leads                  CRM mini — formulaires recus
├── /projects               Realisations : CRUD + gallery
├── /services               Edition des 7 services, sous-services, FAQ
├── /blog                   Articles : rich text editor, scheduling
├── /team                   Membres de l'equipe
├── /clients                Logos clients, autorisations
├── /testimonials           Avis clients
├── /media                  Media library (photos, PDFs, videos)
├── /seo                    Control center SEO (meta, schema, redirects)
├── /emails                 Templates + historique + relances
├── /calendar               Planning : chantiers, RDV, maintenance
├── /maintenance            Parc client + contrats + visites
├── /settings               Site settings + branding + team access
├── /audit                  Journal d'actions (qui a change quoi)
└── /ai                     Assistant IA + generations en queue
```

### Base de donnees — schema Drizzle

```typescript
// Core content
users            (id, email, name, role, passkey_creds, avatar, last_seen)
services         (slug, title, short_desc, full_desc, accent_color, icon, order)
sub_services     (service_id, title, description, order)
service_faqs     (service_id, question, answer, order)
blog_posts       (slug, title, excerpt, content_md, category, cover_image_id, author_id, published_at, tags[])
projects         (slug, title, category, client_name, location, year, description, status, featured)
project_images   (project_id, media_id, caption, order)
team_members     (name, role, expertise, photo_id, initials, order, visible)
testimonials     (author, company, quote, rating, photo_id, visible, order)
clients          (name, logo_id, website, permission_status, visible)

// Leads & CRM
leads            (type='contact'|'devis', status, data_json, received_at, assigned_to, notes, tags[])
lead_events     (lead_id, type, actor_id, payload_json, at)  -- timeline

// Maintenance & contracts
sites            (client_id, address, access_instructions, notes)
equipment        (site_id, type, brand, model, install_date, serial, photo_id)
maintenance_visits (equipment_id, scheduled_for, done_at, technician_id, report_md, pv_pdf_id)
contracts        (client_id, type, start, end, sla_hours, amount_ht)

// Media
media            (id, filename, blob_url, mime, width, height, alt, tags[], uploaded_by, at)

// Audit & settings
audit_log        (user_id, entity, entity_id, action, diff_json, at)
settings         (key, value_json)  -- site-wide config
redirects        (from_path, to_path, status_code)
```

---

## 4. Les pages en detail

### 4.1 `/admin` — Dashboard overview

**Ce que l'utilisateur voit en premier chaque matin :**

Grid 12 colonnes, hierarchise par importance :

- **Banner alertes** (haut, full width) : "3 nouveaux devis non-lus · 2 maintenances en retard"
- **KPIs row** (4 cards) :
  - Leads cette semaine (+trend vs semaine N-1)
  - Taux conversion devis → signes (30 derniers jours)
  - Traffic site (vs N-1, sparkline)
  - Revenus pipeline (Q en cours)
- **Leads en attente** (tableau, top 5 non-repondus) — clic → fiche lead
- **Calendar widget** — prochaine semaine (visites maintenance + RDV + jalons chantier)
- **Activite recente** (feed live : "Mathieu a publie un article", "Nouveau devis Portails de TotalEnergies")
- **Content health** : pages avec meta description manquante, images sans alt, liens brises
- **Pipeline visualization** : funnel Lead → Contact → Devis → Negociation → Signe → Livre

Keyboard-first : `Cmd+K` pour command palette (recherche globale + actions rapides : "add project", "reply to lead X", "publish post Y").

### 4.2 `/admin/leads` — CRM mini

**Au centre du systeme.** Interface inspiree de Superhuman + Linear.

**Vue liste** :
- Colonnes : status, nom, entreprise, service, source, date, assignee, priorite
- Filtres rapides : `Tous` / `A traiter` / `Contacte` / `En cours` / `Gagne` / `Perdu`
- Keyboard navigation : flaches haut/bas, Enter pour ouvrir, `E` pour assigner, `R` pour repondre
- Bulk actions : marquer comme traite, assigner, exporter CSV
- Search full-text instant

**Vue fiche lead** (panel droit) :
- Header : nom + entreprise + service + tel cliquable + email cliquable + statut
- Tabs :
  - **Message** : contenu original du formulaire + piece-jointes
  - **Timeline** : toutes les actions (email envoye, appel, changement status, note ajoutee)
  - **Devis lies** : documents generes, status
  - **Notes** : bloc markdown libre, tags
  - **Meta** : source traffic, page de conversion, UTM params, IP (pour anti-spam)
- **Actions rapides** :
  - "Repondre par email" (template pre-rempli avec donnees du lead)
  - "Appeler" (tel: link)
  - "Planifier RDV" (cree event calendar)
  - "Convertir en projet" (cree fiche projet pre-remplie)
  - "Marquer perdu" (avec raison : prix / concurrent / timing / silence)

**Automations configurables** :
- Auto-reponse immediate avec accuse reception + delai indicatif
- Relance auto si pas traite sous 2h
- Notification Slack/SMS si lead "premium" (grands comptes identifies)
- Routing intelligent : devis `coupe-feu` → Otman, devis `maintenance` → responsable maintenance

### 4.3 `/admin/projects` — Realisations

**Kanban + grid + fiche detail.**

**Vue grid** : cards avec cover image, titre, client, annee, status (draft/published/archived).

**Fiche projet** :
- **Identite** : titre, slug (auto-generate, editable), categorie, client, lieu, annee, duree, budget (prive)
- **Storytelling** : challenge, solution, resultat (champs markdown separes pour framework de case study)
- **Gallery** : drag-drop upload + reorder + captions + alt text editor + cover selector
- **Before/After** : pair d'images specifiques avec slider
- **Specs techniques** : cotations, materiaux, normes appliquees (reutilise pour SEO)
- **Team lead** : qui a gere ? (link to team_member)
- **Testimonial** : quote du client + autorisation publication
- **SEO** : title, description, OG image auto-generee, schema ConstructionProject
- **Preview live** : iframe a droite du formulaire qui refresh en edit

**Auto-generation** : cree automatiquement un article blog `Case Study` lie et cross-reference dans les services concernes.

### 4.4 `/admin/blog` — Articles

**Editeur split** : markdown + live preview (Notion-style).

- Rich text TipTap : bold, italic, code, lists, headings, quotes, callouts, tables, images inline, YouTube embed, **pull quotes style IEF & CO**, **technical callouts** (EN 1090, etc.)
- **Custom blocks** specifiques metallerie :
  - `Dimension callout` (ex: "Portee maxi : 24m")
  - `Norme reference` (EN 16005...)
  - `Before/After photo pair`
  - `CAD illustration embed` (choisit parmi les composants existants)
  - `Testimonial quote`
- **SEO sidebar** live :
  - Google snippet preview
  - Social card preview
  - Word count + reading time
  - Focus keyword + density
  - Heading structure check
- **Scheduling** : publish now / schedule / draft
- **AI assistant** (voir section 8)

### 4.5 `/admin/media` — Media library

Pas un folder de fichiers. Une **bibliotheque visuelle indexee**.

- Grid de thumbnails avec preview hover
- Filtres : type (photo/pdf/video), tags, lie-a (projet X, service Y), date
- Bulk upload drag-drop
- **Auto-tagging IA** : reconnaissance "soudure", "charpente", "atelier", "chantier", extraction EXIF
- **Edition inline** : recadrage, filtres, alt text IA-genere puis relu
- Usage tracker : "cette photo est utilisee dans 3 pages"
- Format conversion : upload JPG → genere WebP + AVIF automatiquement
- CDN serve via next/image avec blur placeholder

### 4.6 `/admin/maintenance` — Parc clients

**LA valeur metier unique d'IEF & CO** — sa recurrence.

- **Liste sites** (clients avec contrats actifs)
- Par site : **liste d'equipements** (porte sectionnelle, portail, rideau, coupe-feu...)
- Par equipement : **historique d'interventions** + prochaine visite + photo + carnet d'entretien digital
- **Planning visuel** : calendrier drag-drop des visites planifiees
- **Rappels auto** : J-30, J-7, J-0 email+SMS au client
- **PV d'intervention** : formulaire mobile pour techniciens (photo, checklist, remarques → PDF genere)
- **Carnet d'entretien** : export PDF horodate par equipement (cf arrete 21/12/1993)
- **Alertes** : `porte X en retard de 3 semaines`, `batterie pile a changer sur interphone`

### 4.7 `/admin/calendar`

Vue calendar globale :
- Interventions maintenance (vert)
- Poses chantier (bleu)
- RDV commerciaux (orange)
- Jalons livraison (rouge)

Drag-drop pour replanifier. Assignation a un membre de l'equipe. Sync ICS vers Google/Outlook.

### 4.8 `/admin/seo` — Control center

- **Par-page SEO matrix** : tableau de toutes les pages avec leur title, desc, og, score
- **Schema.org builder visuel** : LocalBusiness, Service, FAQ, BlogPosting - cliquer pour editer
- **Redirections** : 301/302 manager avec import CSV
- **Sitemap** : vue d'ensemble + forcer regen
- **Robots.txt** editor
- **Google Search Console** integration : top queries, CTR, impressions embedded
- **Broken link checker** : cron hebdo, rapport avec un-click fix
- **Keyword tracker** : positions top 20 keywords sur Google (via DataForSEO API ou Serpstack)

### 4.9 `/admin/emails`

- **Templates editor** : accuse reception devis, relance apres devis, rappel maintenance, newsletter
- **Historique** : tous les emails sortis, status (delivered/opened/clicked/bounced)
- **Campaigns** : composer une newsletter, segmenter, envoyer
- **Integration Resend** : stats, webhooks bounces → marquage auto

### 4.10 `/admin/team`

Gestion des membres :
- Invite par email (magic link + passkey setup)
- **Roles** : Owner / Admin / Editor / Viewer / Technicien
- **Permissions granulaires** : qui peut publier, qui peut supprimer, qui voit les leads, qui voit les contrats
- **2FA obligatoire** pour Admin+

### 4.11 `/admin/settings`

- **Site settings** : nom, tagline, phone, email, adresse, horaires, social
- **Branding** : palette, logo, favicon, OG image template
- **Nav editor** : drag-drop des items nav principale + footer
- **Legal** : mentions legales, politique confidentialite (editeur markdown)
- **Feature flags** : dark mode par defaut, animations lourdes, view transitions
- **Integrations** : Resend, Google Analytics, Plausible, Google Business Profile

### 4.12 `/admin/audit`

Journal immuable de toutes les actions :
- Qui a modifie quoi, quand, avec diff avant/apres
- Permet rollback granulaire
- Export pour compliance

---

## 5. Design language

**Le backoffice herite du design language du site** mais avec adaptations :

- **Palette** : memes vars CSS (dark mode par defaut, light en option)
- **Typographie** : Plus Jakarta Sans en body, Clash Display reserve aux gros titres
- **Layout** :
  - Sidebar gauche (250px, collapsible to 64px icon-only)
  - Topbar (breadcrumb + search + notifications + user menu)
  - Main content area
- **Density** : plus dense que le site vitrine (c'est un outil de travail, pas une vitrine)
- **Data tables** : style Linear (rows avec hover subtle, sticky headers, resizable columns)
- **Forms** : single-column, labels au-dessus, validations inline, autosave avec indicator
- **Empty states** : illustrations SVG reutilisees du site (coherence visuelle)

**Touches IEF & CO uniques** :
- **Loading state** = welding spark qui trace (canvas mini reutilise du hero)
- **Success state** = weld mark (rouge qui se pose avec pulse)
- **Error state** = dimension line barree rouge

---

## 6. Securite & RGPD

- **Auth** : Passkeys obligatoires (plus de mot de passe), 2FA SMS fallback
- **Sessions** : JWT court + refresh, revocation centralisee
- **Permissions** : RBAC granulaire, audit de chaque access
- **RGPD** :
  - Export donnees a la demande (1 clic sur fiche lead)
  - Suppression automatique leads > 3 ans sauf signes
  - Logs IP anonymises apres 30j
  - Bannier cookies = none (que du strictement necessaire)
- **Backups** : snapshots Neon quotidiens, point-in-time recovery 7j
- **Rate limiting** sur formulaires publics (Upstash Redis)
- **Honeypot + Turnstile** (Cloudflare) anti-bot

---

## 7. Analytics & metriques

Dashboard proprietaire cross-referencant :
- **Traffic** (Vercel Analytics + Plausible)
- **Conversions formulaire** (tracking pixels custom)
- **Funnel Service → Devis** (quelles pages services convertissent le mieux)
- **Lead quality score** : croise origin + taille entreprise + completude message
- **Revenue attribution** : quel canal a amene les devis signes (UTM preserve end-to-end)
- **SEO performance** : positions + CTR Google Search Console integres

---

## 8. Assistant IA

**Pas un gadget.** Un assistant contextuel qui accelere les taches recurrentes.

- **"Repondre ce lead"** : Claude 4.7 genere un draft de reponse personnalise (ton IEF & CO appris sur vos reponses precedentes), l'utilisateur edit + envoie
- **"Ecrire un article sur X"** : genere structure + brouillon, edit en rich text, publish
- **"Decrire ce projet"** : a partir de photos uploadees + client + quelques mots-cles → genere le case study complet
- **"Alt text"** : IA auto-genere alt sur toutes les images, relu par humain
- **"Suggestion SEO"** : analyse une page et suggere title/desc/mot-cle ameliores
- **"Traduire"** : FR ↔ EN pour ouverture internationale future
- **"Detect leads spam"** : classifieur qui marque les leads douteux avant humain
- **"Executive summary"** : chaque lundi, digest IA des metriques + actions recommandees

Backend : **Anthropic API** (Claude 4.7 Sonnet pour ecriture, 4.7 Haiku pour classification), avec prompt caching pour couts et RAG sur le contenu existant (articles, fiches projet) pour coherence stylistique.

---

## 9. Mobile

Le backoffice mobile n'est pas une necessite pour tout — mais 2 workflows DOIVENT fonctionner en mobile :

1. **Leads rapides** : lire/assigner/repondre un lead depuis le telephone
2. **PV d'intervention** : le technicien sur chantier remplit un formulaire mobile (photos + checklist) → genere un PDF signe numeriquement

Le reste (blog, projets detailles) reste desktop-first.

---

## 10. Roadmap de livraison

### Phase 1 — MVP (2 semaines)
- Auth + roles (Clerk)
- Schema DB + migrations (Drizzle)
- `/admin` dashboard simple
- `/admin/leads` avec lecture/status/assignation + reponse email via Resend
- `/admin/projects` CRUD basique avec upload images
- Connection : les formulaires site ecrivent en DB au lieu de juste console.log

### Phase 2 — Contenu (2 semaines)
- `/admin/blog` avec TipTap editor
- `/admin/services` edition complete
- `/admin/team`, `/admin/testimonials`, `/admin/clients`
- `/admin/media` library avec Vercel Blob
- Migration progressive des donnees actuellement dans `src/data/*.ts` vers DB

### Phase 3 — Operations (3 semaines)
- `/admin/maintenance` parc clients + contrats
- `/admin/calendar` avec sync Google
- PV d'intervention mobile
- `/admin/emails` templates + historique
- Automations (relances, rappels)

### Phase 4 — Intelligence (2 semaines)
- `/admin/seo` control center complet
- `/admin/ai` assistant Claude
- Auto-tagging images
- Broken link checker + content health

### Phase 5 — Polish (1 semaine)
- Command palette `Cmd+K`
- Keyboard shortcuts globaux
- Empty states + loading states IEF & CO
- Audit log + rollback
- Onboarding guide

**Total : ~10 semaines pour backoffice complet, cutting edge, unique au marche de la metallerie.**

---

## 11. Couts d'hebergement estimes

| Service | Plan | Cout |
|---|---|---|
| Vercel | Hobby (free) → Pro si besoin | 0 → 20 USD/mois |
| Neon Postgres | Free (0.5 GB) → Launch | 0 → 19 USD/mois |
| Vercel Blob | 1 GB free → pay-as-you-go | ~1 USD/mois au debut |
| Clerk | Free jusqu'a 10k users | 0 USD |
| Resend | Free 3000 emails/mois | 0 USD |
| Anthropic API | Usage-based | ~10-30 USD/mois selon usage |
| **Total** | | **~30-70 USD/mois** |

Ridiculement bas pour la valeur livree.

---

## 12. Pourquoi personne ne fait ca chez les metalliers

Parce que **les concurrents (serrurerie.fr, batiactu, etc.) vendent des sites
WordPress** a leurs clients metalliers. Ils ne livrent pas un cockpit metier
integre. En offrant ca a IEF & CO, on leur donne **un avantage operationnel
structurel** — leurs commerciaux repondent plus vite, leurs techniciens
tracent leurs interventions, leurs chefs de projet pilotent depuis une seule
source de verite.

Quand les concurrents devront bouger, ils devront faire 3 ans de rattrapage.

---

## 13. Question ouverte pour toi

Avant de lancer le build, 3 decisions a prendre :

1. **Scope MVP** : on demarre par Phase 1 uniquement (leads + projets basiques)
   ou on vise tout le Phase 1+2 d'un coup ?

2. **Hosting** : tu veux garder tout sur Vercel ou repartir (Cloudflare Workers
   pour le site public + un dashboard separe type Railway) ?

3. **Migration donnees** : je migre `src/data/*.ts` vers la DB progressivement
   (double-ecriture le temps de la transition) ou on gele le site actuel et
   on migre en une bascule ?

Quand tu me donnes les reponses, je pose un plan d'execution detaille avec
tickets, je pousse les migrations DB, et je commence par `/admin/leads` —
parce que c'est le module qui genere le plus de valeur immediate (aucun lead
ne doit plus jamais tomber en console.log).
