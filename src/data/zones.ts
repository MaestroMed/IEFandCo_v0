/**
 * Zones d'intervention IEF & CO — 8 départements Île-de-France.
 *
 * Chaque zone dispose d'une page SEO dédiée riche en contenu local pour
 * capter les requêtes "métallerie + zone" / "porte sectionnelle + ville" etc.
 */

export interface Zone {
  slug: string;
  /** Nom officiel ("Paris", "Hauts-de-Seine") */
  name: string;
  /** Code département (75, 92...) */
  code: string;
  /** Région englobante */
  region: string;
  /** Tagline éditoriale courte */
  tagline: string;
  /** Description longue (300-500 mots) — SEO content */
  intro: string;
  /** Villes principales desservies dans la zone */
  cities: string[];
  /** Délai d'intervention dépannage urgence */
  slaUrgence: string;
  /** Délai standard intervention */
  slaStandard: string;
  /** Centres d'activité économique majeurs (logistique, tertiaire, etc.) */
  hubs: string[];
  /** KPIs spécifiques à la zone */
  kpis: { value: string; label: string; sub?: string }[];
  /** Témoignage zone (idéalement client local) */
  testimonial?: { author: string; company: string; quote: string };
  /** FAQ spécifique zone */
  faq: { question: string; answer: string }[];
  /** Coordonnées GPS centre approximatif (pour future carte) */
  center: { lat: number; lng: number };
  /** SEO meta */
  seo: { title: string; description: string };
}

