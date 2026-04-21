/**
 * Glossaire technique métallerie — référence SEO longue traîne.
 * Chaque terme = une page dédiée /glossaire/[slug] + listing /glossaire.
 */

export interface GlossaryTerm {
  slug: string;
  term: string;
  /** Catégorie pour grouper */
  category: "Norme" | "Technique" | "Composant" | "Réglementation" | "Méthode" | "Sécurité";
  /** Définition courte (1 phrase) */
  shortDef: string;
  /** Définition complète (200-500 mots) */
  fullDef: string;
  /** Termes liés (slugs) */
  related?: string[];
  /** Service pertinent (slug) pour cross-linking */
  relatedServices?: string[];
}

export const glossary: GlossaryTerm[] = [
  {
    slug: "en-1090",
    term: "EN 1090",
    category: "Norme",
    shortDef: "Norme européenne harmonisée régissant la fabrication et le marquage CE des structures métalliques.",
    fullDef:
      "La norme EN 1090 (titre complet : Exécution des structures en acier et en aluminium) est la référence européenne obligatoire pour toute entreprise fabriquant des structures métalliques destinées au bâtiment ou aux ouvrages d'art. Elle se décline en 3 parties : EN 1090-1 (exigences pour le marquage CE), EN 1090-2 (exigences techniques pour les structures acier), EN 1090-3 (exigences techniques pour les structures aluminium). Une entreprise certifiée EN 1090 doit disposer d'un système qualité documenté, d'un responsable de l'exécution en soudage (RWC), de soudeurs qualifiés selon les modes opératoires WPQR, et d'un contrôle interne traçable. La certification est délivrée par un organisme notifié après audit annuel. Sans EN 1090, une entreprise ne peut pas légalement vendre de charpente métallique destinée à un ouvrage de construction en Europe. IEF & CO est certifiée EN 1090 niveau EXC2 — voir notre page dédiée à nos certifications.",
    related: ["eurocode-3", "exc2", "wpqr"],
    relatedServices: ["structures-metalliques"],
  },
  {
    slug: "en-13241",
    term: "EN 13241",
    category: "Norme",
    shortDef: "Norme européenne pour les portes et portails industriels, commerciaux et résidentiels.",
    fullDef:
      "La norme EN 13241 (Portes et portails industriels, commerciaux et de garage) définit les exigences de sécurité, de performance et d'aptitude à l'usage pour l'ensemble des portes et portails motorisés. Elle couvre les portes sectionnelles, rideaux métalliques, portes battantes industrielles, portails coulissants et battants. Les exigences principales portent sur : la résistance aux charges de vent, l'étanchéité à l'eau et à l'air, la résistance mécanique, la sécurité des utilisateurs (anti-écrasement, anti-cisaillement, dispositifs de protection), la durabilité. Tout produit conforme EN 13241 doit porter le marquage CE. L'arrêté du 21 décembre 1993 impose un entretien semestriel des portes automatiques sur les lieux de travail. Voir aussi EN 12453 (sécurité d'usage motorisée) et EN 12604 (sécurité d'usage manuelle).",
    related: ["en-12453", "en-12604", "marquage-ce", "arrete-21-12-1993"],
    relatedServices: ["fermetures-industrielles", "portails-clotures"],
  },
  {
    slug: "en-16034",
    term: "EN 16034",
    category: "Norme",
    shortDef: "Norme européenne pour portes et portails à caractéristiques de résistance au feu et/ou au dégagement de fumée.",
    fullDef:
      "La norme EN 16034 (Blocs portes et portails — Norme de produit, caractéristiques de performance — Caractéristiques de résistance au feu et/ou de dégagement de fumée) s'applique aux fermetures coupe-feu (portes battantes EI 30, EI 60, EI 90, EI 120, rideaux coupe-feu, portes coulissantes coupe-feu). Elle couvre les exigences de résistance au feu (EI = isolation thermique + intégrité), de comportement au feu, de dégagement de fumée (Sa = pas de passage à 20°C, S200 = pas de passage à 200°C). Tout produit coupe-feu doit être conforme EN 16034 + EN 13241 (marquage CE double). En France, l'arrêté du 24 mai 2010 impose la maintenance préventive annuelle des portes coupe-feu en ERP, avec PV signé. Pour les sites industriels classés ICPE, des obligations spécifiques peuvent s'appliquer.",
    related: ["en-13241", "ei-60", "erp"],
    relatedServices: ["portes-coupe-feu"],
  },
  {
    slug: "eurocode-3",
    term: "Eurocode 3",
    category: "Norme",
    shortDef: "Code européen de calcul des structures en acier (NF EN 1993).",
    fullDef:
      "L'Eurocode 3 (NF EN 1993) est le référentiel européen de dimensionnement des structures en acier. Il remplace les anciennes normes nationales françaises (CM 66, additif 80) depuis 2010. Il définit les méthodes de calcul aux états limites pour : la résistance des sections, la stabilité (flambement, déversement), les assemblages (boulonnerie, soudures), la résistance au feu, la fatigue. Toute structure neuve réalisée en France doit être dimensionnée selon l'Eurocode 3 ou un document équivalent (NF DTU pour le bâtiment). Notre bureau d'étude IEF & CO produit des notes de calcul Eurocode 3 pour chaque charpente métallique conçue, validées par un BET partenaire si exigé contractuellement.",
    related: ["en-1090", "exc2"],
    relatedServices: ["structures-metalliques"],
  },
  {
    slug: "exc2",
    term: "EXC2 (Classe d'exécution 2)",
    category: "Norme",
    shortDef: "Classe d'exécution 2 selon EN 1090-2 — niveau standard pour la majorité des structures métalliques de bâtiment.",
    fullDef:
      "La classe d'exécution (Execution Class — EXC) est définie par la norme EN 1090-2. Elle classe les structures en 4 niveaux croissants d'exigence : EXC1 (structures secondaires non porteuses), EXC2 (structures de bâtiment standard), EXC3 (structures complexes ou à fortes charges dynamiques), EXC4 (structures critiques type ponts, hôpitaux, centrales nucléaires). La classe est déterminée par 3 paramètres : la classe de conséquence (CC1 à CC3 — gravité d'une défaillance), la catégorie de service (SC1 à SC2 — fatigue), la catégorie de production (PC1 à PC2 — soudabilité matériau). EXC2 est le standard de la métallerie B2B française : convient pour 95% des bâtiments tertiaires, industriels et logistiques. IEF & CO est certifié EXC2 — niveau adapté à 100% de notre activité métallerie. Pour les rares projets EXC3, nous travaillons en partenariat avec des charpentiers EXC3 certifiés.",
    related: ["en-1090", "eurocode-3"],
    relatedServices: ["structures-metalliques"],
  },
  {
    slug: "wpqr",
    term: "WPQR (Welding Procedure Qualification Record)",
    category: "Méthode",
    shortDef: "Document de qualification d'un mode opératoire de soudage selon EN ISO 15614.",
    fullDef:
      "Le WPQR (Welding Procedure Qualification Record) est un document obligatoire pour toute entreprise certifiée EN 1090. Il décrit un mode opératoire de soudage (WPS — Welding Procedure Specification) ayant fait l'objet d'essais qualificatifs sur éprouvettes selon la norme EN ISO 15614. Chaque WPQR couvre un domaine de validité précis : matériau de base (S235, S275, S355...), procédé de soudage (MAG, TIG, ARC...), position de soudage (à plat, vertical, plafond), épaisseur, gaz de protection. L'entreprise doit pouvoir présenter un WPQR couvrant chaque type de soudure exécutée sur ses ouvrages. Les soudeurs eux-mêmes doivent être qualifiés selon EN ISO 9606 — leur qualification individuelle est valable 2 à 3 ans selon le niveau. IEF & CO dispose d'un référentiel complet de WPQR couvrant l'ensemble des matériaux et procédés utilisés dans nos productions.",
    related: ["en-1090", "exc2"],
    relatedServices: ["structures-metalliques"],
  },
  {
    slug: "doe",
    term: "DOE (Dossier des Ouvrages Exécutés)",
    category: "Méthode",
    shortDef: "Dossier remis au client à la fin d'un chantier réunissant tous les documents de l'ouvrage construit.",
    fullDef:
      "Le DOE (Dossier des Ouvrages Exécutés) est un livrable contractuel de fin de chantier réunissant l'ensemble des documents nécessaires à l'exploitation et à la maintenance ultérieure d'un ouvrage. Il comprend : les plans d'exécution conformes (avec toutes les modifications réalisées en cours de chantier), les notices techniques des équipements posés, les notices d'utilisation et d'entretien, les certificats matières, les PV de contrôle, les attestations de conformité, les contacts SAV. Pour la métallerie, le DOE inclut spécifiquement : plans de fabrication des ouvrages, certificats matières acier (3.1 selon EN 10204), modes opératoires de soudage (WPS), résultats d'essais non destructifs si exigés, notice d'entretien des fermetures motorisées. Le DOE est obligatoire dans les marchés publics et fortement recommandé dans le privé pour faciliter la maintenance ultérieure.",
    related: ["en-1090", "wpqr"],
    relatedServices: ["structures-metalliques", "maintenance"],
  },
  {
    slug: "arrete-21-12-1993",
    term: "Arrêté du 21 décembre 1993",
    category: "Réglementation",
    shortDef: "Arrêté français rendant obligatoire l'entretien semestriel des portes automatiques sur les lieux de travail.",
    fullDef:
      "L'arrêté du 21 décembre 1993 (modifié 1996) relatif aux portes et portails automatiques et semi-automatiques sur les lieux de travail impose à tout employeur : (1) un entretien semestriel par une entreprise spécialisée ou un personnel formé, (2) la tenue d'un carnet d'entretien à jour mentionnant chaque intervention, (3) la signalisation visible des dispositifs d'arrêt d'urgence, (4) un dispositif de déverrouillage manuel en cas de coupure de courant. Le non-respect engage la responsabilité civile et pénale de l'employeur en cas d'accident. C'est la base réglementaire qui fonde l'obligation de souscrire un contrat de maintenance pour toute porte automatique en milieu professionnel. Voir aussi EN 13241 (norme produit) et EN 12453 (sécurité d'usage des portes motorisées).",
    related: ["en-13241", "en-12453"],
    relatedServices: ["maintenance", "fermetures-industrielles"],
  },
  {
    slug: "en-12453",
    term: "EN 12453",
    category: "Norme",
    shortDef: "Norme européenne définissant la sécurité d'utilisation des portes et portails motorisés.",
    fullDef:
      "La norme EN 12453 définit les exigences de sécurité d'utilisation des portes et portails motorisés. Elle classe les usagers en 3 niveaux (avertis, informés, public) et définit pour chaque combinaison usage × type de fermeture les dispositifs de sécurité minimum requis : photocellules, bandes palpeuses sensibles, détection de présence, contrôle de force du moteur, dispositifs anti-écrasement, fermetures à action maintenue. Elle est complémentaire de la EN 13241 (caractéristiques produit). Tout fabricant ou intégrateur doit respecter EN 12453 pour mettre en service une porte motorisée — c'est la base juridique qui justifie les remplacements obligatoires de cellules vétustes lors d'un audit maintenance.",
    related: ["en-13241", "en-12604", "arrete-21-12-1993"],
    relatedServices: ["fermetures-industrielles", "portails-clotures", "automatismes"],
  },
  {
    slug: "en-12604",
    term: "EN 12604",
    category: "Norme",
    shortDef: "Norme européenne pour la sécurité d'utilisation des portes et portails à manœuvre manuelle.",
    fullDef:
      "La norme EN 12604 (Portes et portails industriels, commerciaux et de garage — Aspects mécaniques) couvre les exigences de sécurité mécanique des portes et portails à manœuvre manuelle (non motorisés). Elle définit les protections requises contre l'écrasement, le cisaillement, le coincement, le choc, la chute de l'élément (pour les portes à contrepoids ou à ressorts). Elle est moins fréquemment citée que EN 12453 (motorisé) car la majorité des fermetures B2B sont motorisées, mais elle reste applicable aux portes industrielles manuelles, portails de service basculants manuels, etc.",
    related: ["en-12453", "en-13241"],
    relatedServices: ["fermetures-industrielles"],
  },
  {
    slug: "marquage-ce",
    term: "Marquage CE",
    category: "Réglementation",
    shortDef: "Marquage attestant la conformité d'un produit aux exigences européennes pour sa libre circulation dans l'EEE.",
    fullDef:
      "Le marquage CE atteste qu'un produit respecte les exigences essentielles des directives ou règlements européens applicables (sécurité, santé, environnement). Pour les produits du bâtiment et de la métallerie, les marquages CE pertinents sont basés sur le Règlement Produits de Construction (RPC) n°305/2011. Les structures métalliques doivent porter le marquage CE selon EN 1090-1, les fermetures selon EN 13241, les coupe-feu selon EN 16034. Le marquage CE doit être accompagné d'une Déclaration de Performance (DoP) accessible sur le site du fabricant. En cas d'audit chantier ou de contrôle, le défaut de marquage CE peut entraîner l'arrêt de chantier et des sanctions pénales.",
    related: ["en-1090", "en-13241", "en-16034"],
    relatedServices: ["structures-metalliques", "fermetures-industrielles", "portes-coupe-feu"],
  },
  {
    slug: "ei-60",
    term: "EI 60 (Coupe-feu 60 minutes)",
    category: "Sécurité",
    shortDef: "Classement de résistance au feu : étanchéité (E) + isolation thermique (I) pendant 60 minutes.",
    fullDef:
      "Le classement EI XX désigne la résistance au feu d'un élément de construction selon EN 13501-2. E = étanchéité aux flammes et aux gaz chauds, I = isolation thermique (face non exposée < 140°C en moyenne, < 180°C ponctuellement). Le nombre indique la durée en minutes : EI 30 = 30 min, EI 60 = 1h, EI 90 = 1h30, EI 120 = 2h. Les exigences en ERP varient selon la catégorie d'établissement : EI 60 est le standard pour les portes recoupant des locaux à risque, EI 30 pour les portes de circulation, EI 120 pour les coupes principales. Une porte EI 60 doit faire l'objet d'une maintenance préventive annuelle obligatoire selon l'arrêté du 24 mai 2010 (ERP).",
    related: ["en-16034"],
    relatedServices: ["portes-coupe-feu"],
  },
  {
    slug: "erp",
    term: "ERP (Établissement Recevant du Public)",
    category: "Réglementation",
    shortDef: "Bâtiment ouvert au public et soumis à des règles de sécurité incendie spécifiques.",
    fullDef:
      "Un ERP (Établissement Recevant du Public) est tout bâtiment, local ou enceinte dans lequel des personnes extérieures sont admises (commerce, hôtel, restaurant, école, hôpital, salle de sport, lieu de culte, etc.). Les ERP sont classés en 5 catégories selon leur capacité d'accueil (1ère catégorie >1500 personnes, 5e catégorie <300) et 14 types selon leur activité (M = magasins, N = restaurants, R = enseignement, U = sanitaires, etc.). Les exigences de sécurité incendie (matériaux, désenfumage, issues de secours, fermetures coupe-feu) sont fixées par le règlement de sécurité contre l'incendie. Les fermetures coupe-feu d'ERP doivent être maintenues annuellement avec PV signé par un organisme habilité.",
    related: ["en-16034", "ei-60"],
    relatedServices: ["portes-coupe-feu"],
  },
  {
    slug: "ressort-torsion",
    term: "Ressort de torsion",
    category: "Composant",
    shortDef: "Ressort hélicoïdal qui équilibre le poids d'une porte sectionnelle pour faciliter son ouverture.",
    fullDef:
      "Le ressort de torsion est l'organe central d'une porte sectionnelle : il stocke l'énergie mécanique nécessaire pour soulever le tablier. Quand la porte se ferme, le ressort accumule de l'énergie ; quand elle s'ouvre, il la restitue. Sans ressort, la motorisation devrait porter intégralement le poids du tablier (jusqu'à 300 kg pour une porte 4×4m). Un ressort est dimensionné précisément selon le poids, la course et la cadence — un mauvais dimensionnement use prématurément la motorisation et peut causer des accidents (chute de tablier). Durée de vie standard : 20 000 à 30 000 cycles. Au-delà, le ressort fatigue et finit par se rompre — c'est l'une des pannes les plus fréquentes. Le remplacement doit toujours être réalisé par un professionnel : un ressort de torsion sous tension peut causer de graves blessures lors d'une mauvaise manipulation.",
    related: [],
    relatedServices: ["fermetures-industrielles", "maintenance"],
  },
  {
    slug: "anti-pince-doigts",
    term: "Anti-pince-doigts",
    category: "Sécurité",
    shortDef: "Dispositif de sécurité empêchant le coincement des doigts dans les articulations d'une porte sectionnelle.",
    fullDef:
      "Le système anti-pince-doigts est un profil spécifique des panneaux de portes sectionnelles modernes : la jonction entre deux panneaux est conçue de telle sorte qu'aucun pincement de doigt ne soit possible quelle que soit la position du tablier (en cours d'ouverture, fermeture, ou à l'arrêt). La norme EN 12604 impose ce dispositif sur les portes accessibles à des usagers non avertis (ERP, sites tertiaires accueillant du public). Sur les portes industrielles à accès limité aux personnels avertis, l'anti-pince-doigts n'est pas obligatoire mais reste fortement recommandé pour la sécurité personnel.",
    related: ["en-12604"],
    relatedServices: ["fermetures-industrielles"],
  },
  {
    slug: "panneau-sandwich",
    term: "Panneau sandwich (PUR)",
    category: "Composant",
    shortDef: "Panneau composite acier-mousse-acier offrant isolation thermique et résistance mécanique.",
    fullDef:
      "Le panneau sandwich est la structure de base des portes sectionnelles industrielles isolées. Il se compose de 3 couches : une plaque d'acier extérieure (0,5 mm typiquement), un cœur isolant en mousse polyuréthane (PUR) injectée à haute densité (35-45 kg/m³), une plaque d'acier intérieure (0,4 mm). L'épaisseur totale standard varie de 40 à 60 mm. Performance thermique : λ ≈ 0,022 W/mK pour la mousse, soit U ≈ 0,5 W/m².K pour un panneau 40 mm — équivalent à un mur isolé de 10 cm de laine minérale. Le panneau sandwich offre aussi une bonne isolation acoustique (R ≈ 25 dB) et une résistance mécanique élevée. Les versions micro-rainurées (\"stucco\") ou lisses définissent l'aspect extérieur.",
    related: [],
    relatedServices: ["fermetures-industrielles"],
  },
  {
    slug: "motorisation-tubulaire",
    term: "Motorisation tubulaire",
    category: "Composant",
    shortDef: "Moteur intégré dans l'arbre d'enroulement d'une porte sectionnelle légère ou d'un rideau métallique.",
    fullDef:
      "Une motorisation tubulaire est un moteur électrique cylindrique inséré directement à l'intérieur de l'arbre d'enroulement d'un rideau ou d'une porte. Avantages : encombrement minimal (rien de visible à l'extérieur), installation simple, coût modéré. Limites : couple maximum environ 200-400 Nm — adapté aux portes légères (jusqu'à ~150 kg de tablier) ou rideaux résidentiels/commerce. Pour les portes industrielles lourdes (>200 kg), on utilise plutôt une motorisation à arbre (moteur externe relié à l'arbre par chaîne ou courroie) qui offre des couples bien supérieurs (500-2000 Nm).",
    related: [],
    relatedServices: ["fermetures-industrielles", "automatismes"],
  },
  {
    slug: "motorisation-arbre",
    term: "Motorisation à arbre",
    category: "Composant",
    shortDef: "Moteur externe relié à l'arbre d'enroulement par chaîne, courroie ou crémaillère, pour portes industrielles lourdes.",
    fullDef:
      "La motorisation à arbre est utilisée sur les portes sectionnelles industrielles lourdes (tabliers >200 kg) ou à cadence intensive. Le moteur est un bloc externe (généralement triphasé 400V) fixé en haut du linteau ou contre le mur, qui transmet sa force à l'arbre d'enroulement par une chaîne (Hörmann WA 300, Came VER) ou une courroie crantée Kevlar (modèles plus silencieux). Couples disponibles : 500 à 2000 Nm. Avantages : durabilité exceptionnelle (100 000+ cycles), tolérance aux cadences intensives, accès facile pour la maintenance. Limites : bruit (45-55 dB à proximité), encombrement, coût supérieur à la tubulaire (+30-50%).",
    related: ["motorisation-tubulaire"],
    relatedServices: ["fermetures-industrielles", "automatismes"],
  },
  {
    slug: "cellule-photo",
    term: "Cellule photoélectrique",
    category: "Composant",
    shortDef: "Capteur émetteur-récepteur infrarouge détectant un obstacle dans le passage d'une porte motorisée.",
    fullDef:
      "Les cellules photoélectriques (ou \"photocellules\") sont les organes de sécurité essentiels d'une porte motorisée : un émetteur envoie un faisceau infrarouge vers un récepteur, et tout obstacle qui coupe le faisceau déclenche un arrêt immédiat de la fermeture. Elles sont obligatoires selon EN 12453 sur la majorité des portes motorisées accessibles au public. Hauteur standard : 30-50 cm du sol. Sur les portes industrielles à accès véhicules, on installe souvent 2 paires de cellules à hauteurs différentes (30 cm et 70 cm) pour détecter à la fois piétons et véhicules. Durée de vie : 8-12 ans en environnement normal, 5 ans en environnement agressif (poussières, intempéries). Notre stock atelier couvre les principaux modèles : Hörmann RPS/FCS, Crawford, Came Dir, Bft Compact.",
    related: ["en-12453"],
    relatedServices: ["fermetures-industrielles", "automatismes"],
  },
  {
    slug: "boucle-detection",
    term: "Boucle de détection magnétique",
    category: "Composant",
    shortDef: "Capteur enterré sous la voirie qui détecte la présence d'un véhicule métallique.",
    fullDef:
      "Une boucle de détection magnétique est constituée d'un câble électrique enterré dans une saignée de la chaussée, formant un circuit fermé connecté à un détecteur électronique. Le passage d'une masse métallique (véhicule) modifie l'inductance du circuit, ce qui déclenche un signal de détection. Utilisations : ouverture automatique de portail à l'approche d'un véhicule, détection présence pour barrière levante, comptage de cycles, sécurité (interdiction de fermeture si véhicule présent). Avantages : fiable, durable (>15 ans), discret. Limites : nécessite une saignée dans le sol (travaux de génie civil), ne détecte que le métallique (pas piétons ni vélos). Alternative moderne : radar hyperfréquence ou caméra IA.",
    related: [],
    relatedServices: ["portails-clotures", "automatismes"],
  },
  {
    slug: "borne-anti-belier",
    term: "Borne anti-bélier",
    category: "Sécurité",
    shortDef: "Borne escamotable ou fixe conçue pour stopper un véhicule lancé à pleine vitesse.",
    fullDef:
      "Les bornes anti-bélier (ou bollards) protègent un site contre une attaque véhicule (intrusion forcée, terrorisme). Elles existent en version fixe (bornes en acier scellées dans une fondation béton) ou escamotable (rétractables hydrauliquement pour autoriser le passage de certains véhicules). Niveau de protection mesuré selon norme PAS 68 ou IWA 14 : exemple K12 = arrête un poids lourd 7,5 tonnes lancé à 80 km/h. Bornes courantes : Came P3 (PAS 68 K4), Came P5 (K8), Came P9 (K12). Installation requérant un génie civil important (fosse 1.5-2m de profondeur). Maintenance trimestrielle recommandée pour les bornes hydrauliques (vérification niveau d'huile, électrovannes, joints).",
    related: [],
    relatedServices: ["portails-clotures"],
  },
  {
    slug: "atex",
    term: "ATEX (Atmosphères Explosives)",
    category: "Réglementation",
    shortDef: "Réglementation européenne pour les équipements en zones où une atmosphère explosive peut se former.",
    fullDef:
      "ATEX (de l'anglais Atmospheres Explosibles) désigne la réglementation européenne (directives 1999/92/CE et 2014/34/UE) applicable aux équipements installés dans des zones à risque d'explosion : sites pétrochimiques, stations-service, dépôts de carburant, silos agricoles, peinture industrielle, etc. Les zones sont classées 0/1/2 (gaz) ou 20/21/22 (poussières) selon la fréquence et la durée de présence d'atmosphère explosive. Les équipements installés dans ces zones doivent porter le marquage ATEX (Ex) avec catégorie compatible (Ex II 2G, Ex II 2D, etc.). Pour les fermetures (rideaux métalliques en station-service, portes en silo), il existe des modèles spécifiques ATEX avec motorisation antidéflagrante et matériaux non générateurs d'étincelles.",
    related: [],
    relatedServices: ["fermetures-industrielles", "maintenance"],
  },
  {
    slug: "haccp",
    term: "HACCP",
    category: "Réglementation",
    shortDef: "Méthode internationale d'analyse des dangers alimentaires obligatoire en agroalimentaire.",
    fullDef:
      "HACCP (Hazard Analysis Critical Control Point — analyse des dangers et points critiques pour leur maîtrise) est la méthode obligatoire de gestion de la sécurité alimentaire en France et UE depuis le règlement 852/2004. Elle s'applique à toute entreprise du secteur agroalimentaire (production, transformation, distribution, restauration). Pour la métallerie en environnement HACCP (chambres froides, ateliers de production alimentaire, MIN de Rungis), les exigences principales sont : matériaux compatibles contact alimentaire (inox 304 ou 316), absence d'angles vifs ou de zones de rétention de souillures, joints alimentaires, désinfection facile, traçabilité matériaux par certificats. Notre maintenance respecte les protocoles HACCP : passage de blouses propres, désinfection outils entre interventions, traçabilité pièces détachées par lot.",
    related: [],
    relatedServices: ["fermetures-industrielles", "maintenance"],
  },
  {
    slug: "icpe",
    term: "ICPE (Installation Classée pour la Protection de l'Environnement)",
    category: "Réglementation",
    shortDef: "Installation industrielle ou agricole soumise à autorisation préfectorale en raison de ses risques.",
    fullDef:
      "Les ICPE (Installations Classées pour la Protection de l'Environnement) sont des sites industriels ou agricoles présentant des risques (pollution, explosion, incendie, nuisances) et soumis à un régime de déclaration, enregistrement ou autorisation préfectorale. La nomenclature ICPE comprend plusieurs centaines de rubriques (combustibles, déchets, élevage, chimie, etc.). Pour la métallerie sur ces sites, les exigences sont renforcées : conformité ATEX en zones à risque, audits réglementaires, fermetures coupe-feu adaptées au risque incendie, traçabilité des interventions de maintenance. Nos interventions sur sites ICPE incluent systématiquement : déclaration en amont, port d'EPI spécifiques, respect des protocoles d'arrêt machine, signature de PV par le responsable HSE du site.",
    related: ["atex"],
    relatedServices: ["maintenance"],
  },
  {
    slug: "igh",
    term: "IGH (Immeuble de Grande Hauteur)",
    category: "Réglementation",
    shortDef: "Immeuble dont la hauteur dépasse 28m (habitation) ou 50m (autre), soumis à des règles de sécurité strictes.",
    fullDef:
      "Un IGH (Immeuble de Grande Hauteur) est défini par le Code de la construction comme tout bâtiment dont le plancher bas du dernier niveau est situé à plus de 28m du sol (habitation) ou plus de 50m (autres usages). Les IGH sont soumis à un règlement de sécurité spécifique extrêmement strict : compartimentage coupe-feu obligatoire, cellules à risques, sas d'isolement, dispositifs SSI avancés. Pour la métallerie en IGH (tours tertiaires de La Défense par exemple), les fermetures coupe-feu sont nombreuses (chaque cage d'escalier, chaque sas, chaque local technique sensible) et leur maintenance fait l'objet d'audits annuels SSI obligatoires. Nos techniciens habilités IGH respectent les protocoles d'intervention : badge accès, déclaration au PCS (Poste Central de Sécurité), intervention en horaires définis.",
    related: ["en-16034", "ei-60"],
    relatedServices: ["portes-coupe-feu", "maintenance"],
  },
  {
    slug: "porte-rapide",
    term: "Porte rapide souple",
    category: "Composant",
    shortDef: "Porte industrielle à enroulement vertical haute vitesse, en tablier souple PVC armé.",
    fullDef:
      "Les portes rapides souples sont conçues pour des cadences intensives (1000-4000 cycles/jour) sur des sites logistiques, agroalimentaires ou de production. Le tablier est en PVC armé Kevlar de 1-3 mm d'épaisseur, qui s'enroule sur un arbre supérieur. Vitesse d'ouverture : 1 à 3 m/s (vs 0,2-0,5 m/s pour une sectionnelle classique). Modèles courants : Maviflex MaviPro/MaviSafe, Hörmann V 3015/V 4015, Crawford RR300/Eagle. Avantages : flux logistique fluide, étanchéité air thermique, isolation acoustique. Limites : peu d'isolation thermique (sauf modèles isothermes spécifiques), tablier consommable (remplacement tous les 18-36 mois en usage intensif). Maintenance trimestrielle obligatoire au-delà de 1500 cycles/jour.",
    related: ["motorisation-arbre"],
    relatedServices: ["fermetures-industrielles"],
  },
  {
    slug: "rideau-metallique",
    term: "Rideau métallique",
    category: "Composant",
    shortDef: "Fermeture industrielle ou commerciale composée de lames métalliques s'enroulant dans un coffre.",
    fullDef:
      "Le rideau métallique est l'une des solutions de fermeture les plus anciennes et les plus utilisées : un tablier composé de lames d'acier ou d'aluminium qui s'enroulent verticalement dans un coffre supérieur. Lames disponibles : pleines (sécurité maximale, opacité totale), micro-perforées (laissent passer un peu de lumière, idéales pour vitrines), galvanisées (résistance corrosion), laquées (couleur personnalisable). Largeur maximale : 12-15m sans renfort intermédiaire. Motorisation tubulaire pour modèles légers, à arbre pour modèles industriels lourds. Avantages : encombrement plafond minimal, sécurité anti-effraction, durabilité (15-20 ans). Limites : isolation thermique faible, esthétique industrielle. Maintenance préventive semestrielle obligatoire en milieu professionnel.",
    related: ["motorisation-tubulaire"],
    relatedServices: ["fermetures-industrielles"],
  },
  {
    slug: "porte-sectionnelle",
    term: "Porte sectionnelle",
    category: "Composant",
    shortDef: "Porte industrielle ou résidentielle composée de panneaux articulés se repliant horizontalement sous le plafond.",
    fullDef:
      "La porte sectionnelle est aujourd'hui le standard de la fermeture industrielle moderne : un tablier composé de 4-6 panneaux articulés (souvent en panneau sandwich PUR) qui se replient horizontalement sous le plafond grâce à des rails de guidage. Avantages : excellente isolation thermique, design moderne, encombrement libre devant l'ouverture, durabilité 20-25 ans. Limites : nécessite une hauteur sous-plafond suffisante (typiquement +30-50 cm au-dessus de l'ouverture), coût supérieur au rideau métallique. Modèles courants : Hörmann SPU 67/APU F42, Crawford Combi, Novoferm Iso. Motorisation à arbre ou tubulaire selon poids du tablier. Options : vitrages isolants, hublots design, portillon piéton intégré, panneau anti-écrasement, anti-effraction renforcée.",
    related: ["panneau-sandwich", "motorisation-arbre"],
    relatedServices: ["fermetures-industrielles"],
  },
  {
    slug: "niveleur-quai",
    term: "Niveleur de quai",
    category: "Composant",
    shortDef: "Plateforme rétractable comblant la différence de niveau entre quai et camion lors du chargement.",
    fullDef:
      "Le niveleur de quai (ou \"quai niveleur\") est un équipement essentiel des plateformes logistiques : il s'agit d'une plateforme métallique inclinable (pivotant sur un axe horizontal en bord de quai) qui s'abaisse jusqu'au plancher du camion stationné, permettant le passage des chariots élévateurs. Capacités courantes : 60 kN (6 tonnes), 100 kN (10 tonnes). Types : à charnière (le plus courant), télescopique (lèvre escamotable pour chargement à distance), à rampe basculante. Modèles de référence : Crawford DLC, Hörmann ITO, Stertil-Koni. Maintenance critique car panne = quai inutilisable : vérification semestrielle du système hydraulique, des butoirs, des charnières, des sécurités anti-écrasement. Notre contrat Or inclut la maintenance niveleurs de quai (rare sur le marché).",
    related: [],
    relatedServices: ["fermetures-industrielles", "maintenance"],
  },
  {
    slug: "sas-etancheite",
    term: "Sas d'étanchéité (DSC)",
    category: "Composant",
    shortDef: "Cadre souple installé autour d'un quai de chargement pour assurer l'étanchéité avec un camion stationné.",
    fullDef:
      "Le sas d'étanchéité (parfois appelé \"abri de quai\" ou DSC pour Dock Shelter Curtain) est l'équipement complémentaire du niveleur de quai : un cadre souple en jupes textiles (Hypalon, PVC armé) qui vient s'écraser contre les flancs et le toit du camion, créant un sas étanche entre le bâtiment et la remorque. Avantages : isolation thermique (pas de perte de froid en chambre froide), confort opérateurs (pas de vent, pluie, neige), efficacité énergétique (réduit drastiquement la consommation de la cellule de stockage). Modèles : Crawford DSC, Hörmann DTU. Pièces d'usure principale : jupes (déchirées par les chocs poids lourds), rideaux supérieurs, ressorts de rappel. Maintenance trimestrielle recommandée sur sites à fort flux PL.",
    related: ["niveleur-quai"],
    relatedServices: ["fermetures-industrielles", "maintenance"],
  },
  {
    slug: "inox-304-316",
    term: "Inox 304 / 316",
    category: "Composant",
    shortDef: "Aciers inoxydables austénitiques utilisés en métallerie pour résistance à la corrosion.",
    fullDef:
      "L'inox 304 (X5CrNi18-10) est l'inox le plus courant en métallerie : composition 18% chrome + 8% nickel, excellente résistance à la corrosion atmosphérique et aux acides faibles. Utilisations : agroalimentaire général, mobilier urbain, garde-corps, ferronnerie d'art. L'inox 316 (X5CrNiMo17-12-2) ajoute 2-3% de molybdène, ce qui améliore considérablement la résistance à la corrosion par les chlorures (eau de mer, sels). Utilisations : milieu marin, piscines, agroalimentaire avec produits chlorés (charcuterie, fromage), industries chimiques. Coût : inox 316 environ +25% vs 304. En métallerie B2B, on utilise majoritairement le 304 sauf cas spécifique justifiant le 316.",
    related: ["haccp"],
    relatedServices: ["menuiserie-metallique", "structures-metalliques"],
  },
  {
    slug: "galvanisation",
    term: "Galvanisation à chaud",
    category: "Méthode",
    shortDef: "Procédé d'immersion de l'acier dans un bain de zinc fondu pour former une couche protectrice anti-corrosion.",
    fullDef:
      "La galvanisation à chaud (norme NF EN ISO 1461) consiste à immerger des pièces en acier dans un bain de zinc fondu à 450°C, créant un revêtement métallurgique de zinc adhérent. Avantages : protection anti-corrosion durable (40-100 ans selon environnement), excellente résistance mécanique, traitement intégral des pièces (intérieur des tubes, soudures, angles). Épaisseur moyenne du revêtement : 60-150 µm selon épaisseur des pièces (plus la pièce est épaisse, plus le revêtement est épais). Limites : aspect visuel \"industriel\" (cristaux de zinc visibles), nécessite un bain assez grand pour les grandes pièces (limite 12-15m de longueur typique chez les galvaniseurs français). Toutes nos pièces de structure sont galvanisées par un partenaire certifié, sauf cas d'usage intérieur sec où une peinture epoxy suffit.",
    related: [],
    relatedServices: ["structures-metalliques", "portails-clotures"],
  },
  {
    slug: "soudure-mag",
    term: "Soudure MAG",
    category: "Méthode",
    shortDef: "Procédé de soudage à l'arc électrique sous protection gazeuse active (CO2 ou Argon+CO2).",
    fullDef:
      "Le procédé MAG (Metal Active Gas, ou GMAW selon la norme américaine) est le procédé de soudage le plus utilisé en métallerie B2B : un fil d'apport en acier est dévidé continuellement à travers une torche, et un arc électrique fait fondre le fil ainsi que le métal de base, le tout sous protection d'un gaz actif (CO2 pur ou mélange Argon-CO2 selon nuance acier). Avantages : haute productivité, qualité de soudure constante, polyvalence (acier au carbone, faiblement allié). Adapté aux épaisseurs 1-20 mm. Variantes : MAG-S (gaz CO2 pour aciers courants), MAG-C (mélange Argon+CO2 pour qualité supérieure), MAG fil fourré (sans gaz, pour chantier). Tous nos soudeurs sont qualifiés MAG selon EN ISO 9606 — qualifications mises à jour tous les 2-3 ans.",
    related: ["wpqr", "soudure-tig"],
    relatedServices: ["structures-metalliques"],
  },
  {
    slug: "soudure-tig",
    term: "Soudure TIG",
    category: "Méthode",
    shortDef: "Procédé de soudage à l'arc électrode tungstène sous protection de gaz inerte (Argon).",
    fullDef:
      "Le procédé TIG (Tungsten Inert Gas, ou GTAW) utilise une électrode non fusible en tungstène sous protection d'argon. Le métal d'apport est ajouté manuellement par l'opérateur via une baguette. Avantages : qualité de soudure exceptionnelle (aspect, étanchéité), précision sur faibles épaisseurs (0.5-5 mm), idéal pour inox et aluminium. Limites : productivité plus faible que MAG (3-5x plus lent), demande des soudeurs très qualifiés. En métallerie B2B, le TIG est utilisé sur : ferronnerie d'art, garde-corps inox, cuves agroalimentaires, ouvrages où l'esthétique de la soudure compte. Nos soudeurs TIG qualifiés EN ISO 9606 réalisent les ouvrages exigeants en finition inox.",
    related: ["wpqr", "soudure-mag"],
    relatedServices: ["menuiserie-metallique", "structures-metalliques"],
  },
  {
    slug: "garde-corps",
    term: "Garde-corps",
    category: "Composant",
    shortDef: "Élément de protection vertical empêchant la chute des personnes en bord de vide.",
    fullDef:
      "Le garde-corps est un dispositif de protection collective imposé en bord de tout vide à plus de 1m de hauteur (escalier, mezzanine, terrasse, balcon). Norme française NF P01-012 : hauteur minimale 1m, charge horizontale résistible 60 daN/ml en privé (170 daN/ml en ERP), barreaudage vertical avec espacement <11 cm (anti-escalade enfants). Matériaux courants : acier galvanisé peint, acier laqué, aluminium, inox, verre feuilleté. Pour les ERP recevant des enfants, des règles renforcées s'appliquent (hauteur >1.20m, anti-escalade strict). En milieu industriel, la norme NF E85-015 régit les garde-corps techniques (mezzanines de production, passerelles).",
    related: ["inox-304-316"],
    relatedServices: ["menuiserie-metallique", "structures-metalliques"],
  },
  {
    slug: "auvent-metallique",
    term: "Auvent métallique",
    category: "Composant",
    shortDef: "Toiture en surplomb à structure métallique protégeant une entrée ou une zone extérieure.",
    fullDef:
      "L'auvent métallique est une toiture débordante (sans appui au sol côté extérieur) protégeant une entrée de bâtiment, un quai de chargement, une terrasse. Structure : poutres métalliques en porte-à-faux ou suspendues par tirants. Couverture : tôle ondulée, plaques polycarbonate, verre feuilleté trempé, panneaux composites. Dimensionnement Eurocode 1 (charges de neige selon zone) + Eurocode 3 (acier). Les auvents grande dimension (>5m de débord) nécessitent une note de calcul stabilité au vent. Application B2B : entrée principale tertiaire, quai de chargement protégé, zone fumeurs.",
    related: ["eurocode-3"],
    relatedServices: ["structures-metalliques", "menuiserie-metallique"],
  },
  {
    slug: "cles-organigrammees",
    term: "Clés organigrammées",
    category: "Composant",
    shortDef: "Système de clés permettant à une seule clé d'ouvrir plusieurs serrures selon une hiérarchie définie.",
    fullDef:
      "Un organigramme de clés est une organisation hiérarchique permettant à une clé maîtresse d'ouvrir un ensemble de serrures, à des clés intermédiaires d'ouvrir des sous-ensembles, et à des clés individuelles de n'ouvrir que leur serrure dédiée. Très utilisé en B2B pour bâtiments tertiaires : la clé du DG ouvre tout, la clé d'un chef de service ouvre tous les bureaux de son service, chaque collaborateur n'a que sa clé personnelle. Conception sur plan, avec carte de propriété pour reproduction sécurisée des clés. Marques de référence : Vachette, Bricard, Heracles, Mul-T-Lock. Une refonte d'organigramme (suite à perte clé maîtresse) implique le remplacement de TOUS les cylindres — d'où l'importance de bien conserver les clés maîtresses.",
    related: [],
    relatedServices: ["menuiserie-metallique"],
  },
  {
    slug: "verrouillage-electromecanique",
    term: "Verrouillage électromécanique",
    category: "Composant",
    shortDef: "Serrure à pêne motorisée commandée électriquement pour contrôle d'accès.",
    fullDef:
      "Un verrouillage électromécanique est une serrure dont le pêne est commandé par un moteur électrique, ce qui permet son déverrouillage à distance via badge, code, lecteur biométrique ou bouton-poussoir. Types principaux : ventouses électromagnétiques (200-500 kg de force, fail-safe = ouvre en cas de coupure), serrures motorisées (gâche électrique avec sortie tournante), serrures à pêne dormant motorisé (plus sécurisé, fail-secure = reste fermé en cas de coupure). En contrôle d'accès B2B, on combine généralement avec un lecteur RFID (badge) et une centrale d'accès qui gère les droits par utilisateur et par horaire. Fail-safe pour les ERP (issue de secours), fail-secure pour les locaux sensibles (serveurs, archives).",
    related: ["fail-safe-fail-secure"],
    relatedServices: ["menuiserie-metallique", "automatismes"],
  },
  {
    slug: "fail-safe-fail-secure",
    term: "Fail-safe / Fail-secure",
    category: "Sécurité",
    shortDef: "Comportement d'une serrure électrique en cas de coupure de courant : ouverte (fail-safe) ou fermée (fail-secure).",
    fullDef:
      "Fail-safe et fail-secure définissent le comportement par défaut d'une serrure électrique en cas de coupure d'alimentation. Fail-safe (sécurité positive) : la serrure s'ouvre automatiquement en cas de coupure — utilisé pour les issues de secours, où la priorité est la sortie en cas d'incendie. Fail-secure (sécurité négative) : la serrure reste verrouillée en cas de coupure — utilisé pour les locaux sensibles (serveurs, coffres, archives) où la priorité est la sécurité physique des biens. Le choix dépend du contexte : un ERP doit être en fail-safe sur les chemins d'évacuation (réglementation incendie), tandis qu'un local serveur doit être en fail-secure (politique de sécurité IT). Tout système électronique d'accès doit être doublé d'un système mécanique de secours.",
    related: ["verrouillage-electromecanique"],
    relatedServices: ["menuiserie-metallique"],
  },
  {
    slug: "porte-blindee",
    term: "Porte blindée",
    category: "Composant",
    shortDef: "Porte renforcée certifiée résistant aux tentatives d'effraction selon une classification A2P ou EN 1627.",
    fullDef:
      "Une porte blindée est conçue pour résister aux tentatives d'effraction : ouvrant en acier renforcé (3-4 mm d'épaisseur), serrure multipoints (3 à 7 points), cylindre haute sécurité, dormant renforcé scellé dans la maçonnerie. Classifications : A2P (norme française, niveaux BP1 / BP2 / BP3 selon temps de résistance), EN 1627 (norme européenne, classes RC1 à RC6). En B2B, les portes blindées sont utilisées pour : locaux serveurs / archives, postes de transformation EDF, coffres entreprises, locaux sensibles. Le marquage A2P ou RC est obligatoire pour la couverture d'assurance vol. Fournisseurs principaux : Fichet, Picard, Vachette, Bricard.",
    related: [],
    relatedServices: ["menuiserie-metallique"],
  },
  {
    slug: "menuiserie-metallique",
    term: "Menuiserie métallique",
    category: "Technique",
    shortDef: "Ensemble des ouvrages métalliques de finition d'un bâtiment : portes, fenêtres, garde-corps, vérandas.",
    fullDef:
      "La menuiserie métallique regroupe l'ensemble des ouvrages métalliques de finition d'un bâtiment, par opposition à la grosse œuvre (charpente). Cela inclut : portes intérieures et extérieures (vitrées, pleines, blindées), fenêtres et baies, vérandas, garde-corps, mains courantes, vitrines, façades légères. Matériaux : acier (robustesse, économie), aluminium (légèreté, élégance, durée de vie), inox (haut de gamme, milieux corrosifs). Profilés courants : Schüco, Technal, Wicona pour aluminium ; Jansen, Forster pour acier (notamment coupe-feu). Notre activité menuiserie métallique chez IEF & CO porte principalement sur les portes professionnelles, vitrines commerciales, garde-corps tertiaires et clôtures architecturales.",
    related: ["inox-304-316", "garde-corps"],
    relatedServices: ["menuiserie-metallique"],
  },
  {
    slug: "ferronnerie",
    term: "Ferronnerie d'art",
    category: "Technique",
    shortDef: "Travail artistique du fer forgé pour créer grilles, rampes d'escalier, balcons et éléments décoratifs.",
    fullDef:
      "La ferronnerie d'art est le travail artistique du fer (et plus largement de l'acier) pour créer des ouvrages décoratifs ou architecturaux : grilles, rampes d'escalier, balcons, marquises, enseignes, garde-corps, portails ouvragés. Techniques traditionnelles : forge à chaud, repoussage, ciselure, soudure à l'arc. La ferronnerie d'art est particulièrement présente dans la restauration de bâtiments anciens (immeubles haussmanniens, hôtels particuliers, monuments historiques). En zone classée Architecte des Bâtiments de France (ABF), les ouvrages de ferronnerie doivent respecter le caractère historique du bâtiment — les plans et matériaux sont validés par l'ABF avant réalisation. IEF & CO réalise des ouvrages de ferronnerie sur mesure pour la restauration patrimoniale parisienne et versaillaise.",
    related: [],
    relatedServices: ["menuiserie-metallique"],
  },
  {
    slug: "controles-acces",
    term: "Contrôle d'accès",
    category: "Technique",
    shortDef: "Système électronique gérant les autorisations d'accès aux locaux d'un bâtiment ou d'un site.",
    fullDef:
      "Un système de contrôle d'accès est un dispositif électronique qui filtre l'entrée à un bâtiment ou à des zones spécifiques, en identifiant chaque utilisateur et en vérifiant ses droits d'accès. Composants : lecteurs (badge RFID, code clavier, biométrie empreinte/visage, smartphone NFC), serrures électromécaniques, centrale d'accès (logiciel de gestion des droits), réseau de communication (filaire ou IP). Fonctionnalités courantes : gestion par utilisateur et par horaire, traçabilité des entrées (qui est entré quand), alarmes en cas d'accès non autorisé, intégration avec système d'alarme intrusion. Applications B2B : sièges sociaux, sites industriels, parkings, copropriétés, sites sensibles. Marques : Came (KMS), Vauban (Aiphone), TIL Technologies, Nedap, Suprema.",
    related: ["verrouillage-electromecanique"],
    relatedServices: ["automatismes"],
  },
  {
    slug: "barriere-levante",
    term: "Barrière levante automatique",
    category: "Composant",
    shortDef: "Lisse pivotante motorisée régulant l'accès véhicules à un parking ou un site.",
    fullDef:
      "Une barrière levante automatique est composée d'une lisse horizontale (3 à 6m typiquement) qui pivote autour d'un axe vertical pour autoriser ou interdire le passage de véhicules. Motorisation électrique avec ressort de compensation (équilibrant le poids de la lisse). Fréquence d'usage : jusqu'à 1 cycle/seconde pour les modèles industriels intensifs (péages). Sécurités : photocellules, boucles de détection présence (interdit la fermeture si véhicule sous la lisse). Applications B2B : parkings publics et privés, contrôle accès sites industriels, péages, parkings d'entreprise. Marques de référence : Came (G2080, G4040, G6500), Faac, Bft, Nice. Maintenance semestrielle obligatoire (vérification ressort, lisse, électromécanique).",
    related: ["controles-acces", "boucle-detection"],
    relatedServices: ["portails-clotures", "automatismes"],
  },
  {
    slug: "portail-coulissant",
    term: "Portail coulissant",
    category: "Composant",
    shortDef: "Portail dont le vantail se déplace horizontalement le long d'un rail.",
    fullDef:
      "Un portail coulissant est un portail à vantail unique qui se déplace horizontalement, soit sur un rail au sol (modèle traditionnel sur rail), soit en porte-à-faux (modèle autoportant, plus moderne). Avantages : aucun encombrement vers l'intérieur ni vers l'extérieur, idéal pour terrains en pente ou avec voirie devant l'entrée, ouverture rapide. Largeur d'ouverture : jusqu'à 12m sur rail, 8-10m en autoportant. Motorisation à pignon-crémaillère (le pignon du moteur engrène une crémaillère fixée sur le portail). Marques : Came (BX-A pour 800kg, BKS pour 1800kg), Bft, Faac. Maintenance semestrielle : nettoyage rail, graissage roulements, vérification crémaillère et pignon, contrôle moteur et armoire.",
    related: ["motorisation-arbre"],
    relatedServices: ["portails-clotures", "automatismes"],
  },
  {
    slug: "portail-battant",
    term: "Portail battant",
    category: "Composant",
    shortDef: "Portail à 1 ou 2 vantaux pivotant sur des gonds verticaux.",
    fullDef:
      "Un portail battant est un portail à vantaux pivotant sur des gonds verticaux (comme une porte d'intérieur, mais à grande échelle). Configurations : 1 vantail (ouverture maxi 3m), 2 vantaux (ouverture maxi 7m). Motorisation : à bras articulés (Came FAST), à vérins (Came AXI), enterrée (Came AXO — moteur invisible enfoui dans le sol). Avantages : esthétique classique, coût modéré. Limites : nécessite un dégagement libre vers l'intérieur (ou l'extérieur pour les modèles à ouverture inversée), ne convient pas aux entrées très sollicitées (cycles longs : 15-20 secondes pour ouverture complète). Maintenance : graissage gonds annuel, vérification couples moteur, ajustement butées.",
    related: ["portail-coulissant"],
    relatedServices: ["portails-clotures", "automatismes"],
  },
  {
    slug: "depannage-24h",
    term: "Dépannage 24/7",
    category: "Méthode",
    shortDef: "Service d'intervention d'urgence disponible 24 heures sur 24, 7 jours sur 7.",
    fullDef:
      "Le dépannage 24/7 (24 heures sur 24, 7 jours sur 7) est un service d'astreinte permettant à un client professionnel de bénéficier d'une intervention en dehors des heures ouvrées normales (nuit, week-end, jours fériés). C'est une option premium réservée aux contrats de maintenance haut de gamme (notre contrat Or chez IEF & CO inclut l'astreinte 24/7). Fonctionnement : numéro d'urgence dédié, technicien d'astreinte joignable en moins de 15 minutes, intervention sur site dans le délai contractuel (4h pour notre contrat Or). Coût : majoration des heures de nuit/week-end (+50 à +100% selon plage horaire). Pour les sites critiques (logistique e-commerce, agroalimentaire, hospitalier), le 24/7 est souvent indispensable.",
    related: [],
    relatedServices: ["maintenance"],
  },
  {
    slug: "audit-parc",
    term: "Audit de parc",
    category: "Méthode",
    shortDef: "Inventaire complet et évaluation technique de l'ensemble des fermetures d'un site ou d'un groupe de sites.",
    fullDef:
      "Un audit de parc est une prestation consistant à faire l'inventaire exhaustif et l'évaluation technique de toutes les fermetures (portes, portails, rideaux, coupe-feu) d'un site ou d'un ensemble de sites. Livrables typiques : tableau de bord par équipement (marque, modèle, année, état, conformité), photos par équipement, recommandations priorisées (urgent / 6 mois / 12 mois), estimation financière des travaux à prévoir, plan pluriannuel d'entretien. Utilité pour le client : visibilité complète sur l'état de son parc, anticipation budgétaire, justification CAPEX, transmission éventuelle (cession, fusion). IEF & CO réalise gratuitement un audit de parc à la signature de tout nouveau contrat de maintenance, et inclut un audit annuel dans le contrat Or.",
    related: [],
    relatedServices: ["maintenance"],
  },
  {
    slug: "carnet-entretien",
    term: "Carnet d'entretien",
    category: "Méthode",
    shortDef: "Document obligatoire enregistrant toutes les interventions de maintenance sur les portes automatiques.",
    fullDef:
      "Le carnet d'entretien est un document légalement obligatoire (arrêté du 21 décembre 1993) pour toute porte automatique en milieu professionnel. Il enregistre chronologiquement chaque intervention de maintenance : date, intervenant, opérations réalisées, pièces remplacées, observations. Format : papier traditionnel (jaunissement et perte fréquents) ou numérique (notre solution depuis 2023, avec accès web client). Le carnet doit être consultable par l'inspection du travail en cas de contrôle. Notre carnet numérique IEF & CO permet : consultation en ligne 24/7, alerte automatique avant prochaine maintenance, export PDF pour audits, photos par intervention, historique 10 ans conservé.",
    related: ["arrete-21-12-1993"],
    relatedServices: ["maintenance"],
  },
  {
    slug: "u-value",
    term: "Coefficient U (transmission thermique)",
    category: "Technique",
    shortDef: "Mesure de la déperdition thermique d'un élément de construction, en W/m².K.",
    fullDef:
      "Le coefficient U (transmission thermique) mesure la quantité de chaleur traversant 1 m² d'un élément de construction par degré de différence entre les deux côtés. Unité : W/m².K. Plus U est faible, meilleure est l'isolation. Exemples typiques pour des portes industrielles : porte sectionnelle panneau sandwich 40 mm = U ≈ 1.0 W/m².K, porte isothermique 80 mm = U ≈ 0.5 W/m².K, rideau métallique non isolé = U > 5 W/m².K. La RE 2020 et les exigences de performance énergétique BBC imposent des valeurs U de plus en plus strictes. Pour une porte d'entrepôt logistique de 4×4 m = 16 m² de surface, passer de U=5 (rideau standard) à U=1 (sectionnelle isolée) économise environ 4-6 kWh/m²/an de chauffage, soit potentiellement 50-100 € par porte et par an.",
    related: ["panneau-sandwich"],
    relatedServices: ["fermetures-industrielles"],
  },
  {
    slug: "eurocodes",
    term: "Eurocodes",
    category: "Norme",
    shortDef: "Ensemble de normes européennes pour le calcul et le dimensionnement des structures de bâtiment et d'ouvrages d'art.",
    fullDef:
      "Les Eurocodes (NF EN 1990 à NF EN 1999) sont l'ensemble des normes européennes harmonisées de calcul des structures. Ils couvrent : Eurocode 0 (bases de calcul), Eurocode 1 (actions sur les structures : poids, vent, neige, séisme), Eurocode 2 (béton armé), Eurocode 3 (acier), Eurocode 4 (mixte acier-béton), Eurocode 5 (bois), Eurocode 6 (maçonnerie), Eurocode 7 (géotechnique), Eurocode 8 (parasismique), Eurocode 9 (aluminium). Toute structure neuve construite en Europe doit être dimensionnée selon les Eurocodes (avec les annexes nationales spécifiques à chaque pays). Pour la métallerie B2B, l'Eurocode 3 est central (acier) avec influence forte de l'Eurocode 1 (charges) et de l'Eurocode 8 (parasismique en zones concernées).",
    related: ["eurocode-3", "en-1090"],
    relatedServices: ["structures-metalliques"],
  },
  {
    slug: "certificat-3-1",
    term: "Certificat matière 3.1",
    category: "Méthode",
    shortDef: "Document attestant la composition et les caractéristiques mécaniques d'un lot d'acier, conforme à EN 10204.",
    fullDef:
      "Un certificat matière 3.1 (selon norme EN 10204) est un document délivré par le fabricant d'acier (laminoir) attestant la composition chimique et les caractéristiques mécaniques (limite d'élasticité, résistance à la traction, allongement) d'un lot précis d'acier. Le 3.1 est signé par un agent qualifié indépendant du service de production. Il est obligatoire pour les ouvrages soumis à EN 1090 (structures métalliques), pour permettre la traçabilité matière et garantir la qualité de l'ouvrage. Distinction : 2.1 (déclaration simple), 2.2 (avec essais sur production), 3.1 (essais spécifiques + signature qualité indépendante), 3.2 (3.1 + signature client). Tous nos approvisionnements acier IEF & CO sont sourcés en 3.1 minimum, et archivés numériquement par numéro de lot pour traçabilité 10 ans.",
    related: ["en-1090", "doe"],
    relatedServices: ["structures-metalliques"],
  },
  {
    slug: "decennale",
    term: "Garantie décennale",
    category: "Réglementation",
    shortDef: "Garantie obligatoire couvrant 10 ans la solidité d'un ouvrage de construction et son adaptation à sa destination.",
    fullDef:
      "La garantie décennale est une obligation légale française (articles 1792 et suivants du Code civil) : tout constructeur d'ouvrage est responsable pendant 10 ans après réception des travaux des dommages compromettant la solidité de l'ouvrage ou le rendant impropre à sa destination. Elle s'applique aux structures métalliques, aux portes industrielles, aux ouvrages de menuiserie métallique du bâtiment. Toute entreprise du bâtiment doit souscrire une assurance décennale (RC Décennale) avant tout chantier. L'attestation d'assurance décennale doit être remise au client. IEF & CO dispose d'une RC Décennale couvrant l'ensemble de nos activités métallerie, attestation à jour disponible sur simple demande.",
    related: [],
    relatedServices: ["structures-metalliques", "menuiserie-metallique"],
  },
  {
    slug: "rgpd",
    term: "RGPD (Règlement Général sur la Protection des Données)",
    category: "Réglementation",
    shortDef: "Règlement européen 2018 protégeant les données personnelles des utilisateurs.",
    fullDef:
      "Le RGPD (Règlement Général sur la Protection des Données — Règlement UE 2016/679) est entré en application le 25 mai 2018. Il impose à toute organisation qui traite des données personnelles des résidents européens : information claire des personnes concernées, base légale du traitement, droit d'accès / rectification / suppression / portabilité, registre des traitements, désignation d'un DPO si applicable, notification de violation sous 72h. Pour la métallerie B2B, le RGPD s'applique principalement aux contacts clients (formulaires devis, fichiers commerciaux), aux salariés, et aux interventions chez le client (qui peut nécessiter accès à des données du client). IEF & CO dispose d'une politique de confidentialité publiée et conserve les données de prospection commerciale conformément aux durées légales.",
    related: [],
    relatedServices: [],
  },
];

export function getTermBySlug(slug: string): GlossaryTerm | undefined {
  return glossary.find((t) => t.slug === slug);
}

export function getTermsByCategory(): Record<string, GlossaryTerm[]> {
  return glossary.reduce<Record<string, GlossaryTerm[]>>((acc, t) => {
    if (!acc[t.category]) acc[t.category] = [];
    acc[t.category].push(t);
    return acc;
  }, {});
}
