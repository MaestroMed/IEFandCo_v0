/**
 * Services de dépannage urgent — base SEO Phase B.
 *
 * Croisés avec les 8 zones d'Île-de-France, on génère 40 pages combo
 * du type /depannage/porte-sectionnelle/paris capturant le gros des
 * recherches "dépannage X ville/département" en long-tail.
 */

export interface DepannageService {
  slug: string;
  /** Nom court pour l'URL (kebab-case) */
  label: string;
  /** Titre long */
  title: string;
  /** Tagline pour hero */
  tagline: string;
  /** Description de l'intervention (200-300 mots) */
  intro: string;
  /** Pannes les plus fréquentes sur ce type d'équipement */
  commonFailures: { title: string; symptom: string; fix: string; avgDuration: string }[];
  /** Marques supportées */
  brands: string[];
  /** Pièces détachées en stock atelier */
  partsInStock: string[];
  /** Indicateur d'urgence : quels impacts business quand l'équipement tombe */
  businessImpact: string;
  /** Les services connexes IEF & CO (slugs services principaux) */
  relatedServices: string[];
  /** Accent color pour le branding de la page */
  accentColor: string;
  /** SEO meta */
  seo: { title: string; description: string };
}

export const depannageServices: DepannageService[] = [
  {
    slug: "porte-sectionnelle",
    label: "Porte sectionnelle",
    title: "Dépannage porte sectionnelle industrielle",
    tagline: "Votre quai de chargement est immobilisé ? Intervention d'urgence sous SLA",
    intro:
      "Une porte sectionnelle industrielle en panne peut paralyser toute une activité logistique : camions bloqués à quai, chaîne de chargement stoppée, perte de chaîne du froid en entrepôt climatisé, non-conformité réglementaire en ERP. IEF & CO intervient en urgence sur l'ensemble des portes sectionnelles industrielles — toutes marques confondues (Hörmann SPU/APU, Crawford Combi, Novoferm, Breda, MaviPro, Novoport) — avec un stock permanent de pièces détachées pour résolution au premier passage dans 90% des cas. Notre expertise couvre les diagnostics rapides (motorisation HS, ressort de torsion cassé, carte électronique défaillante, câble de levage rompu, photocellule de sécurité défectueuse) et la remise en service dans les délais contractuels. Pour les sites hors contrat, nous intervenons au meilleur délai disponible selon la distance et l'heure d'appel.",
    commonFailures: [
      { title: "Ressort de torsion cassé", symptom: "Porte qui chute brutalement ou ne tient pas en position ouverte", fix: "Remplacement du ressort avec dimensionnement précis selon poids tablier", avgDuration: "2-3h" },
      { title: "Câble de levage rompu", symptom: "Tablier qui part en biais, bruit métallique, porte bloquée", fix: "Remplacement du câble galvanisé avec retension et vérification de l'équilibrage", avgDuration: "1-2h" },
      { title: "Carte motorisation HS", symptom: "Porte qui ne répond plus à la télécommande, code erreur écran", fix: "Diagnostic + remplacement carte mère (stock Hörmann SupraMatic, Crawford, Came)", avgDuration: "1-2h" },
      { title: "Photocellule de sécurité défaillante", symptom: "Porte qui ne se ferme plus, signal d'erreur cellule", fix: "Remplacement cellules émetteur-récepteur + recalibrage", avgDuration: "45min" },
      { title: "Panneau déformé après choc poids lourd", symptom: "Tablier qui frotte, blocage en cours de descente", fix: "Redressage ou remplacement du panneau impacté, vérification guides verticaux", avgDuration: "3-4h" },
    ],
    brands: ["Hörmann", "Crawford / ASSA ABLOY", "Novoferm", "Breda", "Ryterna", "Novoport"],
    partsInStock: [
      "Ressorts de torsion toutes dimensions",
      "Câbles galvanisés Ø 4 / Ø 6 / Ø 8",
      "Cartes mère Hörmann SupraMatic E/P/H",
      "Cartes Crawford Combi 442",
      "Cellules RPS / FCS / génériques",
      "Panneaux sandwich 40/60 mm (tailles courantes)",
      "Guides verticaux & roulements",
      "Motorisations complètes WA 300 / SupraMatic",
    ],
    businessImpact:
      "Coût moyen d'une journée d'arrêt : 800 à 1500 € par porte sur un site logistique (camions immobilisés, retard livraison, pénalités, heures supplémentaires). Sur un entrepôt frigorifique, ajouter la perte éventuelle de marchandise (chaîne du froid rompue).",
    relatedServices: ["fermetures-industrielles", "maintenance"],
    accentColor: "59, 130, 180",
    seo: {
      title: "Dépannage porte sectionnelle industrielle — intervention urgente",
      description: "Dépannage d'urgence porte sectionnelle industrielle : ressort, câble, motorisation, panneau. Toutes marques Hörmann, Crawford, Novoferm. Stock pièces permanent.",
    },
  },

  {
    slug: "rideau-metallique",
    label: "Rideau métallique",
    title: "Dépannage rideau métallique professionnel",
    tagline: "Commerce bloqué ? Site industriel non sécurisé ? Intervention rapide.",
    intro:
      "Un rideau métallique bloqué — ouvert ou fermé — crée un risque sécurité immédiat : commerce ne pouvant plus ouvrir, site industriel impossible à sécuriser en fin de journée, perte de confiance assurance vol en cas de tentative d'effraction. IEF & CO intervient en urgence sur les rideaux métalliques à lames pleines, à lames micro-perforées, à tablier ajouré, grilles articulées et rideaux galandages. Notre stock couvre les motorisations tubulaires et à arbre des principales marques (Nice, Came, Faac, La Toulousaine, Somfy, Bft). Le diagnostic sur site couvre : moteur HS, cassure de bandeau, dérouleur bloqué, serrure de condamnation défaillante, panne électrique du coffret de commande. La plupart des interventions sont résolues au premier passage grâce à notre stock rotatif de pièces principales.",
    commonFailures: [
      { title: "Motorisation tubulaire HS", symptom: "Rideau qui ne remonte plus, bruit anormal moteur, mise en sécurité", fix: "Remplacement moteur tubulaire adapté au tablier (diamètre arbre, couple, course)", avgDuration: "2-3h" },
      { title: "Lame cassée ou déformée", symptom: "Tablier qui coince à l'enroulement, accrochages dans les guides", fix: "Remplacement lame(s) concernée(s), réglage tension tablier", avgDuration: "2h" },
      { title: "Sangle de sécurité rompue", symptom: "Rideau manuel qui ne se déroule plus correctement", fix: "Remplacement sangle + crochet d'accrochage", avgDuration: "1h" },
      { title: "Coffret de commande en défaut", symptom: "Tableau mort, disjoncteur qui saute systématiquement", fix: "Diagnostic électrique + remplacement coffret ou composant défaillant", avgDuration: "2h" },
      { title: "Serrure de condamnation bloquée", symptom: "Clé qui ne tourne plus, cylindre grippé", fix: "Dégrippage, remplacement cylindre ou pêne si nécessaire", avgDuration: "1-2h" },
    ],
    brands: ["La Toulousaine", "Somfy", "Nice", "Came", "Faac", "Bft", "Astyrian"],
    partsInStock: [
      "Moteurs tubulaires Ø 45 / Ø 59 / Ø 70",
      "Lames acier 80-120 mm (pleines / ajourées)",
      "Sangles de sécurité 18/22/30 mm",
      "Coffrets de commande filaire & radio",
      "Émetteurs radio Somfy / Nice / Came",
      "Cylindres européens 30/30 / 40/40",
      "Jambages et coulisses acier",
    ],
    businessImpact:
      "Commerce fermé = perte de chiffre d'affaires directe. Site industriel non sécurisé la nuit = risque de sinistre couvrable par l'assurance uniquement sous conditions de maintenance à jour. Un rideau HS en heure de fermeture est une urgence absolue.",
    relatedServices: ["fermetures-industrielles", "maintenance"],
    accentColor: "166, 124, 82",
    seo: {
      title: "Dépannage rideau métallique — urgence commerce & industrie",
      description: "Dépannage urgent rideau métallique (moteur, lame, sangle, coffret). Toutes marques La Toulousaine, Somfy, Nice, Came. Stock pièces permanent.",
    },
  },

  {
    slug: "portail-automatique",
    label: "Portail automatique",
    title: "Dépannage portail automatique",
    tagline: "Copropriété bloquée ? Site sans accès véhicule ? Intervention 24/7.",
    intro:
      "Un portail automatique en panne dans une copropriété ou sur un site professionnel bloque instantanément plusieurs dizaines à plusieurs centaines de véhicules. L'urgence est absolue. IEF & CO intervient sur tous les types de portails motorisés : coulissant (sur rail ou autoportant), battant (bras articulés, vérins, enterré), ainsi que les barrières levantes et bornes anti-bélier. Nos techniciens spécialisés automatismes sont formés sur les principales marques du marché (Came, Faac, Bft, Nice, Ditec) avec un stock pièces adapté à la diversité des parcs IDF. Le diagnostic couvre le moteur, l'armoire de commande, les fins de course, les photocellules, les encodeurs, les émetteurs radio et les dispositifs de sécurité. Nous garantissons une reprise de service rapide pour éviter les plaintes copropriétaires ou l'arrêt logistique.",
    commonFailures: [
      { title: "Moteur en sécurité (portail coulissant)", symptom: "Portail qui s'arrête en milieu de cycle, voyant erreur armoire", fix: "Diagnostic fin de course, encodeur, condensateur. Remplacement du composant défaillant", avgDuration: "2h" },
      { title: "Émetteur radio non reconnu", symptom: "Bip qui ne commande plus le portail, multiples bips en défaut", fix: "Reprogrammation récepteur, remplacement pile ou émetteur", avgDuration: "30min-1h" },
      { title: "Bras articulé bloqué ou déformé", symptom: "Portail battant qui ne s'ouvre plus, bruit d'effort moteur", fix: "Remplacement bras (Faac/Came) + réglage butées et couple", avgDuration: "3h" },
      { title: "Photocellule de passage HS", symptom: "Portail qui s'arrête et se réouvre sans obstacle visible", fix: "Diagnostic photocellules émetteur-récepteur, remplacement + alignement", avgDuration: "1h" },
      { title: "Armoire de commande noyée", symptom: "Après orage, portail mort, fusible qui saute", fix: "Remplacement armoire + test installation électrique + parafoudre préventif", avgDuration: "4h" },
    ],
    brands: ["Came", "Faac", "Bft", "Nice", "Ditec", "Somfy Pro"],
    partsInStock: [
      "Moteurs Came BX-A / BKS / FAST / AXO",
      "Armoires de commande ZBX / ZA3 / ZL19",
      "Photocellules Dir / Deir / Compact",
      "Émetteurs Came TOP / TWIN",
      "Bras articulés Faac 412 / Came ATI",
      "Condensateurs (toutes valeurs)",
      "Encodeurs et fins de course",
      "Cartes parafoudre et protections électriques",
    ],
    businessImpact:
      "Copropriété : plaintes quasi-immédiates des résidents, parfois engagement responsabilité du syndic. Site logistique : accès PL impossible = livraison annulée. Parking public : perte directe de CA chaque heure d'arrêt.",
    relatedServices: ["portails-clotures", "automatismes", "maintenance"],
    accentColor: "0, 154, 68",
    seo: {
      title: "Dépannage portail automatique — copropriété & professionnel",
      description: "Dépannage urgent portail automatique toutes marques (Came, Faac, Bft, Nice). Motorisation, armoire, photocellules, bras articulés. Stock pièces.",
    },
  },

  {
    slug: "porte-coupe-feu",
    label: "Porte coupe-feu",
    title: "Dépannage porte coupe-feu",
    tagline: "Votre bâtiment est en non-conformité ? Remise en état immédiate.",
    intro:
      "Une porte coupe-feu défaillante (bloquée ouverte, ferme-porte HS, gâche électromagnétique muette) place votre ERP, IGH ou site ICPE en non-conformité immédiate. Les conséquences sont graves : suspension d'exploitation par la commission de sécurité, assurance qui peut refuser sa garantie en cas d'incendie, engagement de la responsabilité pénale de l'employeur. IEF & CO intervient en urgence sur les portes coupe-feu battantes (EI 30, EI 60, EI 90, EI 120), les portes coulissantes coupe-feu, les rideaux coupe-feu textile, ainsi que sur l'ensemble de la quincaillerie coupe-feu (ferme-portes réglables, gâches électromagnétiques, contacts magnétiques SSI). Notre intervention est conforme aux exigences EN 16034 avec PV remis pour votre dossier de sécurité.",
    commonFailures: [
      { title: "Ferme-porte hydraulique défaillant", symptom: "Porte qui ne revient plus en position fermée, se referme trop violemment", fix: "Remplacement ferme-porte certifié coupe-feu (Dorma, Geze, Assa Abloy)", avgDuration: "1h" },
      { title: "Gâche électromagnétique HS", symptom: "Porte restée bloquée ouverte, contact SSI muet", fix: "Remplacement ventouse + test continuité CMSI", avgDuration: "1-2h" },
      { title: "Joint intumescent dégradé", symptom: "Joint périphérique décollé, fissuré, plus étanche", fix: "Remplacement joint intumescent d'origine + certification maintien de classe EI", avgDuration: "2h" },
      { title: "Contact magnétique déréglé", symptom: "Alarme SSI qui sonne en boucle même porte fermée", fix: "Alignement + remplacement contact magnétique", avgDuration: "45min" },
      { title: "Serrure coupe-feu grippée", symptom: "Porte qui ne verrouille plus / ne se déverrouille plus", fix: "Démontage serrure, nettoyage ou remplacement", avgDuration: "1-2h" },
    ],
    brands: ["Jansen", "Forster", "Hörmann T30/T90", "Novoferm NovoFire", "Assa Abloy", "Bréda / Breda"],
    partsInStock: [
      "Ferme-portes Dorma TS 68 / 72 / 93",
      "Ferme-portes Geze TS 1500 / 4000",
      "Ventouses électromagnétiques 180/270/500 kg",
      "Joints intumescents 10/15/20 mm",
      "Contacts magnétiques SSI",
      "Serrures coupe-feu multipoints",
      "Béquilles anti-panique",
    ],
    businessImpact:
      "ERP en non-conformité : fermeture administrative possible, responsabilité pénale du gestionnaire en cas d'incident. IGH : suspension obligatoire immédiate. ICPE : notification administrative + risque de retrait d'autorisation d'exploitation.",
    relatedServices: ["portes-coupe-feu", "maintenance"],
    accentColor: "225, 16, 33",
    seo: {
      title: "Dépannage porte coupe-feu — remise en conformité urgente",
      description: "Dépannage urgent porte coupe-feu EI 30/60/120 : ferme-porte, gâche, joints intumescents. Conformité EN 16034 + PV. Stock pièces d'origine.",
    },
  },

  {
    slug: "porte-rapide",
    label: "Porte rapide souple",
    title: "Dépannage porte rapide souple",
    tagline: "Flux logistique stoppé ? Chaîne du froid menacée ? Intervention SLA.",
    intro:
      "Les portes rapides souples (Maviflex, Hörmann V, Crawford Eagle, Novoferm NovoSpeed) équipent les sites logistiques à haute fréquence, les entrepôts agroalimentaires et les zones de production sensibles. Leur rôle critique — isolation thermique + contrôle de flux — rend chaque panne immédiatement impactante. IEF & CO intervient en urgence sur ces équipements avec une expertise spécifique : remplacement de tablier souple, diagnostic motorisation, réglage butées, réparation système d'auto-réparation (MaviSafe, Eagle Industrial). Notre stock couvre les tabliers PVC armé standards des principales marques ainsi que les éléments mécaniques et électroniques d'usure.",
    commonFailures: [
      { title: "Tablier déchiré après choc PL", symptom: "Trous ou déchirures dans le PVC armé, perte isolation", fix: "Remplacement tablier complet ou au panneau, tension et réglage", avgDuration: "3-4h" },
      { title: "Sangle de levage rompue", symptom: "Porte qui peine à monter, moteur en surchauffe", fix: "Remplacement sangle Kevlar + réglage tension + test cycles", avgDuration: "2h" },
      { title: "Cellule de sécurité HS", symptom: "Porte qui ne se ferme plus / se ferme sur obstacle", fix: "Remplacement cellule photoélectrique + recalibrage", avgDuration: "45min" },
      { title: "Carte MaviControl / Crawford en défaut", symptom: "Porte qui refuse de démarrer, code erreur écran", fix: "Stock cartes en atelier, remplacement + paramétrage", avgDuration: "1-2h" },
      { title: "Système auto-réparable HS", symptom: "Tablier qui ne se repositionne plus après choc", fix: "Réglage mécanisme ou remplacement kit complet", avgDuration: "3h" },
    ],
    brands: ["Maviflex", "Hörmann V 3015 / V 4015", "Crawford Eagle / RR300", "Novoferm NovoSpeed"],
    partsInStock: [
      "Tabliers MaviPro / MaviSafe / MaviRoll",
      "Tabliers Hörmann V 3015",
      "Tabliers Crawford Eagle",
      "Sangles Kevlar de levage",
      "Cartes MaviControl",
      "Cellules photo Maviflex / Hörmann",
      "Radars de détection",
      "Pignons d'enroulement",
    ],
    businessImpact:
      "Logistique e-commerce : ralentissement du pickup, décalage tournée camion. Agroalimentaire : perte chaîne du froid en minutes pour chambre froide ouverte. MIN / zone tampon : contamination croisée possible entre zones.",
    relatedServices: ["fermetures-industrielles", "maintenance"],
    accentColor: "232, 121, 43",
    seo: {
      title: "Dépannage porte rapide souple — Maviflex, Hörmann V, Crawford Eagle",
      description: "Dépannage urgent porte rapide souple : tablier, sangle, cellule, carte. Maviflex, Hörmann V, Crawford. Agroalimentaire & logistique. Stock pièces.",
    },
  },
];

export function getDepannageService(slug: string): DepannageService | undefined {
  return depannageServices.find((s) => s.slug === slug);
}
