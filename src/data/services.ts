export interface SubService {
  title: string;
  description: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;
  shortDescription: string;
  accentColor: string; // unique gradient color per service
  fullDescription: string;
  icon: string;
  subServices: SubService[];
  faq: FAQ[];
  relatedSlugs: string[];
  seo: {
    title: string;
    description: string;
  };
  /** BO-uploaded cover (image or video). Falls back to photoMap.ts if absent. */
  coverUrl?: string;
  coverMime?: string;
  coverAlt?: string;
}

export const services: Service[] = [
  {
    slug: "fermetures-industrielles",
    title: "Fermetures & Portes Industrielles",
    shortTitle: "Industrielles",
    accentColor: "59, 130, 180",  // steel blue
    shortDescription:
      "Rideaux métalliques, portes sectionnelles, portes rapides, portes blindées. Robustesse, sécurité et performance pour vos accès industriels.",
    fullDescription:
      "IEF & CO conçoit, fabrique et installe des fermetures industrielles sur mesure pour tous types de bâtiments : entrepôts, usines, sites logistiques, commerces. Nos solutions répondent aux exigences de sécurité, d'isolation et de performance opérationnelle les plus strictes.",
    icon: "factory",
    subServices: [
      { title: "Rideaux métalliques", description: "Acier, aluminium, lames pleines ou micro-perforées. Motorisés ou manuels, adaptés à votre usage." },
      { title: "Portes sectionnelles", description: "Isolation thermique et acoustique, motorisation intégrée, hublots optionnels. Pour quais, ateliers et garages." },
      { title: "Portes à enroulement rapide", description: "Ouverture haute vitesse pour flux logistiques intenses. Souples ou rigides, jusqu'à 4000 cycles/jour." },
      { title: "Portes blindées", description: "Protection anti-intrusion renforcée pour sites sensibles. Certifiées selon les normes en vigueur." },
      { title: "Volets techniques", description: "Protection extérieure, ventilation, occultation. Sur mesure en acier ou aluminium." },
      { title: "Trappes techniques", description: "Accès sécurisés aux locaux techniques, gaines et vides sanitaires." },
    ],
    faq: [
      { question: "Quelle est la durée de vie d'une porte sectionnelle industrielle ?", answer: "Avec un entretien régulier, une porte sectionnelle industrielle de qualité a une durée de vie de 15 à 25 ans, soit environ 20 000 à 50 000 cycles selon le modèle et l'intensité d'utilisation." },
      { question: "La maintenance est-elle obligatoire ?", answer: "Oui. L'arrêté du 21 décembre 1993 impose un entretien semestriel de toutes les portes automatiques et semi-automatiques sur les lieux de travail." },
      { question: "Intervenez-vous en urgence ?", answer: "Oui. Notre service de dépannage intervient en moins de 24h ouvrées en Île-de-France, 7j/7 sur demande." },
      { question: "Posez-vous des fermetures sur des bâtiments existants ?", answer: "Oui, nous intervenons aussi bien en neuf qu'en rénovation. Un relevé sur site est effectué pour adapter la solution au bâti existant." },
      { question: "Quelles normes respectez-vous ?", answer: "Nos fermetures sont conformes à la norme EN 13241-1, à l'arrêté du 21/12/1993, et au marquage CE. Les portes coupe-feu répondent également à la norme EN 16034." },
    ],
    relatedSlugs: ["automatismes", "maintenance", "portes-coupe-feu"],
    seo: {
      title: "Fermetures & Portes Industrielles | Rideaux Métalliques, Portes Sectionnelles",
      description: "Installation et maintenance de fermetures industrielles en Île-de-France : rideaux métalliques, portes sectionnelles, portes rapides. Dépannage 24h. Devis gratuit.",
    },
  },
  {
    slug: "portails-clotures",
    title: "Portails & Accès Véhicules",
    shortTitle: "Portails",
    accentColor: "166, 124, 82",  // warm earth
    shortDescription:
      "Portails coulissants, battants, autoportés, barrières levantes. Sécurité, automatisation et contrôle d'accès pour vos sites.",
    fullDescription:
      "IEF & CO conçoit et installe des portails et systèmes d'accès véhicules pour sites industriels, tertiaires et résidentiels. Chaque installation est dimensionnée selon les contraintes du site : charge, vent, fréquence d'utilisation, sécurité.",
    icon: "gate",
    subServices: [
      { title: "Portail coulissant", description: "Sur rail ou autoportant, motorisé, jusqu'à 12m d'ouverture. Idéal pour les accès poids lourds." },
      { title: "Portail battant", description: "1 ou 2 vantaux, acier ou aluminium, motorisation enterrée ou à bras." },
      { title: "Portail autoportant", description: "Sans rail au sol, idéal pour les sites où le sol ne peut être modifié." },
      { title: "Barrières levantes", description: "Contrôle d'accès véhicules, gestion de parking, péage automatique." },
      { title: "Bornes anti-bélier", description: "Protection périmétrique haute sécurité contre les intrusions véhiculaires." },
      { title: "Clôtures & grillages", description: "Périmétrie complète : panneaux rigides, concertina, détection périmétrique." },
    ],
    faq: [
      { question: "Quelle ouverture maximale pour un portail coulissant ?", answer: "Nos portails coulissants peuvent atteindre 12 mètres d'ouverture, voire plus sur étude spécifique. Les modèles autoportants atteignent généralement 8 à 10 mètres." },
      { question: "Peut-on motoriser un portail existant ?", answer: "Oui, après une étude de compatibilité (poids, dimensions, état de la structure). Nous installons des motorisations électriques ou solaires adaptées." },
      { question: "Quels systèmes de contrôle d'accès proposez-vous ?", answer: "Badge RFID, clavier à code, interphonie vidéo, télécommande, commande GSM/Wi-Fi, lecteur de plaques. Solutions compatibles domotique." },
      { question: "Les portails resistent-ils au vent ?", answer: "Nos portails sont dimensionnés selon la norme EN 12424 (classement vent). Le choix du modèle dépend de l'exposition du site." },
      { question: "Proposez-vous un contrat de maintenance ?", answer: "Oui. Contrats préventifs semestriels ou annuels, dépannage curatif, pièces et main d'œuvre incluses selon la formule choisie." },
    ],
    relatedSlugs: ["automatismes", "fermetures-industrielles", "maintenance"],
    seo: {
      title: "Portails & Accès Véhicules | Coulissants, Battants, Barrières",
      description: "Installation de portails coulissants, battants et barrières levantes en Île-de-France. Motorisation, contrôle d'accès, dépannage. IEF & CO, expert depuis 2020.",
    },
  },
  {
    slug: "structures-metalliques",
    title: "Métallerie & Structures Sur Mesure",
    shortTitle: "Structures",
    accentColor: "160, 170, 180",  // cool chrome
    shortDescription:
      "Charpentes, mezzanines, passerelles, escaliers, garde-corps. Solidité, ingénierie et performance certifiée EN 1090.",
    fullDescription:
      "Notre bureau d'étude conçoit des structures métalliques conformes à l'Eurocode 3 et certifiées EN 1090. De la modélisation 3D à la pose, nous réalisons charpentes, mezzanines, escaliers et ouvrages spéciaux pour l'industrie, le tertiaire et l'architecture.",
    icon: "building",
    subServices: [
      { title: "Garde-corps & mains courantes", description: "Acier, inox, aluminium. Conformes NF P01-012. Sur mesure et finitions soignées." },
      { title: "Mezzanines & passerelles", description: "Plateformes de stockage, passerelles de circulation, planchers techniques. Calcul de charge inclus." },
      { title: "Charpentes & ossatures acier", description: "Structures porteuses pour bâtiments industriels, agricoles, tertiaires. Fabrication atelier + pose grue." },
      { title: "Escaliers métalliques", description: "Droits, hélicoïdal, à quartier tournant. Acier, inox ou mixte acier-bois." },
      { title: "Marquises & auvents", description: "Protection des entrées, quais de chargement. Structure acier + couverture vitrée ou bac acier." },
      { title: "Locaux techniques", description: "Cages grillagées, cloisons modulaires, supports d'équipements techniques." },
    ],
    faq: [
      { question: "Qu'est-ce que la certification EN 1090 ?", answer: "La norme EN 1090 certifie la capacité d'une entreprise à fabriquer et monter des structures métalliques porteuses. IEF & CO est certifié pour la fabrication d'éléments structurels en acier." },
      { question: "Réalisez-vous les plans d'exécution ?", answer: "Oui. Notre bureau d'étude réalise les plans d'exécution, notes de calcul selon Eurocode 3, et modélisation 3D pour chaque projet." },
      { question: "Quels traitements de surface proposez-vous ?", answer: "Galvanisation à chaud, thermolaquage (large choix RAL), métallisation, inox brossé ou poli. Le traitement est choisi selon l'environnement et l'usage." },
      { question: "Intervenez-vous en hauteur ?", answer: "Oui. Nos équipes sont formées au travail en hauteur (port du harnais, échafaudage, nacelle). Nous coordonnons le levage et la sécurité sur chantier." },
      { question: "Quel est le délai pour une structure sur mesure ?", answer: "Comptez 1 à 2 semaines d'étude, 3 à 6 semaines de fabrication, et 1 à 10 jours de pose selon la complexité de l'ouvrage." },
    ],
    relatedSlugs: ["menuiserie-vitrerie", "fermetures-industrielles", "portes-coupe-feu"],
    seo: {
      title: "Structures Métalliques Sur Mesure | Charpentes, Mezzanines, Garde-corps",
      description: "Fabrication et pose de structures métalliques en Île-de-France. Certification EN 1090, Eurocode 3. Charpentes, mezzanines, escaliers. Devis gratuit.",
    },
  },
  {
    slug: "menuiserie-vitrerie",
    title: "Menuiserie Acier, Aluminium & Vitrerie",
    shortTitle: "Menuiserie",
    accentColor: "100, 180, 200",  // glass/sky
    shortDescription:
      "Façades vitrées, verrières, cloisons, fenêtres alu/acier. Design, résistance et confort lumineux sur mesure.",
    fullDescription:
      "IEF & CO conçoit et installe des menuiseries métalliques et vitreries pour façades, cloisons intérieures et ouvertures. Nos solutions allient performance thermique, esthétique et durabilité, en acier ou aluminium selon le projet.",
    icon: "window",
    subServices: [
      { title: "Façades & vitrines", description: "Murs-rideaux, façades semi-structurelles, vitrines commerciales. Aluminium ou acier." },
      { title: "Verrières", description: "Verrières de toit, verrières intérieures, puits de lumière. Structure acier + vitrage sécurisé." },
      { title: "Cloisons vitrées", description: "Séparation d'espaces, cloisons amovibles, parois de bureau. Aluminium + vitrage acoustique." },
      { title: "Châssis & fenêtres", description: "Fenêtres acier ou aluminium, ouvrants ou fixes, simple ou double vitrage." },
      { title: "Portes & portillons", description: "Portes d'entrée, portillons de service, issues de secours vitrées." },
      { title: "Auvents vitrés", description: "Marquises en verre trempé ou feuilleté, structure acier ou aluminium." },
    ],
    faq: [
      { question: "Acier ou aluminium pour mes menuiseries ?", answer: "L'acier offre des profils plus fins et une esthétique industrielle. L'aluminium est plus léger, ne rouille pas et offre de meilleures performances thermiques. Le choix dépend de l'usage et du style souhaité." },
      { question: "Quelles performances d'isolation ?", answer: "Nos menuiseries aluminium à rupture de pont thermique atteignent un coefficient Uw de 1,4 à 2,0 W/m2.K selon le vitrage. Les menuiseries acier sont plus adaptées aux séparations intérieures." },
      { question: "Posez-vous des vitrages sécurisés ?", answer: "Oui : verre trempé, feuilleté, anti-effraction (classes P1A à P8B), pare-balles (BR1 à BR7) selon les besoins." },
      { question: "Réalisez-vous des façades complètes ?", answer: "Oui. De l'étude thermique à la pose, nous réalisons des façades neuves ou en rénovation : murs-rideaux, VEC, VEA, façades semi-structurelles." },
      { question: "Quel entretien pour les menuiseries aluminium ?", answer: "Un nettoyage annuel à l'eau savonneuse suffit. Le thermolaquage résiste aux UV et aux intempéries pendant 20 à 30 ans." },
    ],
    relatedSlugs: ["structures-metalliques", "portes-coupe-feu", "fermetures-industrielles"],
    seo: {
      title: "Menuiserie Acier & Aluminium, Vitrerie | Façades, Verrières, Cloisons",
      description: "Menuiserie métallique et vitrerie en Île-de-France. Façades vitrées, verrières, cloisons aluminium. Conception, fabrication et pose sur mesure. IEF & CO.",
    },
  },
  {
    slug: "portes-coupe-feu",
    title: "Portes Coupe-Feu & Sécurité Incendie",
    shortTitle: "Coupe-feu",
    accentColor: "200, 120, 50",  // fire/amber
    shortDescription:
      "Blocs-portes CF 1h/2h, clapets coupe-feu, rideaux coupe-feu. Protection, résistance et conformité ERP.",
    fullDescription:
      "IEF & CO fournit et installe des portes coupe-feu et dispositifs de compartimentage conformes aux réglementations ERP et Code du travail. Chaque installation est certifiée, testée et documentée pour faciliter vos contrôles APAVE/DEKRA.",
    icon: "flame",
    subServices: [
      { title: "Portes coupe-feu EI30/60/120", description: "Blocs-portes battants ou coulissants, simple ou double vantail. Fermeture automatique sur alarme incendie." },
      { title: "Trappes coupe-feu", description: "Accès techniques avec résistance au feu. Pour gaines, faux-plafonds et planchers techniques." },
      { title: "Rideaux coupe-feu", description: "Compartimentage de grandes surfaces (atriums, halls, galeries). Déploiement automatique sur alarme." },
      { title: "Cloisons pare-flamme", description: "Séparation coupe-feu pour locaux à risque. Acier ou placo-plâtre renforcé." },
      { title: "Vitrages pare-feu", description: "Vitrages EI30 à EI120 pour cloisons et portes. Transparence et protection incendie." },
      { title: "Renforts anti-effraction", description: "Portes et rideaux anti-intrusion pour sites sensibles. Certification selon EN 1627." },
    ],
    faq: [
      { question: "Que signifie EI30, EI60, EI120 ?", answer: "EI indique l'étanchéité (E) et l'isolation thermique (I) au feu. Le chiffre indique la durée de résistance en minutes : EI60 = 60 minutes de protection." },
      { question: "Le contrôle APAVE est-il obligatoire ?", answer: "Pour les ERP (Établissements Recevant du Public), oui. Un contrôle annuel par un organisme agréé (APAVE, DEKRA, SOCOTEC) est obligatoire pour les portes coupe-feu." },
      { question: "Assurez-vous la mise en conformité ?", answer: "Oui. Nous auditons vos installations, identifions les non-conformités et proposons les solutions adaptées : remplacement, remise en état ou complément d'équipement." },
      { question: "Vos portes coupe-feu sont-elles certifiées ?", answer: "Oui. Toutes nos portes coupe-feu sont certifiées selon EN 1634-1 (résistance au feu) et EN 16034 (marquage CE). PV d'essai fournis." },
      { question: "Peut-on motoriser une porte coupe-feu ?", answer: "Oui, avec un système de fermeture automatique asservie à la détection incendie. La porte se ferme automatiquement sur alarme et peut être réarmée manuellement." },
    ],
    relatedSlugs: ["fermetures-industrielles", "maintenance", "menuiserie-vitrerie"],
    seo: {
      title: "Portes Coupe-Feu | EI30, EI60, EI120 | Sécurité Incendie ERP",
      description: "Installation et maintenance de portes coupe-feu en Île-de-France. Conformité ERP, certification EN 16034, contrôles APAVE. Devis gratuit. IEF & CO.",
    },
  },
  {
    slug: "automatismes",
    title: "Automatismes & Contrôle d'Accès",
    shortTitle: "Automatismes",
    accentColor: "80, 120, 220",  // electric blue
    shortDescription:
      "Motorisation portes/portails, commandes radio/Wi-Fi/GSM, domotique, interphonie vidéo, contrôle d'accès RFID.",
    fullDescription:
      "IEF & CO installe et maintient des systèmes d'automatisation pour portes, portails et accès : motorisation, contrôle d'accès, interphonie, domotique. Nos solutions combinent confort d'utilisation, sécurité et compatibilité avec vos systèmes existants.",
    icon: "cpu",
    subServices: [
      { title: "Motorisation portails", description: "Moteurs à bras, enterrés, coulissants. Électrique ou solaire. Toutes marques : Somfy, Came, FAAC, Nice." },
      { title: "Motorisation rideaux & portes", description: "Moteurs tubulaires, centraux, latéraux. Adaptation sur fermetures existantes ou neuves." },
      { title: "Contrôle d'accès RFID", description: "Badges, cartes, téléphones NFC. Gestion multi-sites, historique des accès, intégration GTB." },
      { title: "Interphonie & vidéophonie", description: "Platines extérieures, écrans intérieurs, connexion smartphone. Audio ou vidéo, filaire ou IP." },
      { title: "Barrières automatiques", description: "Gestion de parkings, péages, contrôle de flux véhicules. Intégration lecteur de plaques." },
      { title: "Domotique & commande à distance", description: "Commande Wi-Fi, GSM, application smartphone. Scénarios automatisés, horaires programmés." },
    ],
    faq: [
      { question: "Peut-on motoriser un portail ou rideau existant ?", answer: "Oui, après une étude de compatibilité (poids, dimensions, état). Nous installons la motorisation la plus adaptée à votre équipement existant." },
      { question: "Motorisation électrique ou solaire ?", answer: "Le solaire est idéal pour les sites sans alimentation électrique à proximité. Il fonctionne avec un panneau et une batterie, avec une autonomie de plusieurs jours sans soleil." },
      { question: "Les automatismes sont-ils compatibles domotique ?", answer: "Oui. Nos installations sont compatibles avec les protocoles courants (Somfy io, Z-Wave, Wi-Fi, KNX) et peuvent être pilotées via smartphone ou assistant vocal." },
      { question: "Quelle sécurité pour les portes automatiques ?", answer: "Cellules photoélectriques, bords sensibles, feux clignotants, arrêts d'urgence. Conformité à la directive Machines 2006/42/CE et à la norme EN 16005." },
      { question: "Proposez-vous la télécommande multi-accès ?", answer: "Oui. Une seule télécommande peut piloter portail, garage, éclairage et volets. Nous programmons l'ensemble pour un fonctionnement unifié." },
    ],
    relatedSlugs: ["portails-clotures", "fermetures-industrielles", "maintenance"],
    seo: {
      title: "Automatismes & Contrôle d'Accès | Motorisation, RFID, Interphonie",
      description: "Installation d'automatismes et contrôle d'accès en Île-de-France. Motorisation portails/portes, RFID, interphonie vidéo, domotique. IEF & CO.",
    },
  },
  {
    slug: "maintenance",
    title: "Maintenance & Dépannage 24/7",
    shortTitle: "Maintenance",
    accentColor: "60, 170, 140",  // teal/reliable
    shortDescription:
      "Contrats préventifs, dépannage urgence < 24h, maintenance multi-sites, toutes marques. Continuité, fiabilité, réactivité.",
    fullDescription:
      "IEF & CO assure la maintenance préventive et curative de toutes vos fermetures et équipements d'accès. Contrats sur mesure, dépannage rapide, intervention toutes marques. Notre service ASSISTEO permet le diagnostic à distance pour réduire les temps d'arrêt.",
    icon: "wrench",
    subServices: [
      { title: "ASSISTEO — Diagnostic vidéo", description: "Assistance vidéo à distance pour un diagnostic immédiat sans déplacement. Réduction des temps d'arrêt et meilleure préparation des interventions." },
      { title: "Maintenance préventive", description: "Visites semestrielles ou trimestrielles, conformes à l'arrêté du 21/12/1993. Checklist complète, PV d'intervention, carnet d'entretien." },
      { title: "Dépannage urgence", description: "Intervention en moins de 24h ouvrées en Île-de-France. Astreinte disponible 7j/7 sur contrat." },
      { title: "Maintenance multi-sites", description: "Un seul interlocuteur pour tous vos sites. Planning coordonné, reporting centralisé, facturation groupée." },
      { title: "Remplacement d'organes", description: "Ressorts, câbles, moteurs, cellules, télécommandes. Pièces d'origine ou équivalentes, toutes marques." },
      { title: "Contrats sur mesure", description: "Préventif seul, préventif + curatif, full service (pièces incluses). SLA 4h, 8h ou 24h selon vos besoins." },
    ],
    faq: [
      { question: "La maintenance semestrielle est-elle obligatoire ?", answer: "Oui. L'arrêté du 21 décembre 1993 impose une maintenance semestrielle pour toutes les portes automatiques et semi-automatiques. Le non-respect engage la responsabilité du propriétaire." },
      { question: "Intervenez-vous sur toutes les marques ?", answer: "Oui. Nos techniciens sont formés sur les principales marques : Hormann, Novoferm, Crawford, Somfy, Came, FAAC, Nice, Record, ASSA ABLOY, Marantec, etc." },
      { question: "Qu'est-ce que le service ASSISTEO ?", answer: "ASSISTEO est notre service exclusif de diagnostic vidéo à distance. Vous filmez la panne avec votre smartphone, notre technicien analyse en temps réel et prépare l'intervention. Cela réduit les temps d'arrêt et les déplacements inutiles." },
      { question: "Quels types de contrats proposez-vous ?", answer: "Trois formules : Préventif (visites planifiées), Préventif + Curatif (visites + dépannage), Full Service (tout inclus, pièces et main d'œuvre). Chaque contrat est adapté à votre parc d'équipements." },
      { question: "Fournissez-vous un carnet d'entretien ?", answer: "Oui. Chaque équipement dispose d'un carnet d'entretien digital avec l'historique complet des interventions, PV, photos et préconisations. Consultable en ligne." },
      { question: "Quel est le délai d'intervention en urgence ?", answer: "Moins de 24 heures ouvrées en Île-de-France. Astreinte 7j/7 disponible sur contrat pour les urgences critiques (arrêt de production, sécurité)." },
      { question: "Combien coûte un contrat de maintenance ?", answer: "Le tarif dépend du nombre d'équipements, de la formule choisie et de la fréquence des visites. Contactez-nous pour un devis personnalisé gratuit." },
    ],
    relatedSlugs: ["fermetures-industrielles", "automatismes", "portails-clotures"],
    seo: {
      title: "Maintenance & Dépannage Portes Industrielles | 24/7 | Toutes Marques",
      description: "Maintenance et dépannage de fermetures industrielles en Île-de-France. Contrats préventifs, intervention < 24h, toutes marques. ASSISTEO diagnostic vidéo. IEF & CO.",
    },
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(slug: string): Service[] {
  const service = getServiceBySlug(slug);
  if (!service) return [];
  return service.relatedSlugs
    .map((s) => getServiceBySlug(s))
    .filter((s): s is Service => s !== undefined);
}
