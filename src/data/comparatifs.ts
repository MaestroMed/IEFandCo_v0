/**
 * Comparatifs SEO — pages capturant les requêtes "X vs Y" très recherchées
 * sur Google par les acheteurs B2B en phase de qualification.
 */

export interface ComparatorRow {
  criterion: string;
  optionA: string;
  optionB: string;
  /** "A" | "B" | "tie" — qui gagne sur ce critère */
  winner: "A" | "B" | "tie";
}

export interface UseCase {
  scenario: string;
  recommendation: "A" | "B";
  reason: string;
}

export interface Comparator {
  slug: string;
  /** Titre court : "Porte sectionnelle vs Rideau métallique" */
  title: string;
  optionAName: string;
  optionBName: string;
  /** Tagline éditoriale */
  tagline: string;
  /** Intro 200-400 mots */
  intro: string;
  rows: ComparatorRow[];
  useCases: UseCase[];
  /** Verdict final avec guidance */
  verdict: string;
  /** FAQ */
  faq: { question: string; answer: string }[];
  seo: { title: string; description: string };
}

export const comparatifs: Comparator[] = [
  {
    slug: "porte-sectionnelle-vs-rideau-metallique",
    title: "Porte sectionnelle vs Rideau métallique",
    optionAName: "Porte sectionnelle",
    optionBName: "Rideau métallique",
    tagline: "Quel système de fermeture industrielle pour votre site ?",
    intro:
      "Le choix entre porte sectionnelle et rideau métallique est l'un des arbitrages les plus fréquents dans l'aménagement d'un site logistique, industriel ou commercial. Les deux solutions ferment efficacement une ouverture mais elles répondent à des usages très différents. La porte sectionnelle, composée de panneaux articulés qui se replient sous le plafond, offre une isolation thermique supérieure et un design plus moderne — idéale pour des entrepôts climatisés, des sites tertiaires et des accès véhicules à fréquence modérée. Le rideau métallique, formé de lames d'acier ou d'aluminium qui s'enroulent dans un coffre, mise sur la robustesse, la sécurité anti-intrusion et l'encombrement minimal — il reste la référence des commerces, des accès secondaires et des sites industriels avec contraintes d'espace au plafond. Ce comparatif vous donne les clés objectives pour trancher selon votre cas d'usage spécifique.",
    rows: [
      { criterion: "Isolation thermique", optionA: "Excellente (panneau sandwich PUR)", optionB: "Faible (lames pleines acier)", winner: "A" },
      { criterion: "Sécurité anti-intrusion", optionA: "Bonne (panneaux acier)", optionB: "Très bonne (lames acier blindées)", winner: "B" },
      { criterion: "Encombrement plafond", optionA: "Important (rails horizontaux)", optionB: "Minimal (coffre compact)", winner: "B" },
      { criterion: "Vitesse d'ouverture", optionA: "Lente (0,2-0,5 m/s)", optionB: "Moyenne (0,3-0,8 m/s)", winner: "B" },
      { criterion: "Durée de vie", optionA: "20-25 ans, 50 000 cycles", optionB: "15-20 ans, 30 000 cycles", winner: "A" },
      { criterion: "Coût d'investissement", optionA: "Plus élevé (30-100 K€)", optionB: "Plus accessible (15-50 K€)", winner: "B" },
      { criterion: "Coût de maintenance", optionA: "Modéré", optionB: "Plus élevé (lames + ressorts)", winner: "A" },
      { criterion: "Esthétique tertiaire", optionA: "Moderne, design soigné", optionB: "Industriel, brut", winner: "A" },
      { criterion: "Résistance vandalisme", optionA: "Moyenne", optionB: "Très bonne", winner: "B" },
      { criterion: "Adaptable à grande largeur", optionA: "Jusqu'à 8m sans renfort", optionB: "Jusqu'à 15m sans renfort", winner: "B" },
      { criterion: "Vitrage / éclairage naturel", optionA: "Possible (panneaux vitrés)", optionB: "Possible (lames micro-perforées)", winner: "tie" },
      { criterion: "Étanchéité air/eau", optionA: "Excellente", optionB: "Moyenne", winner: "A" },
    ],
    useCases: [
      { scenario: "Entrepôt logistique climatisé (frais positif)", recommendation: "A", reason: "L'isolation thermique de la sectionnelle limite les déperditions et le coût énergétique. Indispensable pour respecter la chaîne du froid." },
      { scenario: "Commerce de centre-ville fermant le soir", recommendation: "B", reason: "Le rideau métallique est la solution éprouvée pour la sécurité commerce — résiste mieux aux tentatives d'effraction nocturnes." },
      { scenario: "Site industriel avec accès poids lourds quotidiens", recommendation: "A", reason: "La sectionnelle motorisée permet des cycles fréquents avec un meilleur confort acoustique pour le personnel atelier." },
      { scenario: "Hangar agricole sans isolation", recommendation: "B", reason: "Inutile de payer pour une isolation non requise. Le rideau est plus économique pour ce besoin basique." },
      { scenario: "Showroom automobile / immobilier tertiaire", recommendation: "A", reason: "L'esthétique soignée et les options vitrage de la sectionnelle correspondent mieux à l'image de marque tertiaire." },
      { scenario: "Accès parking secondaire avec vandalisme fréquent", recommendation: "B", reason: "Le rideau résiste mieux aux dégradations volontaires — l'investissement initial moindre limite aussi le coût en cas de remplacement." },
    ],
    verdict:
      "La porte sectionnelle gagne pour les usages **tertiaires modernes, sites climatisés et zones d'image** (entrepôts e-commerce premium, showrooms, sièges sociaux). Le rideau métallique reste imbattable pour la **sécurité, les contraintes d'espace au plafond et les budgets serrés**. Dans la pratique, beaucoup de sites combinent les deux : sectionnelles sur les quais principaux, rideaux sur les accès secondaires.",
    faq: [
      { question: "Peut-on installer une porte sectionnelle dans un commerce ?", answer: "Oui techniquement, mais le coût et le manque de protection anti-effraction la rendent peu pertinente pour cet usage. Le rideau métallique reste le standard commerce." },
      { question: "Le rideau métallique chauffe-t-il en été ?", answer: "Oui, surtout sur les façades sud. Pour les sites où le confort thermique compte, privilégiez la sectionnelle isolée ou un rideau à lames double-paroi avec isolation injectée." },
      { question: "Quelle est la solution la plus rapide à ouvrir ?", answer: "Pour les flux très intensifs (logistique e-commerce), aucune des deux n'est idéale — il faut alors une porte rapide souple type Maviflex MaviPro ou Hörmann V 3015 (jusqu'à 3 m/s)." },
      { question: "Coût d'une porte sectionnelle 4×4m motorisée ?", answer: "Compter 4500 à 7500 € HT pose comprise pour un modèle standard isolé, motorisation tubulaire incluse. Premium isothermique avec hublots : 8000 à 12000 € HT." },
      { question: "Coût d'un rideau métallique 4×4m motorisé ?", answer: "Compter 2800 à 5500 € HT pose comprise pour un modèle standard à lames pleines. Lames micro-perforées ou anti-effraction renforcée : +30%." },
    ],
    seo: {
      title: "Porte sectionnelle vs Rideau métallique : comparatif 2026",
      description: "Comparatif détaillé porte sectionnelle vs rideau métallique : prix, isolation, sécurité, durée de vie, cas d'usage. Verdict expert IEF & CO pour vos projets pros.",
    },
  },

  {
    slug: "contrat-preventive-vs-curative",
    title: "Maintenance préventive vs Curative",
    optionAName: "Maintenance préventive",
    optionBName: "Maintenance curative",
    tagline: "Faut-il un contrat de maintenance préventive ou intervenir au coup par coup ?",
    intro:
      "C'est l'arbitrage économique central pour tout responsable maintenance ou directeur logistique : faut-il payer un contrat annuel pour anticiper les pannes (maintenance préventive), ou attendre que les problèmes surviennent et intervenir alors (maintenance curative au coup par coup) ? La réponse dépend de plusieurs facteurs — criticité du parc, volume d'équipements, intensité d'usage, conformité réglementaire — mais la majorité des sites professionnels a un point de bascule à partir duquel le préventif devient économiquement et juridiquement obligatoire. Cet article démonte les idées reçues et calcule pour chaque cas d'usage le ROI réel.",
    rows: [
      { criterion: "Coût annuel direct", optionA: "Élevé (480-1750 €/porte)", optionB: "Faible (factures à l'acte)", winner: "B" },
      { criterion: "Coût total annuel réel", optionA: "Maîtrisé et lisible", optionB: "Imprévisible, souvent +40%", winner: "A" },
      { criterion: "Conformité réglementaire", optionA: "Garantie (PV semestriels)", optionB: "À votre charge — risque légal", winner: "A" },
      { criterion: "Délai d'intervention", optionA: "SLA 4h-24h selon contrat", optionB: "Variable, 48h-7 jours", winner: "A" },
      { criterion: "Pannes critiques évitées", optionA: "70-90% selon données", optionB: "Aucune anticipation", winner: "A" },
      { criterion: "Durée de vie équipement", optionA: "+30% en moyenne", optionB: "Référence (100%)", winner: "A" },
      { criterion: "Sécurité personnel", optionA: "Audit régulier obligatoire", optionB: "Non garantie", winner: "A" },
      { criterion: "Reporting / traçabilité", optionA: "GMAO, PV, photos", optionB: "Factures uniquement", winner: "A" },
      { criterion: "Visibilité budgétaire", optionA: "Coût fixe annuel", optionB: "Variable (factures)", winner: "A" },
      { criterion: "Pertinence < 3 portes", optionA: "Discutable", optionB: "Acceptable", winner: "B" },
    ],
    useCases: [
      { scenario: "Site logistique e-commerce 20+ portes 18h/jour", recommendation: "A", reason: "Critique. Une journée d'arrêt coûte plus que le contrat annuel. Recommandation Or full-service 24/7." },
      { scenario: "Bureaux tertiaires 2 portes parking", recommendation: "B", reason: "Le préventif est surdimensionné pour ce besoin. Curatif suffit, sauf obligation réglementaire stricte." },
      { scenario: "ERP recevant du public (cinéma, hôpital, école)", recommendation: "A", reason: "Obligation légale arrêté 21/12/1993. Le préventif n'est pas une option mais une exigence." },
      { scenario: "Site industriel agroalimentaire HACCP", recommendation: "A", reason: "Audits HACCP exigent traçabilité maintenance. Préventif obligatoire avec PV signés." },
      { scenario: "Petit entrepôt PME 5 portes peu sollicitées", recommendation: "A", reason: "Bronze à 480€/porte/an. Coût raisonnable pour conformité et sérénité juridique." },
    ],
    verdict:
      "Pour 95% des sites B2B, le **contrat préventif est économiquement gagnant dès la 2e année** d'exploitation. Les sites < 3 portes très peu sollicitées peuvent rester en curatif s'ils acceptent le risque réglementaire. Au-delà, le débat n'a pas lieu — la question devient simplement : quel niveau de contrat (Bronze, Argent ou Or) selon votre intensité d'usage et votre criticité.",
    faq: [
      { question: "Le contrat de maintenance est-il obligatoire ?", answer: "L'arrêté du 21 décembre 1993 impose un entretien semestriel des portes automatiques sur les lieux de travail. Vous pouvez réaliser cet entretien en interne ou via un prestataire — le contrat formalise et trace cette obligation." },
      { question: "Combien économise-t-on vraiment avec un contrat préventif ?", answer: "Données IEF & CO sur 3 ans : -65% de pannes critiques, -40% de coût total maintenance (réparations évitées), +30% de durée de vie moyenne du parc, 0 contentieux assurance lié à un défaut." },
      { question: "Que se passe-t-il en cas de panne hors contrat ?", answer: "Vous bénéficiez d'un tarif horaire majoré (+30 à +50%) et d'un délai d'intervention non garanti (48h à 7 jours selon disponibilités). Sur un site critique, c'est ingérable." },
      { question: "Peut-on annuler un contrat de maintenance ?", answer: "Oui, généralement avec préavis 3 mois en fin de période annuelle. Notre contrat 1ère année est sans engagement — vous testez avant de vous engager pluriannuel." },
      { question: "Maintenance interne vs prestataire externe ?", answer: "L'interne est rentable au-delà de 50+ portes sur un site (équipe technique dédiée). En dessous, le prestataire externe est plus économique et plus expert (formation continue marques)." },
    ],
    seo: {
      title: "Contrat maintenance préventive vs curative : comparatif & ROI",
      description: "Faut-il un contrat préventif ou attendre la panne ? Comparatif détaillé : coûts réels, ROI, obligations légales, cas d'usage B2B. Verdict expert IEF & CO.",
    },
  },

  {
    slug: "motorisation-chaine-vs-courroie",
    title: "Motorisation à chaîne vs courroie",
    optionAName: "Motorisation à chaîne",
    optionBName: "Motorisation à courroie",
    tagline: "Quel système de transmission pour votre porte sectionnelle ?",
    intro:
      "Quand on motorise une porte sectionnelle, le choix de la transmission entre le moteur et la porte conditionne le bruit, la durabilité, la maintenance et le coût. Les deux technologies dominantes sont la **chaîne** (transmission mécanique métal-sur-métal) et la **courroie** (sangle synthétique renforcée). Chacune a ses domaines de prédilection. Ce comparatif technique vous donne les critères objectifs pour décider.",
    rows: [
      { criterion: "Bruit en fonctionnement", optionA: "Élevé (35-55 dB)", optionB: "Faible (25-35 dB)", winner: "B" },
      { criterion: "Durabilité (cycles)", optionA: "100 000+ cycles", optionB: "50 000-80 000 cycles", winner: "A" },
      { criterion: "Maintenance requise", optionA: "Lubrification annuelle", optionB: "Quasi-aucune", winner: "B" },
      { criterion: "Tolérance aux poussières", optionA: "Bonne", optionB: "Moyenne", winner: "A" },
      { criterion: "Coût initial", optionA: "Standard (référence)", optionB: "+15-25%", winner: "A" },
      { criterion: "Tolérance au gel", optionA: "Bonne (avec lubrifiant)", optionB: "Très bonne", winner: "B" },
      { criterion: "Convient aux portes lourdes (>250 kg)", optionA: "Excellent", optionB: "Limité (200 kg max)", winner: "A" },
      { criterion: "Adaptée résidentiel/tertiaire", optionA: "Acceptable", optionB: "Idéale", winner: "B" },
      { criterion: "Adaptée industriel intensif", optionA: "Idéale", optionB: "Acceptable", winner: "A" },
    ],
    useCases: [
      { scenario: "Garage résidentiel attenant à pièce de vie", recommendation: "B", reason: "Silence essentiel pour le confort. Courroie idéale (25-30 dB perçus depuis l'intérieur)." },
      { scenario: "Entrepôt industriel — porte 4×4m, 50 cycles/jour", recommendation: "A", reason: "Robustesse et durabilité priment sur le bruit. Chaîne adaptée à la cadence et au poids." },
      { scenario: "Site agroalimentaire — exigence hygiène", recommendation: "B", reason: "Pas de lubrifiant à entretenir, moins de risque contamination. Courroie préférée." },
      { scenario: "Atelier avec atmosphère poussiéreuse (bois, métal)", recommendation: "A", reason: "La chaîne tolère mieux les poussières qui pourraient encrasser et user prématurément une courroie." },
      { scenario: "Bureau / showroom avec porte parking", recommendation: "B", reason: "Image de marque + confort acoustique pour les utilisateurs." },
    ],
    verdict:
      "**Courroie pour le confort** (résidentiel, tertiaire, agroalimentaire), **chaîne pour l'industriel intensif**. La courroie progresse rapidement et tend à remplacer la chaîne sur les nouveaux usages — sauf en industriel lourd où la chaîne reste imbattable.",
    faq: [
      { question: "Peut-on remplacer une chaîne par une courroie sur un moteur existant ?", answer: "Non, c'est le moteur lui-même qui est conçu pour l'un ou l'autre. Le remplacement implique un changement complet du bloc motorisation." },
      { question: "Une courroie peut-elle casser brutalement ?", answer: "C'est très rare avec une courroie crantée renforcée Kevlar. Une usure prématurée se voit progressivement (cliquetis, jeu) et permet un remplacement programmé avant rupture." },
      { question: "Coût comparé sur 10 ans ?", answer: "Chaîne : -15% à l'achat mais +200€ de lubrification sur 10 ans. Courroie : +15% à l'achat, 0 € de maintenance, remplacement éventuel à 8 ans (~150 €). À 10 ans, équivalence économique." },
      { question: "Adaptée aux portails autoportants ?", answer: "Pour les portails coulissants industriels, on privilégie une motorisation à crémaillère (rail dentée + pignon) plutôt que chaîne ou courroie qui sont moins adaptées aux longueurs >5m." },
    ],
    seo: {
      title: "Motorisation porte à chaîne ou courroie : comparatif technique",
      description: "Chaîne vs courroie pour porte sectionnelle motorisée : bruit, durabilité, coût, cas d'usage. Comparatif technique IEF & CO pour bien choisir.",
    },
  },

  {
    slug: "acier-vs-aluminium-portail",
    title: "Acier vs Aluminium pour portail",
    optionAName: "Portail acier",
    optionBName: "Portail aluminium",
    tagline: "Quel matériau pour votre portail professionnel ou résidentiel ?",
    intro:
      "Le choix du matériau d'un portail conditionne sa durée de vie, son entretien, son coût initial et son rendu esthétique. L'acier et l'aluminium sont les deux options dominantes — l'inox restant un choix de niche pour environnements très corrosifs. Ce comparatif vous aide à arbitrer.",
    rows: [
      { criterion: "Coût initial", optionA: "Référence (-20-30%)", optionB: "Plus élevé", winner: "A" },
      { criterion: "Durée de vie", optionA: "20-30 ans (avec galvanisation)", optionB: "30-50 ans (intrinsèque)", winner: "B" },
      { criterion: "Entretien", optionA: "Repeinture tous les 5-7 ans", optionB: "Quasi-aucun", winner: "B" },
      { criterion: "Résistance corrosion", optionA: "Bonne (galvanisé) à excellente (peint)", optionB: "Excellente (anodisé)", winner: "B" },
      { criterion: "Poids", optionA: "Lourd (60-100 kg/m²)", optionB: "Léger (15-25 kg/m²)", winner: "B" },
      { criterion: "Sécurité anti-intrusion", optionA: "Excellente", optionB: "Bonne", winner: "A" },
      { criterion: "Personnalisation design", optionA: "Très large (ferronnerie possible)", optionB: "Bonne (lignes contemporaines)", winner: "A" },
      { criterion: "Compatibilité motorisation", optionA: "Toutes (poids gérable)", optionB: "Toutes (idéal portails grands)", winner: "tie" },
      { criterion: "Recyclabilité", optionA: "Très bonne (100%)", optionB: "Excellente (sans perte qualité)", winner: "B" },
      { criterion: "Bord de mer / atmosphère saline", optionA: "Risque corrosion (même galvanisé)", optionB: "Idéal", winner: "B" },
    ],
    useCases: [
      { scenario: "Portail industriel grande largeur (>6m) lourd", recommendation: "A", reason: "L'acier permet des sections renforcées pour grandes ouvertures sans déformation. Coût justifié par la robustesse." },
      { scenario: "Résidence contemporaine ou tertiaire premium", recommendation: "B", reason: "Esthétique épurée, lignes droites, finitions mat ou texturées modernes. Aluminium idéal pour cette image." },
      { scenario: "Bord de mer (Manche, Atlantique)", recommendation: "B", reason: "L'aluminium ne rouille pas. L'acier nécessite des traitements anti-corrosion lourds qui doivent être repris régulièrement." },
      { scenario: "Site logistique avec passages PL fréquents", recommendation: "A", reason: "Robustesse face aux chocs. L'aluminium se déforme plus facilement qu'on ne le pense en cas d'impact PL." },
      { scenario: "Ferronnerie ouvragée (style classique, restauration)", recommendation: "A", reason: "L'acier permet la ferronnerie traditionnelle (volutes, motifs forgés). L'aluminium ne se travaille pas ainsi." },
    ],
    verdict:
      "**Aluminium pour le tertiaire moderne, le résidentiel et les zones corrosives**. **Acier pour l'industriel lourd, la sécurité maximale et le style traditionnel ou ferronnerie**. Sur 30 ans, l'aluminium revient moins cher en coût total (TCO) malgré son prix initial plus élevé — c'est l'arbitrage classique CAPEX vs OPEX.",
    faq: [
      { question: "Peut-on motoriser un portail aluminium grande largeur ?", answer: "Oui jusqu'à 10-12m d'ouverture en coulissant ou autoportant. Au-delà, on revient à l'acier ou à des structures hybrides." },
      { question: "L'aluminium 'sonne creux' — est-ce un problème ?", answer: "C'est plus une perception qu'un défaut technique. Les portails alu modernes utilisent des profils renforcés qui sonnent moins creux. Pour les exigences acoustiques fortes, l'acier reste légèrement supérieur." },
      { question: "Acier galvanisé suffit-il en bord de mer ?", answer: "Sur 5-7 ans oui, mais des taches de rouille apparaissent souvent dès 3 ans même avec galvanisation Z275. Pour bord de mer, l'aluminium ou l'inox sont fortement recommandés." },
      { question: "Différence de prix concrète sur un portail 4m ?", answer: "Portail coulissant 4m motorisé : ~3500-5500 € HT en acier, ~4500-7000 € HT en aluminium. L'écart se rentabilise en 8-10 ans grâce à l'absence d'entretien." },
    ],
    seo: {
      title: "Portail acier ou aluminium ? Comparatif détaillé 2026",
      description: "Acier vs aluminium pour portail : prix, durabilité, entretien, esthétique, cas d'usage. Verdict expert IEF & CO selon votre contexte (industriel, tertiaire, résidentiel).",
    },
  },

  {
    slug: "hormann-vs-crawford",
    title: "Hörmann vs Crawford",
    optionAName: "Hörmann",
    optionBName: "Crawford",
    tagline: "Quelle marque de porte industrielle choisir ?",
    intro:
      "Hörmann et Crawford sont les deux grands noms de la porte industrielle en Europe. Tous deux fabricants historiques (Hörmann allemand depuis 1935, Crawford suédois depuis 1845, racheté par ASSA ABLOY en 1999), ils dominent les achats des grands comptes français. Pour un acheteur ou directeur logistique, comment trancher entre les deux ? Ce comparatif synthétise les différences réelles observées sur le terrain.",
    rows: [
      { criterion: "Gamme produits", optionA: "Très large (résidentiel + industriel)", optionB: "Plus focalisée industriel", winner: "A" },
      { criterion: "Innovation produit", optionA: "Rythmée (R&D forte)", optionB: "Solide mais moins prolifique", winner: "A" },
      { criterion: "Prix d'achat", optionA: "Standard du marché", optionB: "Souvent +5-10%", winner: "A" },
      { criterion: "Disponibilité pièces (5-10 ans)", optionA: "Excellente", optionB: "Bonne", winner: "A" },
      { criterion: "Disponibilité pièces (>15 ans)", optionA: "Bonne", optionB: "Variable", winner: "A" },
      { criterion: "Solidité construction", optionA: "Excellente", optionB: "Excellente", winner: "tie" },
      { criterion: "SAV constructeur direct", optionA: "Bon (Hörmann France réactif)", optionB: "Très bon (Crawford Care)", winner: "B" },
      { criterion: "Cadence intensive (>2000 cycles/j)", optionA: "Adapté (V 3015, SPU)", optionB: "Référence (Eagle, Combi)", winner: "B" },
      { criterion: "Présence revendeurs IDF", optionA: "Très large", optionB: "Large mais moins dense", winner: "A" },
      { criterion: "Esthétique tertiaire", optionA: "Très soignée (gamme APU)", optionB: "Industrielle", winner: "A" },
      { criterion: "Niveleurs de quai", optionA: "Bonne gamme (ITO)", optionB: "Référence du marché (DLC)", winner: "B" },
      { criterion: "Sas d'étanchéité", optionA: "Bons (DTU)", optionB: "Référence (DSC)", winner: "B" },
    ],
    useCases: [
      { scenario: "Entrepôt logistique e-commerce 4000 cycles/jour", recommendation: "B", reason: "Crawford Eagle est le standard de l'industrie pour cette intensité. Adapté pour la cadence extrême." },
      { scenario: "Bâtiment tertiaire premium avec image de marque", recommendation: "A", reason: "La gamme Hörmann APU avec hublots design est plus adaptée à l'esthétique tertiaire haut de gamme." },
      { scenario: "Quai de chargement multi-camions / multi-marques", recommendation: "B", reason: "L'ensemble Crawford DLC + DSC est plus intégré et performant pour les quais à fort flux PL." },
      { scenario: "PME industrielle équipement complet (porte + portail + coupe-feu)", recommendation: "A", reason: "La largeur de gamme Hörmann permet de tout sourcer chez un fabricant unique — simplification SAV." },
      { scenario: "Site multi-pays avec standardisation européenne", recommendation: "B", reason: "ASSA ABLOY a une présence européenne plus uniforme. Plus simple à standardiser sur 5+ pays." },
    ],
    verdict:
      "**Hörmann est le choix par défaut** pour 80% des sites IDF — gamme large, prix maîtrisé, SAV dense. **Crawford est l'option premium** pour les sites logistiques à très haute intensité ou les quais de chargement complexes. Quel que soit le choix, **un contrat de maintenance avec un prestataire spécialisé** (comme IEF & CO) est essentiel : le SAV constructeur direct est plus cher et moins réactif.",
    faq: [
      { question: "Peut-on mélanger les deux marques sur un même site ?", answer: "Oui, c'est même fréquent (Hörmann sur les portes secondaires, Crawford sur les quais principaux). Un prestataire unique comme IEF & CO maintient les deux marques sans difficulté." },
      { question: "Quelle est la différence de prix réelle ?", answer: "Sur un produit équivalent, Crawford est généralement 5-10% plus cher à l'achat. L'écart se justifie par une meilleure adaptation à l'industriel intensif." },
      { question: "Disponibilité pièces sur portes anciennes (>15 ans) ?", answer: "Hörmann est légèrement meilleur sur la longévité du support pièces — leur catalogue rétro est très complet. Crawford peut nécessiter du sur-mesure pour des modèles arrêtés." },
      { question: "Quel constructeur a le meilleur SAV en IDF ?", answer: "Hörmann a un réseau plus dense (réactivité moyenne 24-48h). Crawford Care est plus structuré mais avec délais plus longs (48-72h). Un prestataire indépendant comme IEF & CO bat les deux en réactivité (4h sous contrat)." },
    ],
    seo: {
      title: "Hörmann vs Crawford : quelle marque de porte industrielle choisir ?",
      description: "Comparatif Hörmann vs Crawford pour porte industrielle B2B : gamme, prix, durabilité, SAV, cas d'usage. Verdict expert IEF & CO sur le terrain.",
    },
  },
];

export function getComparatorBySlug(slug: string): Comparator | undefined {
  return comparatifs.find((c) => c.slug === slug);
}
