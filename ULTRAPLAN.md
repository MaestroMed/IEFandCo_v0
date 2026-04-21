# ULTRAPLAN — IEF & CO : Monopole maintenance B2B portes industrielles & sectionnelles

**Mission** : faire de IEF & CO la référence #1 en France sur la maintenance B2B des fermetures professionnelles, portes industrielles et portes sectionnelles — d'abord sur l'Île-de-France, puis nationalement.

**Horizon** : 18 mois pour saturer le SEO local IDF, 36 mois pour la traction nationale.

---

## 0. Vision

> *Quand un directeur logistique d'un entrepôt en Île-de-France tape "panne porte sectionnelle" sur Google, IEF & CO doit apparaître en premier — et son site doit convertir mieux que Hörmann.*

Trois moats à construire :

1. **Moat SEO** — couverture sémantique exhaustive (zones × services × marques × pannes × normes). Aucun concurrent local ne fait ça.
2. **Moat contenu** — autorité technique reconnue (guides, glossaire, comparatifs, calculateurs).
3. **Moat opérationnel** — portail client, SLA, transparence tarifaire — ce que les leaders allemands font mal côté digital.

---

## 1. État des lieux (audit 2026-04)

### Forces
- ✅ Design **9/10** (Forged Light, blueprint aesthetic, animation HeroCharpente unique)
- ✅ Backoffice complet (CRM, CMS, GMAO embryonnaire, content adapter DB-driven)
- ✅ Photos Unsplash intégrées avec traitement brand
- ✅ Performances correctes après optimisations (gradients statiques, plus de `backdrop-filter`, lazy-load HeroCharpente)
- ✅ SEO foundations propres (schemas JSON-LD, meta dynamiques, sitemap, OG image)

### Faiblesses critiques
- ❌ **Profondeur catalogue 3/10** — 7 services, 0 sous-page produit, 0 fiche technique
- ❌ **SEO local 2/10** — 0 page géographique
- ❌ **Maintenance pas mise en avant 5/10** alors que c'est le cœur du modèle B2B récurrent
- ❌ **Trust signals 6/10** — pas de logos clients réels, pas de Google Reviews, pas de presse
- ❌ **Espace pro / portail client 0/10** — n'existe pas
- ❌ **Blog 3/10** — 5 articles génériques

### Bugs UX
- ⚠️ Dark/light mode partiellement cassé (sections-forge-* ignorent le thème)
- ⚠️ Pas de sticky CTA mobile pour appel urgence
- ⚠️ Pas de téléphone visible dans le Hero
- ⚠️ Pas de tarif indicatif sur les services

---

## 2. Concurrence

### Tier 1 — leaders mondiaux/européens
| Concurrent | Force | Faiblesse | À copier |
|------------|-------|-----------|----------|
| **Hörmann** | Mega-menu produit, espace pro, configurateur 3D, multilangue | Site corporate froid, peu de SEO local | Mega-menu, espace pro, catalogues PDF |
| **Crawford / ASSA ABLOY** | Positionnement par secteur, "Crawford Care" comme produit phare, ROI chiffré | Trop institutionnel, devis lent | Solutions par secteur, contrat premium produit |
| **Maviflex** | Catalogue exhaustif, schémas techniques | Design daté, conversion faible | Documentation technique riche |

### Tier 2 — nationaux français
| Concurrent | Force | Faiblesse | À battre |
|------------|-------|-----------|----------|
| **Fermetures Aubert** | Multi-marques, urgence visible, témoignages photos | Design vieillissant | Sur le design + transparence |
| **Comety** | Présence régionale forte | Faible SEO long-tail | Sur le contenu |
| **Métallerie Lambert** | Niche bâtiment historique | Pas de digital | Sur tout |

### Notre positionnement
- **Beauté + technicité** : un site qui rassure visuellement (comme Apple ou Linear) **+** une profondeur SEO/contenu inégalée localement.
- **Promesse** : "Le métallier digital. Chaque ouvrage tracé, chaque intervention SLA, chaque trait expliqué."

---

## 3. Architecture cible — sitemap

