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
}

export const services: Service[] = [
  {
    slug: "fermetures-industrielles",
    title: "Fermetures & Portes Industrielles",
    shortTitle: "Industrielles",
    accentColor: "59, 130, 180",  // steel blue
    shortDescription:
      "Rideaux metalliques, portes sectionnelles, portes rapides, portes blindees. Robustesse, securite et performance pour vos acces industriels.",
    fullDescription:
      "IEF & CO concoit, fabrique et installe des fermetures industrielles sur mesure pour tous types de batiments : entrepots, usines, sites logistiques, commerces. Nos solutions repondent aux exigences de securite, d'isolation et de performance operationnelle les plus strictes.",
    icon: "factory",
    subServices: [
      { title: "Rideaux metalliques", description: "Acier, aluminium, lames pleines ou micro-perforees. Motorises ou manuels, adaptes a votre usage." },
      { title: "Portes sectionnelles", description: "Isolation thermique et acoustique, motorisation integree, hublots optionnels. Pour quais, ateliers et garages." },
      { title: "Portes a enroulement rapide", description: "Ouverture haute vitesse pour flux logistiques intenses. Souples ou rigides, jusqu'a 4000 cycles/jour." },
      { title: "Portes blindees", description: "Protection anti-intrusion renforcee pour sites sensibles. Certifiees selon les normes en vigueur." },
      { title: "Volets techniques", description: "Protection exterieure, ventilation, occultation. Sur mesure en acier ou aluminium." },
      { title: "Trappes techniques", description: "Acces securises aux locaux techniques, gaines et vides sanitaires." },
    ],
    faq: [
      { question: "Quelle est la duree de vie d'une porte sectionnelle industrielle ?", answer: "Avec un entretien regulier, une porte sectionnelle industrielle de qualite a une duree de vie de 15 a 25 ans, soit environ 20 000 a 50 000 cycles selon le modele et l'intensite d'utilisation." },
      { question: "La maintenance est-elle obligatoire ?", answer: "Oui. L'arrete du 21 decembre 1993 impose un entretien semestriel de toutes les portes automatiques et semi-automatiques sur les lieux de travail." },
      { question: "Intervenez-vous en urgence ?", answer: "Oui. Notre service de depannage intervient en moins de 24h ouvrees en Ile-de-France, 7j/7 sur demande." },
      { question: "Posez-vous des fermetures sur des batiments existants ?", answer: "Oui, nous intervenons aussi bien en neuf qu'en renovation. Un releve sur site est effectue pour adapter la solution au bati existant." },
      { question: "Quelles normes respectez-vous ?", answer: "Nos fermetures sont conformes a la norme EN 13241-1, a l'arrete du 21/12/1993, et au marquage CE. Les portes coupe-feu repondent egalement a la norme EN 16034." },
    ],
    relatedSlugs: ["automatismes", "maintenance", "portes-coupe-feu"],
    seo: {
      title: "Fermetures & Portes Industrielles | Rideaux Metalliques, Portes Sectionnelles",
      description: "Installation et maintenance de fermetures industrielles en Ile-de-France : rideaux metalliques, portes sectionnelles, portes rapides. Depannage 24h. Devis gratuit.",
    },
  },
  {
    slug: "portails-clotures",
    title: "Portails & Acces Vehicules",
    shortTitle: "Portails",
    accentColor: "166, 124, 82",  // warm earth
    shortDescription:
      "Portails coulissants, battants, autoportes, barrieres levantes. Securite, automatisation et controle d'acces pour vos sites.",
    fullDescription:
      "IEF & CO concoit et installe des portails et systemes d'acces vehicules pour sites industriels, tertiaires et residentiels. Chaque installation est dimensionnee selon les contraintes du site : charge, vent, frequence d'utilisation, securite.",
    icon: "gate",
    subServices: [
      { title: "Portail coulissant", description: "Sur rail ou autoportant, motorise, jusqu'a 12m d'ouverture. Ideal pour les acces poids lourds." },
      { title: "Portail battant", description: "1 ou 2 vantaux, acier ou aluminium, motorisation enterree ou a bras." },
      { title: "Portail autoportant", description: "Sans rail au sol, ideal pour les sites ou le sol ne peut etre modifie." },
      { title: "Barrieres levantes", description: "Controle d'acces vehicules, gestion de parking, peage automatique." },
      { title: "Bornes anti-belier", description: "Protection perimetrique haute securite contre les intrusions vehiculaires." },
      { title: "Clotures & grillages", description: "Perimetrie complete : panneaux rigides, concertina, detection peimetrique." },
    ],
    faq: [
      { question: "Quelle ouverture maximale pour un portail coulissant ?", answer: "Nos portails coulissants peuvent atteindre 12 metres d'ouverture, voire plus sur etude specifique. Les modeles autoportants atteignent generalement 8 a 10 metres." },
      { question: "Peut-on motoriser un portail existant ?", answer: "Oui, apres une etude de compatibilite (poids, dimensions, etat de la structure). Nous installons des motorisations electriques ou solaires adaptees." },
      { question: "Quels systemes de controle d'acces proposez-vous ?", answer: "Badge RFID, clavier a code, interphonie video, telecommande, commande GSM/Wi-Fi, lecteur de plaques. Solutions compatibles domotique." },
      { question: "Les portails resistent-ils au vent ?", answer: "Nos portails sont dimensionnes selon la norme EN 12424 (classement vent). Le choix du modele depend de l'exposition du site." },
      { question: "Proposez-vous un contrat de maintenance ?", answer: "Oui. Contrats preventifs semestriels ou annuels, depannage curatif, pieces et main d'oeuvre incluses selon la formule choisie." },
    ],
    relatedSlugs: ["automatismes", "fermetures-industrielles", "maintenance"],
    seo: {
      title: "Portails & Acces Vehicules | Coulissants, Battants, Barrieres",
      description: "Installation de portails coulissants, battants et barrieres levantes en Ile-de-France. Motorisation, controle d'acces, depannage. IEF & CO, expert depuis 2020.",
    },
  },
  {
    slug: "structures-metalliques",
    title: "Metallerie & Structures Sur Mesure",
    shortTitle: "Structures",
    accentColor: "160, 170, 180",  // cool chrome
    shortDescription:
      "Charpentes, mezzanines, passerelles, escaliers, garde-corps. Solidite, ingenierie et performance certifiee EN 1090.",
    fullDescription:
      "Notre bureau d'etude concoit des structures metalliques conformes a l'Eurocode 3 et certifiees EN 1090. De la modelisation 3D a la pose, nous realisons charpentes, mezzanines, escaliers et ouvrages speciaux pour l'industrie, le tertiaire et l'architecture.",
    icon: "building",
    subServices: [
      { title: "Garde-corps & mains courantes", description: "Acier, inox, aluminium. Conformes NF P01-012. Sur mesure et finitions soignees." },
      { title: "Mezzanines & passerelles", description: "Plateformes de stockage, passerelles de circulation, planchers techniques. Calcul de charge inclus." },
      { title: "Charpentes & ossatures acier", description: "Structures porteuses pour batiments industriels, agricoles, tertiaires. Fabrication atelier + pose grue." },
      { title: "Escaliers metalliques", description: "Droits, helicoidal, a quartier tournant. Acier, inox ou mixte acier-bois." },
      { title: "Marquises & auvents", description: "Protection des entrees, quais de chargement. Structure acier + couverture vitree ou bac acier." },
      { title: "Locaux techniques", description: "Cages grillagees, cloisons modulaires, supports d'equipements techniques." },
    ],
    faq: [
      { question: "Qu'est-ce que la certification EN 1090 ?", answer: "La norme EN 1090 certifie la capacite d'une entreprise a fabriquer et monter des structures metalliques porteuses. IEF & CO est certifie pour la fabrication d'elements structurels en acier." },
      { question: "Realisez-vous les plans d'execution ?", answer: "Oui. Notre bureau d'etude realise les plans d'execution, notes de calcul selon Eurocode 3, et modelisation 3D pour chaque projet." },
      { question: "Quels traitements de surface proposez-vous ?", answer: "Galvanisation a chaud, thermolaquage (large choix RAL), metallisation, inox brosse ou poli. Le traitement est choisi selon l'environnement et l'usage." },
      { question: "Intervenez-vous en hauteur ?", answer: "Oui. Nos equipes sont formees au travail en hauteur (port du harnais, echafaudage, nacelle). Nous coordonnons le levage et la securite sur chantier." },
      { question: "Quel est le delai pour une structure sur mesure ?", answer: "Comptez 1 a 2 semaines d'etude, 3 a 6 semaines de fabrication, et 1 a 10 jours de pose selon la complexite de l'ouvrage." },
    ],
    relatedSlugs: ["menuiserie-vitrerie", "fermetures-industrielles", "portes-coupe-feu"],
    seo: {
      title: "Structures Metalliques Sur Mesure | Charpentes, Mezzanines, Garde-corps",
      description: "Fabrication et pose de structures metalliques en Ile-de-France. Certification EN 1090, Eurocode 3. Charpentes, mezzanines, escaliers. Devis gratuit.",
    },
  },
  {
    slug: "menuiserie-vitrerie",
    title: "Menuiserie Acier, Aluminium & Vitrerie",
    shortTitle: "Menuiserie",
    accentColor: "100, 180, 200",  // glass/sky
    shortDescription:
      "Facades vitrees, verrieres, cloisons, fenetres alu/acier. Design, resistance et confort lumineux sur mesure.",
    fullDescription:
      "IEF & CO concoit et installe des menuiseries metalliques et vitreries pour facades, cloisons interieures et ouvertures. Nos solutions allient performance thermique, esthetique et durabilite, en acier ou aluminium selon le projet.",
    icon: "window",
    subServices: [
      { title: "Facades & vitrines", description: "Murs-rideaux, facades semi-structurelles, vitrines commerciales. Aluminium ou acier." },
      { title: "Verrieres", description: "Verrieres de toit, verrieres interieures, puits de lumiere. Structure acier + vitrage securise." },
      { title: "Cloisons vitrees", description: "Separation d'espaces, cloisons amovibles, parois de bureau. Aluminium + vitrage acoustique." },
      { title: "Chassis & fenetres", description: "Fenetres acier ou aluminium, ouvrants ou fixes, simple ou double vitrage." },
      { title: "Portes & portillons", description: "Portes d'entree, portillons de service, issues de secours vitrees." },
      { title: "Auvents vitres", description: "Marquises en verre trempe ou feuillete, structure acier ou aluminium." },
    ],
    faq: [
      { question: "Acier ou aluminium pour mes menuiseries ?", answer: "L'acier offre des profils plus fins et une esthetique industrielle. L'aluminium est plus leger, ne rouille pas et offre de meilleures performances thermiques. Le choix depend de l'usage et du style souhaite." },
      { question: "Quelles performances d'isolation ?", answer: "Nos menuiseries aluminium a rupture de pont thermique atteignent un coefficient Uw de 1,4 a 2,0 W/m2.K selon le vitrage. Les menuiseries acier sont plus adaptees aux separations interieures." },
      { question: "Posez-vous des vitrages securises ?", answer: "Oui : verre trempe, feuillete, anti-effraction (classes P1A a P8B), pare-balles (BR1 a BR7) selon les besoins." },
      { question: "Realisez-vous des facades completes ?", answer: "Oui. De l'etude thermique a la pose, nous realisons des facades neuves ou en renovation : murs-rideaux, VEC, VEA, facades semi-structurelles." },
      { question: "Quel entretien pour les menuiseries aluminium ?", answer: "Un nettoyage annuel a l'eau savonneuse suffit. Le thermolaquage resiste aux UV et aux intemperies pendant 20 a 30 ans." },
    ],
    relatedSlugs: ["structures-metalliques", "portes-coupe-feu", "fermetures-industrielles"],
    seo: {
      title: "Menuiserie Acier & Aluminium, Vitrerie | Facades, Verrieres, Cloisons",
      description: "Menuiserie metallique et vitrerie en Ile-de-France. Facades vitrees, verrieres, cloisons aluminium. Conception, fabrication et pose sur mesure. IEF & CO.",
    },
  },
  {
    slug: "portes-coupe-feu",
    title: "Portes Coupe-Feu & Securite Incendie",
    shortTitle: "Coupe-feu",
    accentColor: "200, 120, 50",  // fire/amber
    shortDescription:
      "Blocs-portes CF 1h/2h, clapets coupe-feu, rideaux coupe-feu. Protection, resistance et conformite ERP.",
    fullDescription:
      "IEF & CO fournit et installe des portes coupe-feu et dispositifs de compartimentage conformes aux reglementations ERP et Code du travail. Chaque installation est certifiee, testee et documentee pour faciliter vos controles APAVE/DEKRA.",
    icon: "flame",
    subServices: [
      { title: "Portes coupe-feu EI30/60/120", description: "Blocs-portes battants ou coulissants, simple ou double vantail. Fermeture automatique sur alarme incendie." },
      { title: "Trappes coupe-feu", description: "Acces techniques avec resistance au feu. Pour gaines, faux-plafonds et planchers techniques." },
      { title: "Rideaux coupe-feu", description: "Compartimentage de grandes surfaces (atriums, halls, galeries). Deploiement automatique sur alarme." },
      { title: "Cloisons pare-flamme", description: "Separation coupe-feu pour locaux a risque. Acier ou placo-platre renforce." },
      { title: "Vitrages pare-feu", description: "Vitrages EI30 a EI120 pour cloisons et portes. Transparence et protection incendie." },
      { title: "Renforts anti-effraction", description: "Portes et rideaux anti-intrusion pour sites sensibles. Certification selon EN 1627." },
    ],
    faq: [
      { question: "Que signifie EI30, EI60, EI120 ?", answer: "EI indique l'etancheite (E) et l'isolation thermique (I) au feu. Le chiffre indique la duree de resistance en minutes : EI60 = 60 minutes de protection." },
      { question: "Le controle APAVE est-il obligatoire ?", answer: "Pour les ERP (Etablissements Recevant du Public), oui. Un controle annuel par un organisme agree (APAVE, DEKRA, SOCOTEC) est obligatoire pour les portes coupe-feu." },
      { question: "Assurez-vous la mise en conformite ?", answer: "Oui. Nous auditons vos installations, identifions les non-conformites et proposons les solutions adaptees : remplacement, remise en etat ou complement d'equipement." },
      { question: "Vos portes coupe-feu sont-elles certifiees ?", answer: "Oui. Toutes nos portes coupe-feu sont certifiees selon EN 1634-1 (resistance au feu) et EN 16034 (marquage CE). PV d'essai fournis." },
      { question: "Peut-on motoriser une porte coupe-feu ?", answer: "Oui, avec un systeme de fermeture automatique asservie a la detection incendie. La porte se ferme automatiquement sur alarme et peut etre rearmee manuellement." },
    ],
    relatedSlugs: ["fermetures-industrielles", "maintenance", "menuiserie-vitrerie"],
    seo: {
      title: "Portes Coupe-Feu | EI30, EI60, EI120 | Securite Incendie ERP",
      description: "Installation et maintenance de portes coupe-feu en Ile-de-France. Conformite ERP, certification EN 16034, controles APAVE. Devis gratuit. IEF & CO.",
    },
  },
  {
    slug: "automatismes",
    title: "Automatismes & Controle d'Acces",
    shortTitle: "Automatismes",
    accentColor: "80, 120, 220",  // electric blue
    shortDescription:
      "Motorisation portes/portails, commandes radio/Wi-Fi/GSM, domotique, interphonie video, controle d'acces RFID.",
    fullDescription:
      "IEF & CO installe et maintient des systemes d'automatisation pour portes, portails et acces : motorisation, controle d'acces, interphonie, domotique. Nos solutions combinent confort d'utilisation, securite et compatibilite avec vos systemes existants.",
    icon: "cpu",
    subServices: [
      { title: "Motorisation portails", description: "Moteurs a bras, enterres, coulissants. Electrique ou solaire. Toutes marques : Somfy, Came, FAAC, Nice." },
      { title: "Motorisation rideaux & portes", description: "Moteurs tubulaires, centraux, lateraux. Adaptation sur fermetures existantes ou neuves." },
      { title: "Controle d'acces RFID", description: "Badges, cartes, telephones NFC. Gestion multi-sites, historique des acces, integration GTB." },
      { title: "Interphonie & videophonie", description: "Platines exterieures, ecrans interieurs, connexion smartphone. Audio ou video, filaire ou IP." },
      { title: "Barrieres automatiques", description: "Gestion de parkings, peages, controle de flux vehicules. Integration lecteur de plaques." },
      { title: "Domotique & commande a distance", description: "Commande Wi-Fi, GSM, application smartphone. Scenarios automatises, horaires programmes." },
    ],
    faq: [
      { question: "Peut-on motoriser un portail ou rideau existant ?", answer: "Oui, apres une etude de compatibilite (poids, dimensions, etat). Nous installons la motorisation la plus adaptee a votre equipement existant." },
      { question: "Motorisation electrique ou solaire ?", answer: "Le solaire est ideal pour les sites sans alimentation electrique a proximite. Il fonctionne avec un panneau et une batterie, avec une autonomie de plusieurs jours sans soleil." },
      { question: "Les automatismes sont-ils compatibles domotique ?", answer: "Oui. Nos installations sont compatibles avec les protocoles courants (Somfy io, Z-Wave, Wi-Fi, KNX) et peuvent etre pilotees via smartphone ou assistant vocal." },
      { question: "Quelle securite pour les portes automatiques ?", answer: "Cellules photoelectriques, bords sensibles, feux clignotants, arrets d'urgence. Conformite a la directive Machines 2006/42/CE et a la norme EN 16005." },
      { question: "Proposez-vous la telecommande multi-acces ?", answer: "Oui. Une seule telecommande peut piloter portail, garage, eclairage et volets. Nous programmons l'ensemble pour un fonctionnement unifie." },
    ],
    relatedSlugs: ["portails-clotures", "fermetures-industrielles", "maintenance"],
    seo: {
      title: "Automatismes & Controle d'Acces | Motorisation, RFID, Interphonie",
      description: "Installation d'automatismes et controle d'acces en Ile-de-France. Motorisation portails/portes, RFID, interphonie video, domotique. IEF & CO.",
    },
  },
  {
    slug: "maintenance",
    title: "Maintenance & Depannage 24/7",
    shortTitle: "Maintenance",
    accentColor: "60, 170, 140",  // teal/reliable
    shortDescription:
      "Contrats preventifs, depannage urgence < 24h, maintenance multi-sites, toutes marques. Continuite, fiabilite, reactivite.",
    fullDescription:
      "IEF & CO assure la maintenance preventive et curative de toutes vos fermetures et equipements d'acces. Contrats sur mesure, depannage rapide, intervention toutes marques. Notre service ASSISTEO permet le diagnostic a distance pour reduire les temps d'arret.",
    icon: "wrench",
    subServices: [
      { title: "ASSISTEO — Diagnostic video", description: "Assistance video a distance pour un diagnostic immediat sans deplacement. Reduction des temps d'arret et meilleure preparation des interventions." },
      { title: "Maintenance preventive", description: "Visites semestrielles ou trimestrielles, conformes a l'arrete du 21/12/1993. Checklist complete, PV d'intervention, carnet d'entretien." },
      { title: "Depannage urgence", description: "Intervention en moins de 24h ouvrees en Ile-de-France. Astreinte disponible 7j/7 sur contrat." },
      { title: "Maintenance multi-sites", description: "Un seul interlocuteur pour tous vos sites. Planning coordonne, reporting centralise, facturation groupee." },
      { title: "Remplacement d'organes", description: "Ressorts, cables, moteurs, cellules, telecommandes. Pieces d'origine ou equivalentes, toutes marques." },
      { title: "Contrats sur mesure", description: "Preventif seul, preventif + curatif, full service (pieces incluses). SLA 4h, 8h ou 24h selon vos besoins." },
    ],
    faq: [
      { question: "La maintenance semestrielle est-elle obligatoire ?", answer: "Oui. L'arrete du 21 decembre 1993 impose une maintenance semestrielle pour toutes les portes automatiques et semi-automatiques. Le non-respect engage la responsabilite du proprietaire." },
      { question: "Intervenez-vous sur toutes les marques ?", answer: "Oui. Nos techniciens sont formes sur les principales marques : Hormann, Novoferm, Crawford, Somfy, Came, FAAC, Nice, Record, ASSA ABLOY, Marantec, etc." },
      { question: "Qu'est-ce que le service ASSISTEO ?", answer: "ASSISTEO est notre service exclusif de diagnostic video a distance. Vous filmez la panne avec votre smartphone, notre technicien analyse en temps reel et prepare l'intervention. Cela reduit les temps d'arret et les deplacements inutiles." },
      { question: "Quels types de contrats proposez-vous ?", answer: "Trois formules : Preventif (visites planifiees), Preventif + Curatif (visites + depannage), Full Service (tout inclus, pieces et main d'oeuvre). Chaque contrat est adapte a votre parc d'equipements." },
      { question: "Fournissez-vous un carnet d'entretien ?", answer: "Oui. Chaque equipement dispose d'un carnet d'entretien digital avec l'historique complet des interventions, PV, photos et preconisations. Consultable en ligne." },
      { question: "Quel est le delai d'intervention en urgence ?", answer: "Moins de 24 heures ouvrees en Ile-de-France. Astreinte 7j/7 disponible sur contrat pour les urgences critiques (arret de production, securite)." },
      { question: "Combien coute un contrat de maintenance ?", answer: "Le tarif depend du nombre d'equipements, de la formule choisie et de la frequence des visites. Contactez-nous pour un devis personnalise gratuit." },
    ],
    relatedSlugs: ["fermetures-industrielles", "automatismes", "portails-clotures"],
    seo: {
      title: "Maintenance & Depannage Portes Industrielles | 24/7 | Toutes Marques",
      description: "Maintenance et depannage de fermetures industrielles en Ile-de-France. Contrats preventifs, intervention < 24h, toutes marques. ASSISTEO diagnostic video. IEF & CO.",
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
