/**
 * Brands maintained by IEF & CO — pages SEO ciblant les requêtes
 * "maintenance {marque}" / "dépannage {marque} Île-de-France".
 */

export interface Brand {
  slug: string;
  name: string;
  /** Couleur d'accent reprise de la charte de la marque (RGB) */
  accentColor: string;
  tagline: string;
  /** Description longue (300-500 mots) */
  intro: string;
  /** Gamme produits pris en charge */
  products: { name: string; description: string; family: string }[];
  /** Pannes courantes spécifiques à la marque */
  commonFailures: { title: string; description: string }[];
  /** Pièces détachées en stock */
  partsInStock: string[];
  /** Avantages spécifiques d'IEF & CO sur cette marque */
  advantages: string[];
  /** FAQ marque-spécifique */
  faq: { question: string; answer: string }[];
  /** SEO meta */
  seo: { title: string; description: string };
}

export const brands: Brand[] = [
  {
    slug: "hormann",
    name: "Hörmann",
    accentColor: "230, 26, 35", // Hörmann red
    tagline: "Maintenance et dépannage des portes industrielles Hörmann en Île-de-France",
    intro:
      "IEF & CO assure la maintenance, le dépannage et la pose des portes industrielles, portes sectionnelles, portes coupe-feu et motorisations Hörmann sur l'ensemble de l'Île-de-France. Hörmann est le leader européen de la fermeture industrielle — ses produits équipent une majorité des entrepôts logistiques, sites industriels, parkings et bâtiments tertiaires d'Île-de-France. Nos techniciens sont formés sur l'ensemble de la gamme Hörmann (portes sectionnelles SPU 67 / APU F42, portes rapides V 3015 / V 4015, portes battantes T30 / T90, motorisations WA 300 / SupraMatic) et disposent d'un stock permanent de pièces détachées d'origine pour intervention au premier passage. Que vous gériez un parc de 5 portes Hörmann ou de 200 sur plusieurs sites, nous proposons un contrat de maintenance adapté à votre intensité d'usage et à vos exigences de continuité de service.",
    products: [
      { name: "SPU 67 Thermo", description: "Porte sectionnelle isolation thermique — entrepôts climatisés", family: "Sectionnelle" },
      { name: "APU F42", description: "Porte sectionnelle aluminium-vitrage — façades tertiaires", family: "Sectionnelle" },
      { name: "V 3015", description: "Porte rapide souple — flux logistique haute fréquence", family: "Rapide" },
      { name: "V 4015 SEL", description: "Porte rapide à enroulement spirale — agroalimentaire", family: "Rapide" },
      { name: "T30 / T90", description: "Porte coupe-feu battante EI 30 / EI 90 minutes", family: "Coupe-feu" },
      { name: "FST T30", description: "Porte coupe-feu coulissante EI 30 — grandes ouvertures", family: "Coupe-feu" },
      { name: "ITO", description: "Niveleur de quai à charnière intégré", family: "Quai" },
      { name: "DTU", description: "Sas d'étanchéité quai (rideau-jupes-tablier)", family: "Quai" },
      { name: "WA 300 / WA 400", description: "Motorisation à arbre pour portes sectionnelles industrielles", family: "Motorisation" },
      { name: "SupraMatic E/P", description: "Motorisation tubulaire pour portes sectionnelles tertiaires", family: "Motorisation" },
    ],
    commonFailures: [
      { title: "Ressort de torsion cassé", description: "Symptôme : porte qui chute brutalement, qui ne tient pas en position ouverte. Notre intervention : remplacement ressort avec dimensionnement précis selon poids tablier, vérification couple moteur." },
      { title: "Carte électronique motorisation HS", description: "Symptôme : porte qui ne répond plus à la télécommande, écran d'affichage erreur. Stock permanent des cartes principales (Boîtier de commande SupraMatic, FU/FUE WA300)." },
      { title: "Joint d'étanchéité dégradé", description: "Symptôme : déperdition thermique, infiltrations d'eau, sifflement vent. Joints d'origine en stock (latéraux, linteau, sol)." },
      { title: "Cellule de sécurité défaillante", description: "Symptôme : porte qui ne se ferme plus, signal d'erreur cellule. Remplacement cellules photoélectriques d'origine, recalibrage." },
      { title: "Câble ou guide tordu", description: "Symptôme : tablier qui dévie, frottement, bruits anormaux. Redressage ou remplacement guide, retension câble." },
    ],
    partsInStock: [
      "Ressorts de torsion (toutes sections)",
      "Cellules de sécurité Hörmann RPS / FCS",
      "Cartes mère SupraMatic E/P",
      "Cartes mère WA 300 / WA 400",
      "Joints latéraux / linteau / sol",
      "Câbles galvanisés Ø 4 / Ø 6",
      "Guides verticaux / horizontaux",
      "Roulements & galets",
      "Télécommandes HSM4 / HSE4",
      "Boîtiers de commande extérieurs",
    ],
    advantages: [
      "Stock permanent de pièces d'origine Hörmann",
      "Techniciens formés sur l'intégralité de la gamme actuelle et historique",
      "Intervention au premier passage dans 90% des cas",
      "Fourniture des PV et certificats Hörmann pour vos audits",
      "Tarifs négociés sur les pièces grâce au volume",
    ],
    faq: [
      { question: "Êtes-vous agréés Hörmann ?", answer: "IEF & CO n'est pas un revendeur officiel Hörmann mais nous sommes formés sur leur gamme depuis plus de 5 ans, avec accès au catalogue de pièces détachées d'origine via nos fournisseurs partenaires." },
      { question: "Quelle est la durée de vie d'une porte Hörmann SPU 67 ?", answer: "Avec une maintenance préventive correcte (semestrielle), une SPU 67 a une durée de vie de 25 ans et environ 50 000 cycles. La motorisation peut nécessiter un remplacement intermédiaire à 15 ans." },
      { question: "Combien coûte le remplacement d'une cellule de sécurité Hörmann ?", answer: "Selon le modèle, entre 150 € et 350 € HT pose comprise. Le remplacement préventif des cellules tous les 5 ans est recommandé sur les portes très sollicitées." },
      { question: "Pouvez-vous remplacer une motorisation Hörmann ancienne par une SupraMatic actuelle ?", answer: "Oui, dans la plupart des cas. Une étude de compatibilité (poids tablier, hauteur ressort, raccordement électrique) est réalisée avant devis. Le remplacement permet souvent de récupérer des fonctionnalités modernes (smart-home, retour ouverture, comptage cycles)." },
      { question: "Délai pour pièces détachées Hörmann ?", answer: "85% de notre stock pièces couvre les besoins courants (ressorts, joints, cellules, télécommandes). Pour les pièces moins courantes : 24-48h en flux tendu via Hörmann France." },
    ],
    seo: {
      title: "Maintenance porte Hörmann Île-de-France — IEF & CO",
      description: "Spécialiste maintenance et dépannage portes industrielles Hörmann en IDF : SPU 67, APU F42, V 3015, T30/T90, motorisations SupraMatic. Stock pièces d'origine. Intervention sous 4h.",
    },
  },

  {
    slug: "crawford",
    name: "Crawford",
    accentColor: "0, 110, 173", // ASSA ABLOY blue
    tagline: "Spécialiste maintenance Crawford / ASSA ABLOY Entrance Systems",
    intro:
      "IEF & CO opère sur l'ensemble de la gamme Crawford (groupe ASSA ABLOY Entrance Systems) en Île-de-France, avec une spécialisation forte sur les portes sectionnelles industrielles, niveleurs de quai et systèmes de sas d'étanchéité utilisés par la grande logistique. Crawford équipe une grande partie des entrepôts e-commerce et plateformes de messagerie d'IDF — ses produits sont réputés pour leur robustesse et leur capacité à supporter des cadences élevées (jusqu'à 4000 cycles/jour). Notre expertise sur Crawford couvre la maintenance préventive trimestrielle adaptée aux usages intensifs, le dépannage curatif sous 4h pour les sites critiques, et la fourniture des pièces détachées d'origine via notre fournisseur agréé. Nous travaillons régulièrement en complément des contrats Crawford Care propres à la marque, pour les clients qui cherchent un prestataire de proximité plus réactif que le SAV constructeur.",
    products: [
      { name: "Combi 442", description: "Porte sectionnelle industrielle Combi 442 — entrepôts logistiques", family: "Sectionnelle" },
      { name: "Combi Therm", description: "Porte sectionnelle isothermique pour entrepôts climatisés", family: "Sectionnelle" },
      { name: "OH1042S", description: "Porte sectionnelle haute performance — flux logistique", family: "Sectionnelle" },
      { name: "RR300", description: "Porte rapide à enroulement souple — agroalimentaire", family: "Rapide" },
      { name: "Eagle Industrial", description: "Porte rapide haute fréquence — 4000 cycles/jour", family: "Rapide" },
      { name: "DLC 6030", description: "Niveleur de quai télescopique 60 kN", family: "Quai" },
      { name: "DSC 040", description: "Sas d'étanchéité quai standard", family: "Quai" },
      { name: "Megadoor", description: "Porte enroulable hangar grande dimension", family: "Spéciale" },
    ],
    commonFailures: [
      { title: "Lanière de porte rapide déchirée", description: "Symptôme : passage de poids lourds qui accroche le tablier souple. Stock permanent de tabliers Eagle, RR300, Combi PVC armé." },
      { title: "Niveleur de quai en panne hydraulique", description: "Symptôme : DLC qui ne monte/descend plus, fuite huile. Diagnostic vérin + remplacement joints + recharge fluide spécifique." },
      { title: "Sas d'étanchéité déchiré", description: "Symptôme : DSC dont les jupes/rideaux sont déchirés par usage poids lourds. Remplacement éléments d'usure (jupes Hypalon, rideaux PVC armé)." },
      { title: "Carte motorisation OH1042 HS", description: "Symptôme : porte sectionnelle ne répond plus, fonctionnement erratique. Stock cartes mère et armoires Crawford." },
    ],
    partsInStock: [
      "Tabliers Crawford Eagle / RR300 / Combi PVC",
      "Joints DSC sas d'étanchéité",
      "Pièces hydrauliques niveleurs DLC",
      "Cartes mère armoires Crawford",
      "Cellules photo Crawford",
      "Boîtiers de commande IP65",
      "Câbles & guides Crawford",
    ],
    advantages: [
      "Spécialistes des cadences élevées (>2000 cycles/jour)",
      "Pièces Crawford d'origine via fournisseur agréé",
      "Diagnostic à distance ASSISTEO pour les pannes complexes",
      "Maintenance niveleurs de quai inclue dans nos contrats",
      "Reporting GMAO compatible avec vos référentiels de maintenance",
    ],
    faq: [
      { question: "Êtes-vous partenaires ASSA ABLOY Entrance Systems ?", answer: "Nous ne sommes pas un partenaire officiel mais nous travaillons régulièrement en complément des contrats Crawford Care, ou en remplacement pour les clients qui cherchent un prestataire de proximité plus réactif." },
      { question: "Maintenez-vous les niveleurs de quai Crawford DLC ?", answer: "Oui, c'est même un de nos savoir-faire spécifiques. Maintenance hydraulique, remplacement jupes, vérins, électrovannes. Stock pièces principal en atelier Groslay." },
      { question: "Quel est le délai de remplacement d'une lanière Eagle ?", answer: "24-48h pour les modèles standards en stock, 5-10 jours pour les configurations sur mesure (couleur spéciale, dimension non standard, options spécifiques)." },
      { question: "Maintenance Crawford à fréquence trimestrielle nécessaire ?", answer: "Oui pour les portes rapides type Eagle dépassant 2000 cycles/jour. La fréquence semestrielle suffit pour les sectionnelles standards. Notre devis personnalisé propose la fréquence optimale selon votre usage réel mesuré." },
      { question: "Pouvez-vous reprendre un parc Crawford d'un autre prestataire ?", answer: "Oui, nous réalisons systématiquement un audit gratuit du parc à la reprise (état général, conformité, historique d'incidents). Le rapport vous est remis sous 7 jours après visite." },
    ],
    seo: {
      title: "Maintenance porte Crawford Île-de-France — IEF & CO",
      description: "Spécialiste maintenance et dépannage Crawford / ASSA ABLOY en IDF : Combi 442, Eagle, OH1042, niveleurs DLC, sas DSC. Pièces d'origine. Cadences intensives 4000 cycles/jour.",
    },
  },

  {
    slug: "maviflex",
    name: "Maviflex",
    accentColor: "240, 145, 0", // Maviflex orange
    tagline: "Maintenance des portes souples rapides Maviflex en IDF",
    intro:
      "Maviflex est le spécialiste français des portes souples rapides industrielles. Ses produits équipent les sites agroalimentaires, pharmaceutiques, salles propres et zones de stockage à atmosphère contrôlée. IEF & CO maintient les portes Maviflex sur l'ensemble de l'Île-de-France avec une expertise particulière sur les modèles MaviPro, MaviSafe et MaviRoll — utilisés intensivement dans la grande distribution, l'agroalimentaire (MIN de Rungis notamment) et les zones de production sensibles. Les portes souples Maviflex demandent une maintenance préventive trimestrielle quand elles dépassent 1500 cycles/jour : nous proposons des contrats adaptés à cette intensité avec stock permanent des éléments d'usure (tablier souple PVC armé, lanière, sangle de levage, cellules de sécurité).",
    products: [
      { name: "MaviPro", description: "Porte souple rapide standard — industrie générale", family: "Rapide" },
      { name: "MaviSafe", description: "Porte rapide auto-réparable — flux poids lourds", family: "Rapide" },
      { name: "MaviRoll", description: "Porte rapide à enroulement souple — climatisation", family: "Rapide" },
      { name: "MaviFlex Cleanroom", description: "Porte salle propre ISO 5/6/7", family: "Spéciale" },
      { name: "MaviCold", description: "Porte souple isothermique pour chambre froide", family: "Isotherme" },
    ],
    commonFailures: [
      { title: "Tablier souple déchiré", description: "Symptôme : trous, déchirures suite à choc poids lourd. Remplacement tablier au panneau ou complet selon ampleur, options auto-réparable disponibles." },
      { title: "Sangle de levage HS", description: "Symptôme : porte qui peine à monter, bruits anormaux moteur. Sangle d'origine en stock pour MaviPro / MaviSafe." },
      { title: "Cellule de sécurité Maviflex défaillante", description: "Symptôme : porte qui se ferme malgré obstacle, ou ne se ferme plus du tout. Diagnostic + remplacement cellules photoélectriques." },
      { title: "Carte mère MaviControl HS", description: "Symptôme : porte qui ne démarre plus, comportement erratique. Stock cartes mère MaviControl." },
    ],
    partsInStock: [
      "Tabliers MaviPro / MaviSafe / MaviRoll",
      "Sangles de levage Maviflex",
      "Cellules photo Maviflex",
      "Cartes mère MaviControl",
      "Boutons-poussoirs et radars de détection",
      "Pignons et arbres d'enroulement",
    ],
    advantages: [
      "Expertise sur agroalimentaire et MIN de Rungis",
      "Stock complet d'éléments d'usure Maviflex",
      "Maintenance trimestrielle adaptée aux portes intensives",
      "Diagnostic à distance ASSISTEO",
      "Conformité HACCP pour les pièces alimentaires",
    ],
    faq: [
      { question: "Maintenance des portes Maviflex en zone agroalimentaire ?", answer: "Oui, c'est un de nos savoir-faire spécifiques. Nos pièces et nos méthodes respectent les exigences HACCP (matériaux, désinfection des outils, traçabilité)." },
      { question: "Les tabliers souples sont-ils consommables ?", answer: "Oui, pour les portes très sollicitées (>1500 cycles/jour ou sites poids lourds), le tablier est généralement à remplacer tous les 18-36 mois. Notre contrat Or inclut 1 tablier de remplacement par an et par porte." },
      { question: "Délai pour un tablier Maviflex sur mesure ?", answer: "5 à 10 jours ouvrés pour un tablier standard en stock, 2-3 semaines pour une fabrication sur mesure (dimensions non standards, options spécifiques)." },
      { question: "Avez-vous un partenariat Maviflex ?", answer: "Pas de partenariat officiel, mais nous achetons les pièces d'origine via le réseau de distribution Maviflex et formons régulièrement nos techniciens sur leurs nouveautés produit." },
      { question: "Maintenance d'une porte Maviflex en chambre froide négative ?", answer: "Oui. Les portes MaviCold ont des contraintes particulières (givrage, joints isothermes, motorisation adaptée au froid). Nos techniciens disposent du matériel spécifique pour intervention sous température négative." },
    ],
    seo: {
      title: "Maintenance porte Maviflex Île-de-France — IEF & CO",
      description: "Spécialiste maintenance portes souples rapides Maviflex en IDF : MaviPro, MaviSafe, MaviRoll, MaviCold. Agroalimentaire, MIN Rungis, salles propres. Stock pièces d'origine.",
    },
  },

  {
    slug: "came",
    name: "Came",
    accentColor: "0, 154, 68", // Came green
    tagline: "Maintenance et dépannage des automatismes Came en Île-de-France",
    intro:
      "Came est le leader européen des automatismes de portails, barrières automatiques et bornes anti-bélier. IEF & CO maintient les automatismes Came sur l'ensemble de l'Île-de-France pour les copropriétés, parkings publics et privés, sites industriels et résidences sécurisées. Notre expertise couvre toute la gamme Came : moteurs pour portails coulissants (BX-A, BKS), portails battants (FAST, AXO), barrières levantes (G2080, G4040, G6500), bornes escamotables (P3, P5), ainsi que la programmation des armoires de commande (ZBX, ZA3, ZL19). La maintenance Came est particulièrement critique pour les copropriétés et parkings où une panne du système d'accès peut bloquer plusieurs centaines de véhicules — d'où l'importance d'un délai d'intervention court et d'un stock pièces principal.",
    products: [
      { name: "BX-A", description: "Motorisation portail coulissant 800 kg — copropriétés", family: "Portail coulissant" },
      { name: "BKS", description: "Motorisation portail coulissant 1800 kg — sites industriels", family: "Portail coulissant" },
      { name: "FAST", description: "Motorisation à bras pour portail battant 2 vantaux", family: "Portail battant" },
      { name: "AXO", description: "Motorisation enterrée portail battant — résidentiel premium", family: "Portail battant" },
      { name: "G2080 / G4040", description: "Barrière levante automatique — parkings", family: "Barrière" },
      { name: "G6500", description: "Barrière haute résistance — sites tertiaires", family: "Barrière" },
      { name: "P3 / P5 / P9", description: "Borne escamotable anti-bélier — zones piétonnes", family: "Borne" },
      { name: "ZBX / ZA3 / ZL19", description: "Armoire de commande Came (gestion accès, RFID)", family: "Armoire" },
    ],
    commonFailures: [
      { title: "Moteur portail coulissant en sécurité", description: "Symptôme : portail qui s'arrête en plein cycle, voyant erreur sur armoire. Diagnostic capteur fin de course, encodeur, condensateur." },
      { title: "Barrière levante bloquée", description: "Symptôme : lisse qui ne monte plus, ou monte puis chute. Vérification ressort de compensation, embrayage, butée." },
      { title: "Lecteur RFID HS", description: "Symptôme : badge non reconnu, bip d'erreur. Remplacement antenne RFID, reprogrammation badges sur armoire ZA3/ZL19." },
      { title: "Borne escamotable en panne hydraulique", description: "Symptôme : borne qui ne remonte plus, fuite huile. Stock pièces hydrauliques P3/P5, intervention spécialisée." },
    ],
    partsInStock: [
      "Moteurs Came BX-A / BKS",
      "Cartes ZBX / ZA3 / ZL19",
      "Lisses barrière G2080 / G4040",
      "Photocellules Dir / Deir Came",
      "Condensateurs moteurs (toutes valeurs)",
      "Émetteurs Came TOP / TWIN",
      "Encodeurs et fins de course",
      "Pièces hydrauliques bornes P3 / P5",
    ],
    advantages: [
      "Stock permanent pièces Came d'origine",
      "Programmation armoires + reprogrammation badges sur place",
      "Maintenance bornes anti-bélier (rare sur le marché)",
      "Diagnostic à distance via ASSISTEO",
      "Reporting copropriété (PV maintenance type AG)",
    ],
    faq: [
      { question: "Maintenez-vous les bornes anti-bélier Came ?", answer: "Oui, c'est une de nos spécialités. Les bornes P3, P5 et P9 sont des produits techniques avec composants hydrauliques sensibles — nous formons spécifiquement nos techniciens à leur maintenance." },
      { question: "Pouvez-vous reprogrammer les badges RFID sur une armoire ZA3 ?", answer: "Oui, sur place. Ajout, suppression, listing complet des badges actifs — service inclus dans nos contrats de maintenance copropriété." },
      { question: "Délai pour remplacement moteur Came BX-A ?", answer: "24-48h pour intervention complète : démontage ancien moteur, pose nouveau, raccordement, paramétrage armoire, test 10 cycles, formation gardien sur la prise en main." },
      { question: "Peut-on motoriser un portail manuel existant avec du Came ?", answer: "Oui dans 90% des cas. Une étude de compatibilité (poids, encombrement, alimentation 230V à proximité) est réalisée avant devis. Câblage et armoire toujours fournis." },
      { question: "Maintenance barrière de parking — quelle fréquence ?", answer: "Semestrielle pour usage normal (<500 cycles/jour), trimestrielle pour usage intensif. La maintenance préventive prévient surtout l'usure des ressorts de compensation et la dérive de la fin de course." },
    ],
    seo: {
      title: "Maintenance automatismes Came Île-de-France — IEF & CO",
      description: "Spécialiste automatismes Came en IDF : motorisations portails BX-A/BKS/FAST, barrières G2080/G4040, bornes anti-bélier P3/P5. Stock pièces, programmation armoires.",
    },
  },
];

export function getBrandBySlug(slug: string): Brand | undefined {
  return brands.find((b) => b.slug === slug);
}