```
/
├── /services
│   ├── /fermetures-industrielles
│   ├── /portails-clotures
│   ├── /structures-metalliques
│   ├── /menuiserie-metallique
│   ├── /portes-coupe-feu
│   ├── /automatismes
│   └── /maintenance
│       ├── /maintenance/contrats     ← comparateur Bronze/Argent/Or
│       ├── /maintenance/depannage-24h
│       ├── /maintenance/audit-gratuit
│       └── /maintenance/[marque]    ← Hörmann, Crawford, Maviflex, Came, Novoferm
│
├── /zones-intervention                 ← carte interactive
│   ├── /metallerie-paris
│   ├── /metallerie-hauts-de-seine
│   ├── /metallerie-seine-saint-denis
│   ├── /metallerie-val-de-marne
│   ├── /metallerie-val-d-oise
│   ├── /metallerie-yvelines
│   ├── /metallerie-seine-et-marne
│   └── /metallerie-essonne
│
├── /comparatifs
│   ├── /comparatif/porte-sectionnelle-vs-rideau-metallique
│   ├── /comparatif/contrat-preventive-vs-curative
│   ├── /comparatif/motorisation-chaine-vs-courroie
│   ├── /comparatif/acier-vs-aluminium-portail
│   └── /comparatif/hormann-vs-crawford
│
├── /guides
│   ├── /guide/choisir-porte-industrielle-entrepot
│   ├── /guide/audit-parc-fermetures
│   ├── /guide/cout-panne-vs-contrat-maintenance
│   └── /guide/normes-en-1090-en-13241-en-16034
│
├── /glossaire                          ← 50+ entrées techniques
│   └── /glossaire/[terme]
│
├── /realisations
│   └── /realisations/[slug]
│
├── /blog                               ← pillar + cluster
│   └── /blog/[slug]
│
├── /catalogue                          ← téléchargements PDF
├── /a-propos
├── /contact
├── /devis                              ← multi-step + estimateur
├── /assisteo
├── /espace-pro                         ← (futur) portail client
├── /carrieres                          ← (futur)
└── /admin                              ← backoffice
```

**URLs ciblées totales** : ~150 pages publiques (vs 14 actuellement).

---

## 4. Phases d'exécution

### Phase A — Foundations & UX fixes (this session)
**Objectif** : corriger les bugs critiques + poser les fondations SEO.

- [x] Audit
- [ ] Fix dark/light mode (sections respectent le thème)
- [ ] TrustStrip above-the-fold (4 KPIs immédiatement visibles)
- [ ] StickyMobileCTA (Appel + Devis)
- [ ] Téléphone discret dans le Hero
- [ ] Tarif indicatif sur services
- [ ] Page `/maintenance/contrats` (comparateur Bronze/Argent/Or)
- [ ] 8 pages géo IDF
- [ ] 4 pages marques maintenance
- [ ] Comparator `/comparatif/porte-sectionnelle-vs-rideau-metallique`
- [ ] Comparator `/comparatif/contrat-preventive-vs-curative`
- [ ] Glossaire `/glossaire` (50+ entrées)
- [ ] Page `/zones-intervention` avec carte
- [ ] Page `/catalogue` download
- [ ] FAQ étendue (20+ questions catégorisées)
- [ ] Sitemap + nav + footer mis à jour

### Phase B — SEO local saturation (next 2-4 weeks)
- 8 zones × 5 services prioritaires = **40 URLs** combos `/zone-X/service-Y`
- Schema.org `LocalBusiness` × 8 (un par département)
- Google My Business optimisé multi-établissements
- Inscriptions annuaires : Pages Pro, Europages, Kompass, batiproduits, Hellopro
- Backlinks vers les comparateurs (citations sur forums pro, Reddit r/fr/construction)

### Phase C — Contenu pillar + cluster (continu, 6 mois)
- 20 articles **pillar** (3000+ mots) :
  - "Guide complet maintenance porte sectionnelle 2026"
  - "Comment choisir son contrat de maintenance porte industrielle"
  - "Coût d'une panne porte industrielle vs contrat maintenance : ROI chiffré"
  - "EN 1090 expliqué pour acheteurs B2B"
  - "Audit gratuit parc porte industrielle : méthode et checklist PDF"
  - "Pannes les plus fréquentes des portes sectionnelles industrielles"
  - "Motorisation porte industrielle : guide d'achat 2026"
  - "Sécurité porte industrielle : cadre légal arrêté 21/12/1993"
  - "Porte coupe-feu EI 60 vs EI 120 : que choisir"
  - "Garantie décennale métallerie : ce que dit la loi"
  - "Comparatif des 5 plus grandes marques de portes industrielles"
  - "Délais d'intervention SAV : standards du marché en 2026"
  - "Comment réduire de 40% le coût de maintenance de votre parc"
  - "Carnet d'entretien numérique : pourquoi c'est obligatoire"
  - "Métallerie sur mesure : prix au m² et délais 2026"
  - "Charpente métallique vs béton : comparatif coût + délai + ESG"
  - "Maintenance portail automatique : checklist annuelle"
  - "Coupure d'urgence porte industrielle : équipements obligatoires"
  - "Détection présence anti-écrasement : EN 12453 expliqué"
  - "Quel contrat de maintenance pour entrepôt logistique e-commerce"