export const zones: Zone[] = [
  {
    slug: "paris",
    name: "Paris",
    code: "75",
    region: "Île-de-France",
    tagline: "Métallerie technique pour ERP, sièges sociaux et commerces",
    intro:
      "IEF & CO intervient sur l'ensemble des 20 arrondissements de Paris pour la conception, la fabrication et la maintenance d'ouvrages métalliques professionnels. Notre proximité avec la capitale (siège à Groslay, à 12 km de Paris) nous permet d'assurer un service réactif sur les sites tertiaires, ERP, commerces et sites logistiques intra-muros. Nos équipes sont rompues aux contraintes spécifiques de Paris : accès véhicules en zone à trafic limité, autorisations municipales, plages horaires de chantier nocturnes, copropriétés exigeantes. Que vous gériez un parc de portes sectionnelles dans un parking souterrain du 8e, des fermetures coupe-feu dans un immeuble haussmannien ou une charpente métallique pour une rénovation industrielle dans le 13e, nous apportons la rigueur technique et la traçabilité documentaire qui font la différence pour vos audits qualité et vos certifications ICPE.",
    cities: ["1er", "8e", "9e", "11e", "12e", "13e", "15e", "17e", "18e", "19e", "20e"],
    slaUrgence: "4h ouvrées",
    slaStandard: "24h ouvrées",
    hubs: ["La Défense (sièges)", "Bercy", "Les Halles", "Gare du Nord (logistique urbaine)", "Paris-Rive-Gauche"],
    kpis: [
      { value: "120+", label: "Interventions/an", sub: "Sur Paris intra-muros" },
      { value: "4h", label: "Délai urgence", sub: "Sur contrat" },
      { value: "12 km", label: "De notre atelier", sub: "À Notre-Dame" },
      { value: "20/20", label: "Arrondissements", sub: "Couverts" },
    ],
    testimonial: {
      author: "Mr Benjamin",
      company: "LAMY (Paris 8e)",
      quote: "Modernisation de notre parc en 3 mois sans interrompre l'activité. Réactivité exemplaire pour un site tertiaire en zone dense.",
    },
    faq: [
      { question: "Pouvez-vous intervenir en horaires décalés à Paris ?", answer: "Oui. Nous adaptons nos interventions aux contraintes parisiennes : nuit, week-end, plages horaires de copropriété. Un planning est validé avec votre gestionnaire avant chaque intervention." },
      { question: "Comment gérez-vous l'accès véhicules en zone ZTL ?", answer: "Nos véhicules d'intervention sont enregistrés au registre des véhicules professionnels autorisés. Pour les chantiers nécessitant un déchargement, nous sollicitons les autorisations municipales en amont." },
      { question: "Intervenez-vous dans les parkings souterrains parisiens ?", answer: "Oui — c'est même un de nos savoir-faire spécifiques. Hauteur sous-plafond contrainte, ventilation forcée, accès grues impossibles : nous adaptons les méthodes (levage manuel, sectionnement matière sur site)." },
      { question: "Quelle est la durée moyenne d'un dépannage à Paris ?", answer: "85% de nos interventions de dépannage à Paris sont résolues sous 4h grâce à notre stock de pièces détachées et à notre proximité atelier. Les pannes complexes (motorisation HS) peuvent nécessiter une seconde intervention sous 48h." },
    ],
    center: { lat: 48.8566, lng: 2.3522 },
    seo: {
      title: "Métallerie Serrurerie Paris (75) — IEF & CO",
      description: "Métallerie professionnelle à Paris : portes sectionnelles, rideaux métalliques, portails, charpente, coupe-feu, maintenance 24/7. Intervention 4h sur contrat dans les 20 arrondissements.",
    },
  },

  {
    slug: "val-d-oise",
    name: "Val-d'Oise",
    code: "95",
    region: "Île-de-France",
    tagline: "Notre département. Notre épicentre. Notre zone d'expertise.",
    intro:
      "IEF & CO est implanté à Groslay, au cœur du Val-d'Oise (95). C'est ici, dans notre atelier, que nous fabriquons l'ensemble de nos ouvrages métalliques avant pose sur site. Cette implantation locale fait du 95 notre zone d'intervention privilégiée : délai d'urgence sous 2h ouvrées, présence quotidienne sur les chantiers d'Argenteuil, Cergy, Pontoise, Sarcelles, Gonesse et Roissy. Le Val-d'Oise concentre certaines des plus grosses plateformes logistiques d'Île-de-France (zone Roissy-Charles de Gaulle, zone industrielle de Saint-Ouen-l'Aumône, parc d'activités de Cergy) — autant de clients pour lesquels nous opérons des contrats de maintenance préventive sur des centaines de portes sectionnelles, rideaux métalliques, portes coupe-feu et systèmes d'automatisme. Notre proximité géographique est le facteur #1 qui rassure nos clients du 95 : un dépannage est toujours possible le jour même.",
    cities: ["Groslay (siège)", "Argenteuil", "Cergy", "Pontoise", "Sarcelles", "Gonesse", "Roissy-en-France", "Saint-Ouen-l'Aumône", "Persan", "Beaumont-sur-Oise"],
    slaUrgence: "2h ouvrées",
    slaStandard: "Même jour",
    hubs: ["Roissy CDG (logistique)", "Cergy (tertiaire)", "Saint-Ouen-l'Aumône (industrie)", "Argenteuil (PME)"],
    kpis: [
      { value: "200+", label: "Interventions/an", sub: "Dans le 95" },
      { value: "2h", label: "Délai urgence", sub: "Sur contrat" },
      { value: "0 km", label: "De notre atelier", sub: "Siège Groslay" },
      { value: "85%", label: "Clients récurrents", sub: "Dans le 95" },
    ],
    testimonial: {
      author: "Direction logistique",
      company: "Plateforme Roissy (95)",
      quote: "12 portes sectionnelles maintenues sur 2 ans, 0 panne longue durée. Le contrat de maintenance IEF & CO est ce qui nous permet de garantir nos délais clients.",
    },
    faq: [
      { question: "Combien de temps pour intervenir à Cergy ou Pontoise ?", answer: "30 minutes en moyenne en heures ouvrées. Nous sommes implantés à Groslay, à 20 min de Cergy et 25 min de Pontoise par l'A15." },
      { question: "Avez-vous des techniciens dédiés au 95 ?", answer: "Oui, 4 techniciens basés à l'atelier de Groslay sont dédiés en priorité aux interventions du Val-d'Oise. Cette équipe connaît la majorité de nos parcs clients par cœur." },
      { question: "Intervenez-vous sur la zone aéroportuaire de Roissy CDG ?", answer: "Oui, plusieurs de nos clients opèrent des plateformes logistiques à Roissy. Nos techniciens sont habilités aux accès zone fret et zone côté piste sur autorisation badge prestataire." },
      { question: "Maintenance des portes coupe-feu en ERP du Val-d'Oise ?", answer: "Oui, nous assurons la maintenance préventive semestrielle des portes coupe-feu (EI 30 / EI 60 / EI 120) conformément à l'arrêté du 24 mai 2010. PV d'intervention remis à chaque visite." },
    ],
    center: { lat: 49.0083, lng: 2.3446 },
    seo: {
      title: "Métallerie Serrurerie Val-d'Oise (95) — IEF & CO Groslay",
      description: "Métallier expert dans le Val-d'Oise (95) : siège à Groslay. Portes sectionnelles, rideaux métalliques, portails, structures. Dépannage 2h sur Cergy, Pontoise, Argenteuil, Roissy.",
    },
  },

  {
    slug: "hauts-de-seine",
    name: "Hauts-de-Seine",
    code: "92",
    region: "Île-de-France",
    tagline: "La Défense, sièges sociaux et tertiaire premium",
    intro:
      "IEF & CO intervient quotidiennement dans les Hauts-de-Seine (92), avec une concentration forte autour de La Défense, Boulogne-Billancourt, Issy-les-Moulineaux, Levallois-Perret et Neuilly-sur-Seine. Le 92 est le poumon économique tertiaire de l'Île-de-France : sièges sociaux du CAC 40, tours de bureaux haussmanniennes, parkings souterrains de très grande capacité — autant d'environnements où la métallerie technique doit conjuguer fiabilité absolue, esthétique soignée et conformité ERP/IGH stricte. Notre expertise sur les portes coupe-feu IGH (Immeubles de Grande Hauteur), les barrières de parking automatiques pour flux haute fréquence, et les fermetures techniques de locaux serveurs / postes de transformation EDF nous a permis de conventionner avec plusieurs property managers majeurs du département.",
    cities: ["La Défense", "Boulogne-Billancourt", "Issy-les-Moulineaux", "Levallois-Perret", "Neuilly-sur-Seine", "Courbevoie", "Nanterre", "Asnières-sur-Seine", "Suresnes", "Rueil-Malmaison"],
    slaUrgence: "4h ouvrées",
    slaStandard: "24h ouvrées",
    hubs: ["La Défense (tours tertiaires)", "Issy-les-Moulineaux (tech / médias)", "Boulogne (sièges sociaux)", "Nanterre (administrations)"],
    kpis: [
      { value: "90+", label: "Interventions/an", sub: "Dans le 92" },
      { value: "4h", label: "Délai urgence", sub: "Sur contrat" },
      { value: "15 km", label: "De notre atelier", sub: "À La Défense" },
      { value: "IGH", label: "Conformité", sub: "Maîtrisée" },
    ],
    testimonial: {
      author: "Property Manager",
      company: "Tour tertiaire La Défense",
      quote: "Maintenance des 24 portes coupe-feu et des 6 rideaux métalliques de la tour. Audit annuel impeccable, zéro réserve sur 3 exercices.",
    },
    faq: [
      { question: "Êtes-vous habilités aux IGH (Immeubles de Grande Hauteur) ?", answer: "Oui. Nos techniciens sont formés aux protocoles d'intervention IGH : badge accès, déclaration au PCS, intervention en horaires définis, traçabilité des matériels entrants/sortants." },
      { question: "Maintenance des barrières de parking de La Défense ?", answer: "Oui, plusieurs parkings publics et privés du 92 sont sous contrat IEF & CO. Nous remplaçons les lisses, motorisations, boucles de détection et systèmes de comptage (Came, Faac, Bft, Nice)." },
      { question: "Intervenez-vous sur portes blindées de coffres / locaux sensibles ?", answer: "Oui. Nous installons et maintenons des portes blindées certifiées A2P pour locaux serveurs, archives sensibles, postes de transformation EDF. Documentation A2P remise à chaque pose." },
      { question: "Délai d'intervention pour un incident porte coupe-feu en IGH ?", answer: "4h ouvrées sous contrat. Une porte coupe-feu HS dans un IGH met le bâtiment en non-conformité — nous proposons une solution palliative immédiate (gardiennage, condamnation provisoire) puis réparation définitive sous 48h." },
    ],
    center: { lat: 48.8924, lng: 2.2156 },
    seo: {
      title: "Métallerie Hauts-de-Seine (92) — IEF & CO",
      description: "Métallier expert dans les Hauts-de-Seine (92) : La Défense, Boulogne, Issy, Levallois. Portes coupe-feu IGH, rideaux métalliques, barrières parking. Maintenance B2B avec SLA 4h.",
    },
  },

  {
    slug: "seine-saint-denis",
    name: "Seine-Saint-Denis",
    code: "93",
    region: "Île-de-France",
    tagline: "Logistique, e-commerce et grandes plateformes industrielles",
    intro:
      "Le département de Seine-Saint-Denis (93) est l'un des principaux hubs logistiques d'Île-de-France grâce à sa proximité avec Paris, ses axes autoroutiers (A1, A3, A86) et la zone aéroportuaire du Bourget. IEF & CO accompagne de nombreuses plateformes logistiques e-commerce, sites de messagerie, entrepôts agroalimentaires et data centers du 93 sur l'ensemble de leurs besoins en fermetures professionnelles. Nos contrats de maintenance dans le 93 portent typiquement sur des parcs de 10 à 50 portes sectionnelles industrielles, rideaux métalliques de quais, portes coupe-feu de cellules de stockage et systèmes d'automatisme de portails poids lourds. La densité d'usage (jusqu'à 4000 cycles/jour pour certaines portes rapides) impose une maintenance préventive rigoureuse — c'est précisément notre cœur de métier.",
    cities: ["Saint-Denis", "Aubervilliers", "Bobigny", "Pantin", "Le Bourget", "Drancy", "Stains", "Villepinte", "Tremblay-en-France", "Aulnay-sous-Bois"],
    slaUrgence: "3h ouvrées",
    slaStandard: "24h ouvrées",
    hubs: ["Le Bourget (aéronautique)", "Tremblay (logistique aéroport)", "Aubervilliers (entrepôts urbains)", "Aulnay (industrie auto)", "Villepinte (parc expositions)"],
    kpis: [
      { value: "150+", label: "Interventions/an", sub: "Dans le 93" },
      { value: "3h", label: "Délai urgence", sub: "Sur contrat" },
      { value: "12 km", label: "De notre atelier", sub: "À Saint-Denis" },
      { value: "4000+", label: "Cycles/jour", sub: "Capacité maintenue" },
    ],
    testimonial: {
      author: "Responsable site",
      company: "Entrepôt e-commerce Tremblay",
      quote: "Nos 28 portes sectionnelles tournent 18h/jour, 6 jours/7. Sans le contrat IEF & CO, on perdrait 2-3 jours d'activité par mois. Aujourd'hui, zéro arrêt non programmé en 18 mois.",
    },
    faq: [
      { question: "Maintenance portes rapides sur entrepôts e-commerce ?", answer: "Oui, c'est une de nos spécialités. Les portes rapides type Maviflex / Hörmann V 3015 / Crawford Combi nécessitent une maintenance trimestrielle quand elles dépassent 1500 cycles/jour. Nous proposons des contrats adaptés à cette fréquence." },
      { question: "Intervenez-vous au Bourget (zone aéroportuaire) ?", answer: "Oui, plusieurs hangars aéronautiques et bâtiments de fret du Bourget sont sous contrat IEF & CO. Nos techniciens disposent des habilitations aéroport requises." },
      { question: "Délai pour panne porte sectionnelle en heure de pointe logistique ?", answer: "3h sous contrat. Une porte de quai HS bloque parfois toute une activité (camions en attente). Nous priorisons absolument ces appels avec stock pièces détachées dédié aux marques principales." },
      { question: "Pouvez-vous gérer un parc de 50+ portes sur plusieurs sites 93 ?", answer: "Oui, nous gérons actuellement plusieurs parcs multi-sites dans le 93. Reporting trimestriel, GMAO numérique partagée, point mensuel avec votre responsable maintenance." },
    ],
    center: { lat: 48.9362, lng: 2.3574 },
    seo: {
      title: "Métallerie Seine-Saint-Denis (93) — Logistique & e-commerce",
      description: "Métallier expert dans le 93 : portes sectionnelles, rideaux métalliques, portes rapides pour plateformes logistiques. Le Bourget, Tremblay, Aubervilliers. Dépannage 3h.",
    },
  },

  {
    slug: "val-de-marne",
    name: "Val-de-Marne",
    code: "94",
    region: "Île-de-France",
    tagline: "Industrie, MIN de Rungis et tertiaire de l'est parisien",
    intro:
      "Le Val-de-Marne (94) est un département mixte : industrie historique (Vitry, Ivry, Choisy-le-Roi), tertiaire émergent (Créteil, Saint-Maur) et le poumon agroalimentaire francilien que constitue le Marché d'Intérêt National (MIN) de Rungis. IEF & CO opère dans le 94 sur des contrats de maintenance pour entrepôts frigorifiques (portes sectionnelles isothermes, rideaux à lanières PVC), sites industriels classés ICPE (portes coupe-feu, accès sécurisés), et établissements hospitaliers (CHU Henri Mondor, hôpital Bicêtre voisin). Nos solutions s'adaptent aux exigences sanitaires strictes du MIN de Rungis (matériaux inox alimentaire, joints conformes HACCP) ainsi qu'aux contraintes des hôpitaux (portes coupe-feu UX classées EI 60 / EI 120, motorisations bas-bruit).",
    cities: ["Créteil", "Vitry-sur-Seine", "Ivry-sur-Seine", "Saint-Maur-des-Fossés", "Champigny-sur-Marne", "Maisons-Alfort", "Choisy-le-Roi", "Rungis (MIN)", "Cachan", "Villejuif"],
    slaUrgence: "4h ouvrées",
    slaStandard: "24h ouvrées",
    hubs: ["MIN de Rungis (agroalimentaire)", "CHU Henri Mondor", "Vitry (industrie)", "Créteil (tertiaire)"],
    kpis: [
      { value: "80+", label: "Interventions/an", sub: "Dans le 94" },
      { value: "4h", label: "Délai urgence", sub: "Sur contrat" },
      { value: "HACCP", label: "Conformité", sub: "Inox alimentaire" },
      { value: "MIN", label: "Référencé", sub: "Rungis" },
    ],
    faq: [
      { question: "Travaillez-vous sur le MIN de Rungis ?", answer: "Oui, nous intervenons sur plusieurs pavillons du MIN. Nos prestations sont conformes aux exigences sanitaires HACCP : inox 304/316, joints alimentaires, traçabilité matériaux." },
      { question: "Portes isothermes pour chambres froides ?", answer: "Oui, nous installons et maintenons des portes isothermes (sectionnelles ou coulissantes) pour chambres froides positives et négatives, ainsi que les rideaux à lanières PVC pour zones tampons." },
      { question: "Intervention en milieu hospitalier ?", answer: "Oui, nous opérons sur plusieurs établissements hospitaliers du 94. Habilitations UV (zones de soin), respect des protocoles d'hygiène, intervention en horaires non perturbants." },
      { question: "Délai pour panne sur entrepôt frigorifique du 94 ?", answer: "4h sous contrat — la perte de chaîne du froid est critique, nos techniciens disposent du stock joint et motorisation des principales marques pour réparation au premier passage." },
    ],
    center: { lat: 48.7889, lng: 2.4528 },
    seo: {
      title: "Métallerie Val-de-Marne (94) — IEF & CO",
      description: "Métallier expert dans le 94 : MIN Rungis, hôpitaux, sites industriels. Portes isothermes, coupe-feu hospitalier, rideaux. Conformité HACCP. Dépannage 4h.",
    },
  },

  {
    slug: "yvelines",
    name: "Yvelines",
    code: "78",
    region: "Île-de-France",
    tagline: "Sites industriels (Renault, PSA), tertiaire de Saint-Quentin-en-Yvelines",
    intro:
      "Les Yvelines (78) accueillent certains des plus grands sites industriels d'Île-de-France : usines Renault de Flins et Guyancourt, sites PSA, sites Stellantis, technocentre Renault de Guyancourt — autant d'environnements industriels où la maintenance des fermetures est critique pour la continuité de production. IEF & CO intervient également dans le tertiaire de Saint-Quentin-en-Yvelines (sièges sociaux, cabinets d'études, parcs d'activités) ainsi que sur les bâtiments patrimoniaux versaillais où la métallerie sur mesure (grilles d'époque, ferronnerie restauratée) demande un savoir-faire artisanal poussé. Notre maillage 78 couvre l'ensemble des grands axes (A12, A13, N10) avec des temps d'intervention adaptés à la dispersion géographique du département.",
    cities: ["Versailles", "Saint-Quentin-en-Yvelines", "Vélizy-Villacoublay", "Guyancourt", "Mantes-la-Jolie", "Poissy", "Sartrouville", "Conflans-Sainte-Honorine", "Houilles", "Le Vésinet"],
    slaUrgence: "5h ouvrées",
    slaStandard: "48h ouvrées",
    hubs: ["Saint-Quentin-en-Yvelines (tertiaire/tech)", "Flins (Renault)", "Guyancourt (R&D)", "Poissy (PSA/Stellantis)", "Versailles (patrimoine)"],
    kpis: [
      { value: "60+", label: "Interventions/an", sub: "Dans le 78" },
      { value: "5h", label: "Délai urgence", sub: "Sur contrat" },
      { value: "Auto", label: "Industrie", sub: "Maîtrisée" },
      { value: "ABF", label: "Patrimoine", sub: "Compatible" },
    ],
    faq: [
      { question: "Travaillez-vous pour les sites automobiles du 78 ?", answer: "Oui, plusieurs sites Renault, PSA et Stellantis du département sont nos clients. Maintenance de portes sectionnelles d'atelier, rideaux logistiques, portes coupe-feu R+M2." },
      { question: "Restauration de ferronnerie d'époque à Versailles ?", answer: "Oui, nous opérons sur des bâtiments patrimoniaux protégés. Nos restaurations sont compatibles ABF (Architecte des Bâtiments de France) — devis et plans soumis aux services concernés." },
      { question: "Délai dépannage sur un site éloigné comme Mantes-la-Jolie ?", answer: "5h sous contrat. Mantes est à 50 minutes de notre atelier — pour les sites les plus éloignés du 78 ouest, nous proposons des contrats premium avec technicien itinérant zone." },
      { question: "Maintenance portes coupe-feu en site classé Seveso ?", answer: "Oui. Nous travaillons selon les protocoles ATEX (zones explosives) et Seveso. Nos techniciens disposent des habilitations N2 et N3 requises." },
    ],
    center: { lat: 48.8014, lng: 2.1301 },
    seo: {
      title: "Métallerie Yvelines (78) — IEF & CO",
      description: "Métallier expert dans les Yvelines (78) : sites industriels, tertiaire Saint-Quentin, patrimoine Versailles. Maintenance portes industrielles, ferronnerie ABF.",
    },
  },

  {
    slug: "seine-et-marne",
    name: "Seine-et-Marne",
    code: "77",
    region: "Île-de-France",
    tagline: "Plateformes logistiques de Marne-la-Vallée, Disneyland, sites industriels",
    intro:
      "La Seine-et-Marne (77) est le plus vaste département d'Île-de-France et concentre certaines des plus grosses plateformes logistiques d'Europe : zones logistiques de Sénart, Marne-la-Vallée, Bussy-Saint-Georges, Le Mée-sur-Seine. IEF & CO accompagne ces plateformes sur leurs besoins en fermetures industrielles haute fréquence (portes sectionnelles, rideaux métalliques, portes rapides souples) ainsi que les sites du complexe Disneyland Paris pour leur maintenance back-office. Le 77 demande une logistique d'intervention rigoureuse étant donné l'éloignement (Provins est à 90 km de notre atelier) — nous opérons par tournées planifiées hebdomadaires complétées par des interventions urgentes au cas par cas.",
    cities: ["Meaux", "Melun", "Chelles", "Pontault-Combault", "Bussy-Saint-Georges", "Marne-la-Vallée", "Sénart", "Provins", "Coulommiers", "Lagny-sur-Marne"],
    slaUrgence: "6h ouvrées",
    slaStandard: "48h ouvrées",
    hubs: ["Sénart (logistique)", "Marne-la-Vallée (Disney + logistique)", "Bussy-Saint-Georges (e-commerce)", "Meaux (industrie agro)", "Melun (administration)"],
    kpis: [
      { value: "70+", label: "Interventions/an", sub: "Dans le 77" },
      { value: "6h", label: "Délai urgence", sub: "Sur contrat" },
      { value: "70 km", label: "De notre atelier", sub: "Atteinte ouest 77" },
      { value: "XXL", label: "Plateformes", sub: "Maîtrisées" },
    ],
    faq: [
      { question: "Intervenez-vous sur les plateformes XXL de Sénart ?", answer: "Oui, plusieurs entrepôts XXL (>50 000 m²) du grand Sénart sont nos clients. Maintenance préventive trimestrielle, dépannage 6h sous contrat." },
      { question: "Présence dans le secteur Disneyland Paris ?", answer: "Oui, nous opérons sur des sites back-office du complexe Marne-la-Vallée (entrepôts, ateliers, parkings techniques)." },
      { question: "Comment gérez-vous les sites éloignés type Provins ?", answer: "Pour les zones les plus éloignées (>60 km), nous proposons des tournées hebdomadaires planifiées le mardi ou jeudi. Les urgences sont traitées en intervention dédiée avec délai de route adapté." },
      { question: "Avez-vous des techniciens dédiés au 77 ?", answer: "2 techniciens IEF & CO sont mobilisés en priorité sur les contrats du 77, avec véhicule équipé pour intervention longue distance et stock pièces détachées étendu." },
    ],
    center: { lat: 48.6075, lng: 2.8326 },
    seo: {
      title: "Métallerie Seine-et-Marne (77) — IEF & CO",
      description: "Métallier dans le 77 : plateformes XXL Sénart, Marne-la-Vallée, Bussy. Maintenance portes sectionnelles industrielles, rideaux métalliques. Dépannage 6h.",
    },
  },

  {
    slug: "essonne",
    name: "Essonne",
    code: "91",
    region: "Île-de-France",
    tagline: "Plateau de Saclay, parcs d'activités et zones industrielles sud-IDF",
    intro:
      "L'Essonne (91) abrite le plateau scientifique de Saclay (Université Paris-Saclay, CEA, École Polytechnique, sites industriels high-tech), les plateformes logistiques d'Évry-Courcouronnes et de Massy, ainsi que de nombreuses PME industrielles dispersées dans les communes de Corbeil-Essonnes, Brétigny et Étampes. IEF & CO intervient dans le 91 pour des projets allant de la fabrication de structures sur mesure pour des laboratoires de recherche (sas inox, accès classés) à la maintenance préventive de parcs de portes industrielles pour des entrepôts e-commerce du sud francilien. Notre couverture du 91 s'appuie sur les axes A6 et N7, avec une présence régulière sur Massy / Palaiseau (zone Saclay) et Évry / Corbeil (zone industrielle).",
    cities: ["Évry-Courcouronnes", "Massy", "Palaiseau", "Corbeil-Essonnes", "Brétigny-sur-Orge", "Sainte-Geneviève-des-Bois", "Étampes", "Savigny-sur-Orge", "Athis-Mons", "Yerres"],
    slaUrgence: "5h ouvrées",
    slaStandard: "48h ouvrées",
    hubs: ["Saclay (recherche / industrie)", "Évry (tertiaire)", "Massy (transports / logistique)", "Corbeil-Essonnes (industrie historique)"],
    kpis: [
      { value: "55+", label: "Interventions/an", sub: "Dans le 91" },
      { value: "5h", label: "Délai urgence", sub: "Sur contrat" },
      { value: "Sas", label: "Recherche", sub: "Inox spécifique" },
      { value: "Saclay", label: "Référencé", sub: "Plateau" },
    ],
    faq: [
      { question: "Sas et accès classés pour laboratoires Saclay ?", answer: "Oui, nous fabriquons des sas inox sur mesure pour environnements ISO 5/6/7 (salles blanches), avec joints d'étanchéité spécifiques et systèmes d'asservissement double porte." },
      { question: "Maintenance porte industrielle à Évry ?", answer: "Oui, plusieurs entrepôts e-commerce et sites de messagerie d'Évry-Courcouronnes sont sous contrat IEF & CO. Délai 5h en urgence, maintenance préventive semestrielle." },
      { question: "Travaillez-vous pour les sites du CEA ?", answer: "Nous avons réalisé des prestations ponctuelles sur des sites scientifiques — chaque mission est soumise aux protocoles sécurité et habilitations spécifiques du site." },
      { question: "Comment intervenez-vous à Étampes (sud-91) ?", answer: "Étampes est à 70 km de notre atelier. Pour les contrats récurrents dans cette zone, nous planifions des passages hebdomadaires fixes complétés par des interventions urgentes dédiées." },
    ],
    center: { lat: 48.5611, lng: 2.4434 },
    seo: {
      title: "Métallerie Essonne (91) — Saclay & sud-IDF",
      description: "Métallier dans l'Essonne (91) : plateau Saclay, Évry, Massy, Corbeil. Maintenance portes industrielles, sas laboratoires, structures sur mesure. Dépannage 5h.",
    },
  },
];

export function getZoneBySlug(slug: string): Zone | undefined {
  return zones.find((z) => z.slug === slug);
}
