export interface RealisationKPI {
  label: string;
  value: string;
}

export interface RealisationPhase {
  title: string;
  description: string;
  duration?: string;
}

export interface Realisation {
  slug: string;
  title: string;
  category: "structures" | "portails" | "industrielles" | "menuiserie" | "coupe-feu" | "automatismes" | "maintenance";
  client: string;
  year: number;
  location: string;
  description: string;
  highlight: string; // key spec/number

  // Deep case study fields
  /** Tagline court pour hero */
  tagline?: string;
  /** Contexte initial — ce que le client avait, le problème */
  challenge?: string;
  /** Notre approche / réponse technique */
  solution?: string;
  /** Résultat chiffré et qualitatif */
  result?: string;
  /** KPIs chiffrés du projet (4 max) */
  kpis?: RealisationKPI[];
  /** Phases chronologiques du projet */
  phases?: RealisationPhase[];
  /** Spécifications techniques clés */
  specs?: { label: string; value: string }[];
  /** Normes et certifications appliquées */
  standards?: string[];
  /** Témoignage client spécifique à ce projet */
  testimonial?: { quote: string; author: string; role: string };
  /** Mot-clé SEO principal visé */
  seoTitle?: string;
  seoDescription?: string;
}

export const realisations: Realisation[] = [
  {
    slug: "charpente-logistique-roissy",
    title: "Charpente métallique entrepôt logistique 3200 m²",
    category: "structures",
    client: "Groupe logistique IDF",
    year: 2025,
    location: "Roissy (95)",
    description:
      "Charpente acier S355 pour entrepôt 3200 m². Calcul Eurocode 3, EN 1090 EXC2, livré en 8 semaines.",
    highlight: "3200 m²",
    tagline:
      "Une charpente livrée en 8 semaines sur un terrain contraint par la proximité aéroport — sans un jour de retard.",
    challenge:
      "Notre client opérateur logistique avait besoin d'un nouvel entrepôt de 3200 m² à Roissy pour absorber une croissance forte de son activité e-commerce. Les contraintes étaient multiples : terrain en zone aéroportuaire (limitations hauteur, couloir de vol), délais serrés imposés par le bailleur (livraison sous 10 semaines), conditions de sol médiocres (remblai compacté), et besoin d'une nef mono-travée de 50×64m sans poteau intermédiaire pour maximiser la flexibilité d'aménagement des racks.",
    solution:
      "Notre bureau d'étude a conçu une charpente treillis en acier S355 avec poutres triangulées permettant une portée mono-travée de 50m. Dimensionnement Eurocode 3 + Eurocode 1 (vent, neige zone 1A), note de calcul structurel complète, contrôle fondations par bureau de contrôle externe. Fabrication en atelier IEF & CO pendant que les fondations se coulaient sur site — gain de 3 semaines. Pose en 10 jours par équipe de 4 compagnons avec grue mobile 80t, en coordination avec les autres corps d'état (maçon, couvreur, bardeur, électricien). Peinture anti-corrosion classe C3 appliquée en atelier avant livraison.",
    result:
      "Charpente livrée en 8 semaines au lieu des 10 prévues, permettant au client de démarrer l'aménagement intérieur en avance. Aucun incident sécurité sur chantier. Réception sans réserves par le bureau de contrôle. Le bâtiment est aujourd'hui opérationnel et le client nous a confié la maintenance des fermetures industrielles (portes sectionnelles, rideaux) sous contrat Argent.",
    kpis: [
      { label: "Surface totale", value: "3200 m²" },
      { label: "Portée mono-travée", value: "50 m" },
      { label: "Délai total", value: "8 sem." },
      { label: "Tonnage acier", value: "42 t" },
    ],
    phases: [
      { title: "Relevé & étude", description: "Visite terrain, analyse contraintes aéroportuaires, relevé topo.", duration: "1 sem." },
      { title: "Plans & notes de calcul", description: "Modélisation 3D Tekla, notes Eurocode 3, validation BET externe.", duration: "2 sem." },
      { title: "Fabrication atelier", description: "Découpe, soudure MAG, peinture C3 en atelier Groslay.", duration: "4 sem." },
      { title: "Pose chantier", description: "Assemblage sur site, coordination grue 80t, livraison conforme.", duration: "10 j." },
    ],
    specs: [
      { label: "Acier", value: "S355JR galvanisé" },
      { label: "Portée", value: "50 m mono-travée" },
      { label: "Hauteur utile", value: "10,5 m" },
      { label: "Charge toiture", value: "Neige + photovoltaïque 15 kg/m²" },
      { label: "Peinture", value: "C3 EN ISO 12944 · 180 µm" },
    ],
    standards: ["EN 1090 EXC2", "Eurocode 3", "Eurocode 1 (vent + neige)", "NF ISO 12944-5"],
    testimonial: {
      quote:
        "Livraison 2 semaines en avance sur un projet tendu. L'équipe IEF & CO a démontré une rigueur technique exemplaire et une vraie capacité à anticiper. Nous leur avons reconfié la maintenance — la suite logique d'un partenariat de confiance.",
      author: "Directeur Logistique",
      role: "Groupe logistique IDF",
    },
    seoTitle: "Charpente métallique entrepôt logistique 3200 m² à Roissy — IEF & CO",
    seoDescription:
      "Case study charpente acier S355 entrepôt logistique Roissy : 3200 m², 50m portée mono-travée, 8 semaines livraison, EN 1090 EXC2. Par IEF & CO.",
  },

  {
    slug: "portail-autoporte-eg-group",
    title: "Portail autoporté 8m + contrôle d'accès RFID",
    category: "portails",
    client: "EG Group",
    year: 2025,
    location: "Val-d'Oise",
    description:
      "Portail autoporté 8m motorisé avec contrôle RFID badge + lecteur de plaques. Anti-bélier intégré.",
    highlight: "8 mètres",
    tagline:
      "Un accès 8m de long automatisé, sécurisé niveau K4, connecté au système badge EG Group — sans aucun rail au sol.",
    challenge:
      "EG Group souhaitait moderniser l'accès poids lourds d'un de ses sites du Val-d'Oise. Le portail existant, battant 2 vantaux, ne permettait plus les flux PL en croissance. Contraintes : aucun rail au sol possible (contraintes génie civil), sécurité anti-intrusion forte (site à risque), intégration obligatoire avec leur système de badges SALTO existant, et zone technique EDF à préserver lors des travaux.",
    solution:
      "Installation d'un portail autoporté 8m sur portique IEF & CO conçu sur mesure, motorisation Came BKS 1800 (haute puissance), complété par 2 bornes anti-bélier escamotables Came P5 (certifiées PAS 68 K4) en complément. Armoire Came ZL19 configurée avec lecteurs RFID SALTO-compatibles (badge collaborateur + lecteur plaques caméra ANPR pour les visiteurs). Fondations renforcées pour le portique autoporté (fosse 1,8m × 4m). Travaux réalisés sans coupure d'exploitation (mise en place temporaire de gardiennage pendant 3 jours).",
    result:
      "Mise en service conforme au cahier des charges. Temps d'ouverture réduit à 12 secondes (vs 25s portail battant). Intégration SALTO réussie — aucune modification du système d'accès global. Les bornes anti-bélier sont désormais utilisées quotidiennement lors des créneaux à risque. Contrat de maintenance Argent souscrit à la livraison (4 visites/an + dépannage sous 4h).",
    kpis: [
      { label: "Largeur d'ouverture", value: "8 m" },
      { label: "Temps d'ouverture", value: "12 s" },
      { label: "Protection anti-bélier", value: "PAS 68 K4" },
      { label: "Intégration badges", value: "SALTO API" },
    ],
    phases: [
      { title: "Audit + étude", description: "Analyse flux PL, relevé site, compatibilité SALTO.", duration: "2 sem." },
      { title: "Fabrication portique", description: "Portique acier S275 galvanisé, structure autoporté sur roulement.", duration: "3 sem." },
      { title: "Génie civil", description: "Fosse fondations + pose bornes anti-bélier P5.", duration: "1 sem." },
      { title: "Pose + paramétrage", description: "Installation portail, câblage, paramétrage armoire ZL19 + API SALTO.", duration: "4 j." },
    ],
    specs: [
      { label: "Structure", value: "Acier S275 galvanisé" },
      { label: "Portée", value: "8 m autoporté (sans rail)" },
      { label: "Motorisation", value: "Came BKS 1800 kg" },
      { label: "Anti-bélier", value: "2× Came P5 PAS 68 K4" },
      { label: "Lecteurs", value: "RFID SALTO + ANPR camera" },
    ],
    standards: ["EN 13241", "EN 12453", "PAS 68 K4", "Règlement sécurité EG Group"],
    testimonial: {
      quote:
        "IEF & CO a livré un système totalement intégré à notre environnement SALTO existant. La qualité d'exécution et le respect des délais ont été irréprochables.",
      author: "Responsable Sûreté",
      role: "EG Group France",
    },
    seoTitle: "Portail autoporté 8m + contrôle d'accès RFID — EG Group Val-d'Oise",
    seoDescription:
      "Case study portail 8m autoporté motorisé Came BKS + anti-bélier PAS 68 K4 + intégration SALTO. EG Group Val-d'Oise. Par IEF & CO.",
  },

  {
    slug: "porte-sectionnelle-eni",
    title: "12 portes sectionnelles industrielles sur 4 sites",
    category: "industrielles",
    client: "ENI",
    year: 2024,
    location: "Plusieurs sites IDF",
    description:
      "Remplacement de 12 portes sectionnelles industrielles avec motorisation rapide et organes de sécurité.",
    highlight: "12 portes",
    tagline:
      "Un parc vieillissant entièrement remplacé en 6 semaines, sans un jour d'arrêt d'exploitation.",
    challenge:
      "ENI exploite plusieurs stations-service et dépôts carburants en Île-de-France. Les portes sectionnelles d'un parc de 4 sites (stations-service + dépôt ICPE) étaient en fin de vie : pannes récurrentes, ressorts vétustes, motorisations dépassées, conformité ATEX non garantie. L'enjeu : remplacer 12 portes sans interrompre l'exploitation (stations ouvertes 24/7) et en respectant les exigences ATEX spécifiques aux dépôts carburants.",
    solution:
      "Sélection de portes Hörmann SPU 67 Thermo (isolation + résistance vent) avec motorisation SupraMatic HT (version ATEX pour le dépôt). Planning établi en étroite collaboration avec chaque responsable de site : intervention de nuit (22h-6h) pour les stations-service, week-end pour le dépôt, avec équipe dédiée de 3 techniciens. Chaque porte remplacée en 5h maximum (dépose + pose + paramétrage). Test complet + formation utilisateurs sur place. Contrat de maintenance préventive semestrielle souscrit à la livraison.",
    result:
      "12 portes remplacées en 6 semaines (2 par semaine), aucune interruption d'exploitation, aucun incident sécurité. Tous les sites en conformité avec les exigences ATEX et l'arrêté du 21 décembre 1993. Satisfaction client confirmée par renouvellement du contrat sur le périmètre agrandi (4 portes additionnelles commandées en 2025).",
    kpis: [
      { label: "Portes remplacées", value: "12" },
      { label: "Sites concernés", value: "4" },
      { label: "Arrêt exploitation", value: "0 h" },
      { label: "Délai total", value: "6 sem." },
    ],
    phases: [
      { title: "Audit parc existant", description: "Inventaire, photos, relevés dimensions, état conformité ATEX.", duration: "1 sem." },
      { title: "Planification multi-sites", description: "Coordination avec chaque responsable, planning par site.", duration: "1 sem." },
      { title: "Fabrication Hörmann", description: "Commande spéciale ATEX pour site dépôt, livraison atelier.", duration: "2 sem." },
      { title: "Remplacements successifs", description: "Intervention nocturne 2 portes/semaine, formation users.", duration: "6 sem." },
    ],
    specs: [
      { label: "Portes sectionnelles", value: "12× Hörmann SPU 67 Thermo" },
      { label: "Dimensions moyennes", value: "4.2m × 4.5m" },
      { label: "Motorisation standard", value: "SupraMatic P (10× stations)" },
      { label: "Motorisation ATEX", value: "SupraMatic HT (2× dépôt)" },
      { label: "Isolation thermique", value: "U = 1.0 W/m².K" },
    ],
    standards: ["EN 13241", "EN 16034", "ATEX II 3G (zone dépôt)", "Arrêté du 21/12/1993"],
    testimonial: {
      quote:
        "Remplacer 12 portes sur 4 sites en activité 24/7 : c'était le défi. IEF & CO l'a relevé sans une heure d'arrêt. Leur méthodologie de planning et leur sérieux ATEX font la différence.",
      author: "Responsable Maintenance",
      role: "ENI Retail France",
    },
    seoTitle: "Remplacement 12 portes sectionnelles industrielles ATEX — ENI",
    seoDescription:
      "Case study remplacement 12 portes sectionnelles Hörmann SPU 67 sur 4 sites ENI en IDF, 0 arrêt exploitation, conformité ATEX. Par IEF & CO.",
  },

  {
    slug: "facade-vitree-bureaux-paris",
    title: "Façade vitrée tertiaire 480 m²",
    category: "menuiserie",
    client: "Opérateur immobilier",
    year: 2024,
    location: "Paris (75)",
    description:
      "Mur-rideau aluminium + vitrage isolant Uw 1.4. Façade semi-structurelle avec entrée principale en verre feuilleté.",
    highlight: "Uw 1.4",
    tagline:
      "Une façade vitrée 480 m² posée en 5 semaines sans intrusion d'eau pendant un hiver parisien humide.",
    challenge:
      "Opérateur immobilier rénovant un immeuble de bureaux du 9e arrondissement de Paris. La façade existante (années 70, simple vitrage, déperditions massives) devait être remplacée par une façade mur-rideau moderne répondant aux exigences RE2020, tout en respectant la contrainte Architecte des Bâtiments de France (façade dans périmètre protégé). Le chantier devait se dérouler en site occupé (plateaux de bureaux partiellement utilisés).",
    solution:
      "Conception d'un mur-rideau semi-structurel à ossature aluminium thermolaquée noir mat (validation ABF obtenue), vitrage double thermique 6/16/4 faible émissif argon (Uw = 1.4 W/m².K). Entrée principale repensée en verre feuilleté 66.2 (sécurité anti-effraction RC3). Planning étalé sur 5 semaines avec modules d'étanchéité provisoire pour interventions par niveau (2 étages/semaine). Vitrage posé depuis nacelles motorisées (pas d'échafaudage pour préserver la circulation trottoir).",
    result:
      "Façade livrée sans réserves par l'ABF. Performance thermique mesurée conforme aux calculs (Uw = 1.38 réel). Pas une seule infiltration d'eau malgré un hiver pluvieux pendant les travaux (étanchéité provisoire parfaitement exécutée). Gain énergétique mesuré à +28% sur le premier hiver post-travaux.",
    kpis: [
      { label: "Surface façade", value: "480 m²" },
      { label: "Uw mesuré", value: "1.38 W/m².K" },
      { label: "Délai pose", value: "5 sem." },
      { label: "Gain énergétique", value: "+28%" },
    ],
    phases: [
      { title: "Étude ABF + dépôt permis", description: "Validation Architecte des Bâtiments de France du visuel façade.", duration: "4 sem." },
      { title: "Fabrication modules", description: "Profilés Schüco USC 65 thermolaqués, vitrage double argon.", duration: "5 sem." },
      { title: "Pose par niveau", description: "Nacelles motorisées, étanchéité provisoire, 2 étages/semaine.", duration: "5 sem." },
      { title: "Contrôles + livraison", description: "Essais étanchéité air/eau, contrôle ABF, réception.", duration: "1 sem." },
    ],
    specs: [
      { label: "Profilés", value: "Schüco USC 65 thermolaqué noir" },
      { label: "Vitrage", value: "6/16/4 argon faible émissif" },
      { label: "Uw (calcul)", value: "1.4 W/m².K" },
      { label: "Entrée principale", value: "Verre feuilleté 66.2 RC3" },
      { label: "Classement AEV", value: "A4/E9A/V(C)5" },
    ],
    standards: ["NF DTU 33.1", "EN 13830 (murs-rideaux)", "Avis ABF", "RE 2020"],
    testimonial: {
      quote:
        "Un chantier ABF à Paris, en site occupé, sans intrusion d'eau sur 5 semaines pluvieuses : IEF & CO a tenu tous ses engagements. Finitions très soignées.",
      author: "Maîtrise d'Ouvrage",
      role: "Opérateur immobilier",
    },
    seoTitle: "Façade vitrée tertiaire 480 m² Paris 9e — mur-rideau Schüco",
    seoDescription:
      "Case study façade mur-rideau 480 m² Paris : Schüco USC 65, Uw 1.4, validation ABF, +28% gain énergétique. Par IEF & CO.",
  },

  {
    slug: "portes-coupe-feu-erp-totalenergies",
    title: "Mise en conformité 28 portes coupe-feu ERP",
    category: "coupe-feu",
    client: "TotalEnergies",
    year: 2025,
    location: "Multi-sites IDF",
    description:
      "Audit + remplacement de 28 portes coupe-feu EI60 et EI120, conformité APAVE, PV d'essai fournis.",
    highlight: "28 portes",
    tagline:
      "28 portes coupe-feu remises en conformité sur 6 sites TotalEnergies — PV APAVE intégrés à chaque livraison.",
    challenge:
      "Audit APAVE préalable avait identifié 28 non-conformités sur 6 sites tertiaires TotalEnergies en Île-de-France : portes coupe-feu vieillissantes (ferme-portes HS, joints intumescents décollés, serrures grippées, certains compartimentages interrompus). Risque immédiat : avis défavorable commission de sécurité, fermeture administrative en cas de contrôle imprévu. Délai critique : 8 semaines avant le passage du bureau de contrôle de suivi.",
    solution:
      "Audit IEF & CO validant le périmètre APAVE + pré-commande des portes (Jansen Janisol pour EI 60, Novoferm NovoFire pour EI 120) dès réception du bon de commande. Planning de 6 semaines : 1 site par semaine, équipe de 2 techniciens + 1 responsable conformité. Chaque remplacement documenté (photos avant/après, PV pose, certificats matière). Tous les ferme-portes aux normes Dorma TS 93 EN 3-6 avec attestations. Joints intumescents d'origine constructeur (pas de génériques). Remise au client d'un dossier conformité complet par site.",
    result:
      "28 portes remplacées en 6 semaines (2 semaines d'avance). Audit APAVE de suivi passé sans réserves. Dossier conformité remis pour chaque site avec PV essais feu fabricant, certificats matière, attestations de pose. Le client a signé un contrat de maintenance Argent global sur l'ensemble du parc coupe-feu des 6 sites (~60 portes) pour garantir le maintien de la conformité dans le temps.",
    kpis: [
      { label: "Portes remplacées", value: "28" },
      { label: "Sites concernés", value: "6" },
      { label: "Délai livraison", value: "6 sem." },
      { label: "Audit APAVE", value: "0 réserves" },
    ],
    phases: [
      { title: "Audit pré-APAVE", description: "Vérification 28 portes identifiées par APAVE, photos, mesures.", duration: "1 sem." },
      { title: "Commande fabricants", description: "Portes Jansen EI 60 et Novoferm NovoFire EI 120 sur mesure.", duration: "3 sem." },
      { title: "Remplacements successifs", description: "2 techniciens dédiés, 4-5 portes/semaine, documentation photos.", duration: "6 sem." },
      { title: "Dossier conformité + APAVE", description: "Compilation PV, envoi client, audit de suivi APAVE.", duration: "2 sem." },
    ],
    specs: [
      { label: "Portes EI 60", value: "22× Jansen Janisol (acier)" },
      { label: "Portes EI 120", value: "6× Novoferm NovoFire" },
      { label: "Ferme-portes", value: "Dorma TS 93 EN 3-6" },
      { label: "Joints intumescents", value: "Origine constructeur — pas de génériques" },
      { label: "Serrures", value: "Multipoint coupe-feu certifié" },
    ],
    standards: ["EN 16034", "EN 1634-1 (essais feu)", "Arrêté 25/06/1980 (ERP)", "Arrêté 24/05/2010 (maintenance)"],
    testimonial: {
      quote:
        "Un dossier conformité impeccable, livré avant la date butoir APAVE. IEF & CO s'est occupé de tout, nous n'avons eu qu'à signer. Nous avons étendu le contrat à l'ensemble du parc.",
      author: "Facility Manager",
      role: "TotalEnergies France",
    },
    seoTitle: "Mise en conformité 28 portes coupe-feu EI60/EI120 — TotalEnergies",
    seoDescription:
      "Case study mise en conformité 28 portes coupe-feu ERP multi-sites TotalEnergies IDF : Jansen + Novoferm, audit APAVE 0 réserves. Par IEF & CO.",
  },

  {
    slug: "controle-acces-multi-sites-sncf",
    title: "Contrôle d'accès RFID 14 sites SNCF",
    category: "automatismes",
    client: "SNCF",
    year: 2024,
    location: "Réseau IDF",
    description:
      "Déploiement contrôle d'accès RFID sur 14 sites + interphonie vidéo + intégration GTB existante.",
    highlight: "14 sites",
    tagline:
      "Un déploiement RFID multi-sites intégré à la GTB SNCF — 14 sites standardisés en 12 semaines.",
    challenge:
      "SNCF souhaitait moderniser le contrôle d'accès de 14 sites d'exploitation (dépôts, centres de maintenance, bâtiments administratifs) en Île-de-France. Cahier des charges exigeant : standardisation complète (mêmes équipements partout), intégration à la GTB existante (supervision Schneider), compatibilité badge SNCF unique, supervision centralisée des accès, interphonie vidéo IP, et respect des protocoles sécurité ferroviaire.",
    solution:
      "Architecture retenue : centrales TIL Technologies (standards SNCF), lecteurs RFID SALTO compatibles avec le badge SNCF, interphones IP 2N LTE, caméras dôme Bosch. Pilotage centralisé via serveur Lenel OnGuard interfacé avec la GTB Schneider. Déploiement progressif par site (1 site/semaine), formation de 2 agents par site. Gestion de projet dédiée avec chef de projet IEF & CO unique interlocuteur côté SNCF. Tous les câblages en fibre optique monomode pour pérennité 25+ ans.",
    result:
      "14 sites déployés en 12 semaines (cadence tenue). 0 incident d'exploitation pendant le déploiement. Supervision centralisée fonctionnelle dès le 3e site. Intégration GTB validée par les équipes Schneider de SNCF. Maintenance préventive confiée à IEF & CO pour les 14 sites via contrat Argent (visite trimestrielle + dépannage sous 8h).",
    kpis: [
      { label: "Sites déployés", value: "14" },
      { label: "Lecteurs installés", value: "~65" },
      { label: "Délai total", value: "12 sem." },
      { label: "Incidents déploiement", value: "0" },
    ],
    phases: [
      { title: "Étude + sélection équipements", description: "Validation architecture TIL/SALTO/2N avec SNCF + GTB.", duration: "3 sem." },
      { title: "Préfabrication armoires", description: "Câblage + test des 14 armoires contrôle d'accès en atelier.", duration: "3 sem." },
      { title: "Déploiement sites", description: "1 site/semaine, pose + paramétrage + intégration GTB + formation.", duration: "12 sem." },
      { title: "Recette + transfert", description: "Tests de bout en bout, transfert exploitation équipe SNCF.", duration: "2 sem." },
    ],
    specs: [
      { label: "Centrales", value: "TIL Technologies Micro-SESAME" },
      { label: "Lecteurs", value: "SALTO Neo compatible badge SNCF" },
      { label: "Interphones", value: "2N LTE Verso" },
      { label: "Caméras", value: "Bosch FLEXIDOME IP 7000" },
      { label: "Supervision", value: "Lenel OnGuard + GTB Schneider" },
    ],
    standards: ["NF S61-933 (contrôle d'accès)", "Protocoles sécurité ferroviaire SNCF", "GDPR (traces accès)"],
    testimonial: {
      quote:
        "Un projet multi-sites complexe géré avec rigueur. IEF & CO a su s'adapter à nos contraintes ferroviaires et nos protocoles SNCF. Le déploiement en 12 semaines sans incident est une réussite.",
      author: "Responsable Sûreté IDF",
      role: "SNCF Immobilier",
    },
    seoTitle: "Contrôle d'accès RFID 14 sites SNCF IDF — intégration GTB",
    seoDescription:
      "Case study déploiement contrôle d'accès RFID + interphonie vidéo 14 sites SNCF IDF, intégration GTB Schneider, en 12 semaines. Par IEF & CO.",
  },
];

export function getRealisationBySlug(slug: string): Realisation | undefined {
  return realisations.find((r) => r.slug === slug);
}