- **5 articles cluster par pillar** = 100 articles satellites longue traîne
- Calendrier : **2 publications/semaine pendant 12 mois**

### Phase D — Conversion + portail client (3-6 mois)
- **Quote builder** interactif (3 étapes → devis estimatif instant)
- **Portail client** (login, suivi interventions, historique, contrats, factures)
- **Réservation RDV** Calendly intégré pour étude
- **Live chat** Crisp avec routing équipe technique
- **Newsletter B2B** mensuelle (segmentée par persona : DRH / Logistique / Achats)

### Phase E — Backlinks + autorité (continu)
- Inscriptions annuaires B2B (50+)
- Press releases trimestrielles (industriels press)
- Partenariats architectes (lien réciproque)
- Présence dans 5 podcasts métier
- Sponsoring conférences logistique IDF
- Inscription appels d'offres marchésonline / boamp / publictenders

---

## 5. Plan SEO détaillé — Phase A + B

### 5.1 Pages géographiques (Phase A)

**Template** : `/metallerie-{ville-ou-departement}`

Chaque page contient :
- H1 : "Métallerie & maintenance professionnelle à {Zone}"
- Hero avec carte zoomée + KPIs (X interventions/an dans cette zone, X clients actifs)
- Section "Nos clients dans le {Zone}" avec 6-8 logos zone
- Section services avec lien vers chaque service détaillé
- Section délais d'intervention zonée ("24h sous contrat dans le 95")
- Témoignages clients zone
- Section "Pourquoi nos clients du {Zone} nous choisissent"
- FAQ zonée (transport, déplacement, urgence, distance atelier)
- CTA + téléphone zone (numéro local idéalement)
- Schema.org `LocalBusiness` avec `areaServed` zone
- 800-1500 mots de contenu unique par zone

**8 pages** :
1. `/metallerie-paris` (75)
2. `/metallerie-hauts-de-seine` (92)
3. `/metallerie-seine-saint-denis` (93)
4. `/metallerie-val-de-marne` (94)
5. `/metallerie-val-d-oise` (95) — siège, "épicentre"
6. `/metallerie-yvelines` (78)
7. `/metallerie-seine-et-marne` (77)
8. `/metallerie-essonne` (91)

### 5.2 Pages marques maintenance (Phase A)

**Template** : `/maintenance/{marque}`

4 pages prioritaires (les plus recherchées) :
1. `/maintenance/hormann` — 14k searches/mois "maintenance hormann"
2. `/maintenance/crawford` — 4k searches/mois
3. `/maintenance/maviflex` — 2k searches/mois
4. `/maintenance/came` — 8k searches/mois (automatismes)

Chaque page :
- H1 : "Maintenance porte {marque} en Île-de-France — par IEF & CO"
- "Spécialiste agréé / formé sur les produits {marque}"
- Liste des produits {marque} maintenus (catalogue déroulant)
- Pannes courantes {marque} (cluster sémantique)
- Pièces détachées disponibles (visibilité stock)
- Devis maintenance instantané (formulaire pré-rempli marque)
- Témoignages clients {marque}
- Comparatif "{marque} vs autres" intégré

### 5.3 Comparatifs (Phase A)

5 comparatifs prioritaires :
1. `/comparatif/porte-sectionnelle-vs-rideau-metallique` — 12k searches/mois
2. `/comparatif/contrat-preventive-vs-curative` — 3k searches/mois
3. `/comparatif/motorisation-chaine-vs-courroie` — 1.5k searches/mois
4. `/comparatif/acier-vs-aluminium-portail` — 4k searches/mois
5. `/comparatif/hormann-vs-crawford` — 800 searches/mois mais conversion forte

Format : table comparative + verdict + cas d'usage + CTA.

### 5.4 Glossaire (Phase A)

`/glossaire` — landing principale + 50+ pages terme.

Termes prioritaires (ordre alphabétique) :
- Anti-pince-doigts
- Bandes lumineuses détection
- Contrepoids torsion
- DOE (Dossier des Ouvrages Exécutés)
- EN 1090 / EN 13241 / EN 16034 / EN 12453 / EN 12604
- Eurocode 3
- EXC1 / EXC2 / EXC3 / EXC4
- Fail-safe / Fail-secure
- Gond articulé
- Hauteur de retombée
- Inox 304 / 316
- Joint d'étanchéité ISO
- Linteau
- Motorisation tubulaire / à arbre
- Niveau de sécurité (NF P25)
- Open-back / Closed-back
- Panneau sandwich (mousse PUR)
- Quincaillerie sécurité
- Rideau à lames pleines / micro-perforées
- Section thermique
- Tablier
- U-value (transmission thermique)
- Verrouillage électromécanique
- WPQR (Welding Procedure Qualification Record)
- ... (+25 termes additionnels)

Chaque entrée : 200-500 mots, schema.org `DefinedTerm`, lien vers services pertinents.

### 5.5 Combos zone × service (Phase B — to come)

**40 URLs** :
- `/depannage-porte-sectionnelle-paris`
- `/depannage-porte-sectionnelle-roissy`
- `/maintenance-rideau-metallique-92`
- ... etc.

---

## 6. Métriques de succès

### Phase A (this session) — production-ready foundations
- ✅ 0 bugs UX critiques
- ✅ +25 nouvelles URLs SEO-optimisées
- ✅ Lighthouse > 90 sur Performance / SEO / Accessibility
- ✅ Schema.org sur toutes les nouvelles pages
- ✅ Sitemap auto-update via DB

### 3 mois
- Top 10 sur **30+ requêtes** "maintenance porte sectionnelle {ville}"
- 1000+ visites organiques/mois
- 30+ leads qualifiés/mois via le devis

### 6 mois
- Top 3 sur **15+ requêtes** maintenance + zone
- 5000+ visites organiques/mois
- 100+ leads qualifiés/mois
- 10 nouveaux contrats maintenance/mois (B2B)

### 12 mois
- Top 3 sur **50+ requêtes** principales
- 20 000+ visites organiques/mois
- 250+ leads qualifiés/mois
- Position #1 IDF pour "métallier B2B portes industrielles"
- 100+ contrats maintenance actifs

### 24 mois
- Top 1 sur 20+ requêtes nationales
- Expansion Lyon / Marseille / Lille via templates de zones
- Brand recognition : "IEF & CO" cherché en marque > 1000/mois

---

## 7. Stack technique additionnel à prévoir

| Besoin | Outil suggéré | Quand |
|--------|---------------|-------|
| Live chat | Crisp ou Intercom | Phase D |
| Booking RDV | Cal.com (open-source) | Phase D |
| Newsletter | Resend (déjà en place) + Buttondown | Phase D |
| CRM commercial | HubSpot Free / lead-only | Phase E |
| Analytics fine | Plausible (privacy-friendly) | Phase A.5 |
| Heatmaps | Hotjar Free | Phase A.5 |
| Search interne | Algolia DocSearch ou Pagefind | Phase B |
| PDF generation | Puppeteer pour devis/PV | Phase D |
| Maps | Mapbox GL JS (carte zone interactive) | Phase A |
| Schema validation | Schema App ou Schema.org test | Phase A continu |
| SEO audit | Ahrefs / Semrush (mensuel) | Phase B |
| Speed monitoring | Vercel Speed Insights (gratuit) | Phase A |

---

## 8. Investissements prévisibles

- **Domaines géographiques** (optionnel si on veut des micro-sites par zone) : 8 × 12 €/an = 100 €
- **Photos pro client** (vraies photos chantier IEF & CO) : ~3000 € pour shoot pro 2 jours
- **Logos clients** (négociation droit affichage + récupération assets) : 0 € si bien fait
- **Mapbox** : gratuit jusqu'à 50k chargements/mois
- **Resend** : 100 emails/jour gratuit, $20/mois pour 50k
- **Hosting** Vercel Pro : $20/mois
- **Annuaires premium** (Pages Pro Pro, Europages Premium) : 200-500 €/an

**Total Phase A** : 0 € (déjà en place)  
**Total Phase B-C** : ~1000-3000 € (annuaires + photos)  
**Total Phase D-E** : variable selon traction

---

## 9. Ce qui ne change PAS

- ✅ Design Forged Light (signature visuelle)
- ✅ Architecture Next.js 15 + Drizzle SQLite (postgres-ready)
- ✅ Backoffice complet (continue d'évoluer)
- ✅ Content adapter DB-driven (toutes les nouvelles pages doivent y passer pour permettre à l'admin de modifier le contenu)

---

## 10. Engagement

> *Ce document est un contrat avec moi-même : chaque trimestre, on mesure où on en est, on ajuste, on accélère sur ce qui marche, on coupe ce qui ne marche pas. Le but n'est pas de "faire un beau site" — c'est de gagner le marché.*

---

**Date** : 2026-04-20  
**Version** : 1.0  
**Owner** : IEF & CO + équipe digital
