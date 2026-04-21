export type BlogCategory = "Guide" | "Normes" | "Technique" | "Case Study";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  dateISO: string;
  category: BlogCategory;
  author: string;
  readingMinutes: number;
  sections: BlogSection[];
}

export interface BlogSection {
  heading?: string;
  paragraphs: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "pourquoi-choisir-la-construction-metallique",
    title: "Pourquoi choisir la construction metallique aujourd'hui",
    excerpt:
      "Resistance, rapidite de mise en oeuvre, recyclabilite, maitrise des couts : pourquoi de plus en plus de professionnels choisissent l'acier pour leurs projets industriels et tertiaires.",
    date: "23 decembre 2025",
    dateISO: "2025-12-23",
    category: "Guide",
    author: "IEF & CO",
    readingMinutes: 5,
    sections: [
      {
        paragraphs: [
          "La construction metallique connait un essor sans precedent. Que ce soit pour des batiments industriels, des locaux tertiaires ou des ouvrages d'art, l'acier s'impose comme le materiau de reference grace a ses proprietes uniques.",
        ],
      },
      {
        heading: "Les avantages de l'acier",
        paragraphs: [
          "Resistance mecanique exceptionnelle, rapidite de mise en oeuvre, recyclabilite a 100%, souplesse de conception, maitrise des couts : l'acier offre un rapport performance/prix inegale dans le secteur de la construction.",
          "Une charpente metallique peut etre prefabriquee en atelier puis montee sur site en quelques jours, contre plusieurs semaines pour une structure beton equivalente.",
        ],
      },
      {
        heading: "Normes et certifications",
        paragraphs: [
          "La certification EN 1090 et le respect de l'Eurocode 3 garantissent la qualite et la securite des ouvrages metalliques. Chez IEF & CO, chaque structure est calculee, fabriquee et controlee selon ces references.",
        ],
      },
    ],
  },
  {
    slug: "maintenance-obligatoire-portes-industrielles",
    title: "Maintenance obligatoire des portes industrielles : ce que dit la loi",
    excerpt:
      "L'arrete du 21 decembre 1993 impose une maintenance semestrielle de toutes les portes automatiques en milieu professionnel. Detail des obligations et des consequences en cas de manquement.",
    date: "8 janvier 2026",
    dateISO: "2026-01-08",
    category: "Normes",
    author: "IEF & CO",
    readingMinutes: 7,
    sections: [
      {
        paragraphs: [
          "Toute porte automatique ou semi-automatique installee dans un lieu de travail doit faire l'objet d'une maintenance semestrielle. Cette obligation, souvent meconnue, est encadree par l'arrete du 21 decembre 1993 et engage la responsabilite directe du proprietaire ou de l'exploitant.",
        ],
      },
      {
        heading: "Que dit precisement la reglementation ?",
        paragraphs: [
          "L'arrete impose un controle complet tous les six mois : verification des organes de securite (cellules, bords sensibles, arrets d'urgence), des reglages mecaniques, du fonctionnement de la motorisation, et de la conformite globale a la norme EN 13241-1.",
          "Chaque intervention doit etre tracee dans un carnet d'entretien, conserve sur site et presentable a l'inspection du travail.",
        ],
      },
      {
        heading: "Quels risques en cas de non-respect ?",
        paragraphs: [
          "En cas d'accident, l'absence de maintenance documentee engage la responsabilite penale du chef d'etablissement. Les assurances peuvent egalement refuser la prise en charge.",
          "Au-dela du cadre legal, une porte non entretenue voit sa duree de vie chuter de moitie et augmente significativement les risques d'arret de production.",
        ],
      },
      {
        heading: "Comment se mettre en conformite ?",
        paragraphs: [
          "Un contrat de maintenance preventive avec un prestataire qualifie (comme IEF & CO) couvre l'ensemble des obligations : visites planifiees, PV d'intervention, carnet d'entretien digital, et acces 24/7 au depannage en cas d'incident.",
        ],
      },
    ],
  },
  {
    slug: "comparatif-rideau-metallique-porte-sectionnelle",
    title: "Rideau metallique ou porte sectionnelle : quel choix pour votre site ?",
    excerpt:
      "Securite, isolation, encombrement, vitesse d'ouverture : guide comparatif des deux solutions de fermeture les plus courantes en milieu industriel.",
    date: "20 janvier 2026",
    dateISO: "2026-01-20",
    category: "Technique",
    author: "IEF & CO",
    readingMinutes: 6,
    sections: [
      {
        paragraphs: [
          "Le choix entre un rideau metallique et une porte sectionnelle depend de plusieurs criteres : usage (logistique, commerce, atelier), frequence d'ouverture, contraintes thermiques, et budget. Voici les criteres essentiels pour decider.",
        ],
      },
      {
        heading: "Rideau metallique : robuste et economique",
        paragraphs: [
          "Compose de lames articulees en acier galvanise ou aluminium, le rideau metallique s'enroule en partie haute. Son atout principal : un encombrement minimal et une excellente resistance aux intrusions.",
          "Adapte aux commerces, garages, et zones de stockage non chauffees. Cycle de fonctionnement modere (jusqu'a 10 000 cycles/an).",
        ],
      },
      {
        heading: "Porte sectionnelle : isolation et confort thermique",
        paragraphs: [
          "Constituee de panneaux articules isoles, la porte sectionnelle se loge sous le plafond. Elle offre une excellente isolation thermique et acoustique, indispensable pour les entrepots chauffes ou frigorifiques.",
          "Compatible avec les ouvertures de grande hauteur (jusqu'a 7m), elle supporte des cycles intenses (50 000 cycles/an avec maintenance reguliere).",
        ],
      },
      {
        heading: "Le verdict",
        paragraphs: [
          "Pour la logistique haute frequence et les sites isoles thermiquement : porte sectionnelle. Pour la securite anti-intrusion et les budgets contraints : rideau metallique. En cas de doute, contactez-nous pour un audit sur site.",
        ],
      },
    ],
  },
  {
    slug: "certification-en-1090-pourquoi-elle-compte",
    title: "Certification EN 1090 : pourquoi elle protege votre projet",
    excerpt:
      "La certification EN 1090 est obligatoire pour tout element structurel en acier. Detail de ses exigences, des classes d'execution et des consequences en cas d'absence.",
    date: "5 fevrier 2026",
    dateISO: "2026-02-05",
    category: "Normes",
    author: "IEF & CO",
    readingMinutes: 8,
    sections: [
      {
        paragraphs: [
          "Depuis le 1er juillet 2014, tout fabricant ou poseur d'elements structurels en acier ou en aluminium destines a la construction doit etre certifie EN 1090. Cette norme europeenne harmonise les exigences de qualite et engage directement la responsabilite des intervenants.",
        ],
      },
      {
        heading: "Les 4 classes d'execution",
        paragraphs: [
          "EXC1 : structures simples, faibles consequences en cas de defaillance (cloisons, supports legers).",
          "EXC2 : structures courantes (charpentes, mezzanines, garde-corps). C'est la classe la plus repandue.",
          "EXC3 : structures complexes ou a hautes consequences (ponts, batiments hauts).",
          "EXC4 : ouvrages exceptionnels ou criticites particulieres.",
          "IEF & CO est certifie EXC2, ce qui couvre l'integralite de notre champ d'intervention en metallerie batiment.",
        ],
      },
      {
        heading: "Que se passe-t-il sans certification ?",
        paragraphs: [
          "Un element structurel installe sans certification EN 1090 peut etre refuse a la reception, au controle technique, ou conduire a un refus d'assurance dommages-ouvrage.",
          "En cas de sinistre, la responsabilite du maitre d'ouvrage et du poseur peut etre engagee, avec des consequences financieres potentiellement majeures.",
        ],
      },
    ],
  },
  {
    slug: "renovation-portail-coulissant-roissy",
    title: "Renovation d'un portail coulissant 12m sur site logistique",
    excerpt:
      "Etude de cas : remplacement d'un portail vetuste par un portail coulissant motorise + controle d'acces RFID, en moins de 5 jours, sur un site logistique en activite.",
    date: "18 fevrier 2026",
    dateISO: "2026-02-18",
    category: "Case Study",
    author: "IEF & CO",
    readingMinutes: 5,
    sections: [
      {
        paragraphs: [
          "Un operateur logistique en Val-d'Oise nous a sollicite pour le remplacement d'un portail coulissant 12m vetuste, devenu source de pannes recurrentes et bloquant occasionnellement l'acces aux poids lourds.",
        ],
      },
      {
        heading: "Le challenge",
        paragraphs: [
          "Site en activite 24/7, impossibilite d'arreter le flux logistique. Contraintes : intervention sans interruption d'exploitation, securisation des manoeuvres, integration avec le controle d'acces existant.",
        ],
      },
      {
        heading: "Notre solution",
        paragraphs: [
          "Pre-fabrication du nouveau portail en atelier (rail, vantail, motorisation), depose du portail existant en horaires de creux d'activite (nuit + week-end), pose du nouveau systeme avec mise en service progressive.",
          "Integration d'un nouveau lecteur RFID + lecteur de plaques d'immatriculation pour identifier automatiquement les chauffeurs habituels.",
        ],
      },
      {
        heading: "Le resultat",
        paragraphs: [
          "5 jours d'intervention totale. Zero arret de production. Reduction de 80% des pannes sur les 6 mois suivants. Gain de temps moyen de 12 secondes par passage poids lourd grace au lecteur de plaques.",
        ],
      },
    ],
  },

  /* ─────────── PILLAR ARTICLES (Phase C) ─────────── */

  {
    slug: "guide-maintenance-porte-sectionnelle-2026",
    title: "Guide complet de la maintenance porte sectionnelle industrielle en 2026",
    excerpt:
      "Tout ce qu'un responsable maintenance doit savoir sur l'entretien des portes sectionnelles industrielles : obligations légales, fréquences d'intervention, pannes courantes, ROI d'un contrat.",
    date: "8 avril 2026",
    dateISO: "2026-04-08",
    category: "Guide",
    author: "IEF & CO",
    readingMinutes: 15,
    sections: [
      {
        paragraphs: [
          "La porte sectionnelle industrielle est probablement l'équipement le plus critique d'un entrepôt logistique, d'un site de production ou d'un parking professionnel. Elle travaille sans relâche, supporte des centaines de cycles par jour, et son arrêt peut immobiliser plusieurs dizaines de milliers d'euros de flux quotidien. Pourtant, elle reste souvent le parent pauvre des plans de maintenance B2B — jusqu'à la première panne critique. Ce guide fait le point complet sur ce que tout responsable maintenance ou directeur logistique doit savoir en 2026 pour gérer son parc de portes sectionnelles de façon professionnelle.",
        ],
      },
      {
        heading: "1. Le cadre légal : l'arrêté du 21 décembre 1993",
        paragraphs: [
          "Depuis plus de 30 ans, l'arrêté du 21 décembre 1993 (modifié en 1996) impose à tout employeur un entretien semestriel des portes automatiques et semi-automatiques installées sur les lieux de travail. Cette obligation couvre les portes sectionnelles, rideaux métalliques, portes rapides, portails motorisés — toutes les fermetures motorisées sans exception.",
          "Concrètement, l'employeur doit : (1) faire réaliser un entretien préventif semestriel par une entreprise spécialisée ou un personnel interne formé ; (2) tenir un carnet d'entretien à jour mentionnant chaque intervention, chaque composant remplacé, chaque anomalie constatée ; (3) signaler visiblement les dispositifs d'arrêt d'urgence ; (4) installer un dispositif de déverrouillage manuel fonctionnel en cas de coupure de courant.",
          "Le non-respect de cette obligation n'est pas anodin. En cas d'accident lié à une porte mal entretenue (blessure d'un salarié, chute de tablier, cisaillement d'un piéton), la responsabilité civile et pénale de l'employeur peut être engagée. Les assurances refusent généralement leur garantie si la maintenance n'est pas documentée. L'inspection du travail peut également demander à consulter le carnet d'entretien lors de contrôles inopinés.",
        ],
      },
      {
        heading: "2. Quelle fréquence de maintenance selon l'usage réel ?",
        paragraphs: [
          "La fréquence semestrielle de l'arrêté est un minimum légal — pas une recommandation technique optimale. Dans la pratique, la fréquence réelle à appliquer dépend de l'intensité d'usage mesurée en cycles/jour :",
          "• Moins de 50 cycles/jour (bureau, petit commerce) : semestrielle suffit largement.",
          "• 50 à 500 cycles/jour (PME industrielle, commerce moyenne surface) : semestrielle reste adaptée.",
          "• 500 à 1500 cycles/jour (entrepôt logistique classique) : trimestrielle recommandée, surtout sur les portes les plus sollicitées.",
          "• Plus de 1500 cycles/jour (e-commerce, messagerie, agroalimentaire) : bi-mensuelle voire mensuelle obligatoire. Portes rapides souples à privilégier sur ce segment.",
          "Pour mesurer le nombre de cycles réels, la plupart des motorisations modernes (Hörmann SupraMatic HD, Crawford) disposent d'un compteur intégré accessible via l'armoire. Une lecture régulière permet de caler la fréquence optimale.",
        ],
      },
      {
        heading: "3. Les 10 pannes les plus fréquentes (et leur coût)",
        paragraphs: [
          "Sur 15 ans de données terrain, voici les défaillances les plus fréquemment rencontrées sur les portes sectionnelles industrielles et le coût moyen de leur réparation curative (hors contrat) :",
          "1. Ressort de torsion cassé (120-250 € pièce + 1-2h main d'œuvre) — durée de vie typique 20 000-30 000 cycles.",
          "2. Câble de levage rompu (60-120 € + 1h) — toujours causé par une usure non détectée à temps.",
          "3. Carte motorisation HS (350-800 € + 1h) — souvent après surtension réseau ou foudre.",
          "4. Cellule photoélectrique vétuste (180-350 € + 45min) — à remplacer préventivement tous les 5 ans.",
          "5. Joint d'étanchéité dégradé (80-200 € + 1h) — perte isolation thermique majeure.",
          "6. Guide vertical tordu après choc (250-500 € + 2h) — réparable souvent par redressage.",
          "7. Panneau déformé (400-900 € + 3h) — remplacement du panneau impacté.",
          "8. Roulements usés (25-50 € x nombre + 1h) — bruits métalliques au passage.",
          "9. Télécommande HS (40-80 € + 15min reprogrammation).",
          "10. Dispositif anti-chute défaillant (300-600 € + 2h) — sécurité critique, à traiter en urgence absolue.",
          "Le coût moyen d'une intervention curative (hors contrat) se situe autour de 450 € TTC. Sur un parc de 20 portes, avec en moyenne 2-3 pannes/porte/an, cela représente 18 000-27 000 € de dépannages curatifs annuels. Un contrat préventif global coûte typiquement 10 000-16 000 €/an pour le même parc, avec la majorité des pannes évitées. Le ROI est clair dès la première année.",
        ],
      },
      {
        heading: "4. Les 3 niveaux de contrat de maintenance",
        paragraphs: [
          "Chez IEF & CO, nous proposons 3 niveaux de contrat adaptés aux besoins :",
          "Contrat Bronze — à partir de 480 €/porte/an : 1 visite préventive annuelle, PV réglementaire, carnet d'entretien numérique, tarif préférentiel sur dépannages curatifs. Pour PME avec 1-5 portes peu sollicitées.",
          "Contrat Argent — à partir de 980 €/porte/an : 2 visites préventives semestrielles, dépannages curatifs illimités sous 24h ouvrées, pièces d'usure incluses (joints, roulements, ressorts), hotline 8h-18h, reporting trimestriel. Le standard B2B.",
          "Contrat Or — à partir de 1 750 €/porte/an : 4 visites trimestrielles, dépannages illimités sous 4h, toutes pièces incluses, astreinte 24/7, audit annuel parc complet + plan pluriannuel. Pour les sites critiques (logistique, agroalimentaire, hospitalier).",
        ],
      },
      {
        heading: "5. Checklist d'audit de votre parc (à faire en interne)",
        paragraphs: [
          "Avant de souscrire ou renouveler un contrat, voici la checklist rapide à réaliser pour chaque porte :",
          "— Année d'installation et fabricant (Hörmann, Crawford, Novoferm, etc.)",
          "— Modèle exact (SPU 67, APU F42, Combi 442...)",
          "— Compteur de cycles (accessible via armoire motorisation)",
          "— État visuel du tablier : chocs, déformations, corrosion",
          "— État du ressort : usure, fissures, bruit inhabituel au cycle",
          "— Fonctionnement cellules de sécurité : test obstacle",
          "— État des joints périphériques : décollement, fissures",
          "— Présence et fonctionnement du déverrouillage manuel",
          "— Date de la dernière intervention inscrite au carnet d'entretien",
          "Cet audit vous permet de prioriser les équipements vétustes et d'orienter votre prestataire sur les zones à surveiller particulièrement.",
        ],
      },
      {
        heading: "Conclusion",
        paragraphs: [
          "La maintenance préventive d'un parc de portes sectionnelles n'est pas un coût — c'est un investissement dont le ROI est démontrable et rapide. Respect de la loi, continuité d'exploitation, sécurité du personnel, protection juridique et financière : les bénéfices s'accumulent. Au prix d'un contrat bien dimensionné, vous transformez un équipement critique en actif fiable.",
          "IEF & CO propose un audit gratuit de votre parc en Île-de-France avant toute signature. Nous chiffrons précisément le contrat qui vous convient, avec engagement SLA garanti. Contactez-nous pour planifier cet audit.",
        ],
      },
    ],
  },

  {
    slug: "cout-panne-porte-industrielle-vs-contrat-maintenance",
    title: "Coût d'une panne porte industrielle vs contrat de maintenance : le ROI chiffré",
    excerpt:
      "Calculs concrets sur le retour sur investissement d'un contrat de maintenance : coût d'une panne, coût d'un arrêt d'exploitation, comparaison avec le préventif. Les chiffres parlent.",
    date: "2 avril 2026",
    dateISO: "2026-04-02",
    category: "Guide",
    author: "IEF & CO",
    readingMinutes: 12,
    sections: [
      {
        paragraphs: [
          "« Un contrat de maintenance, c'est trop cher » — c'est la phrase qu'on entend le plus souvent lors de nos premiers rendez-vous commerciaux B2B. Et pourtant, quand on fait le calcul précis — coût réel d'une panne, coût d'un arrêt d'exploitation, probabilité annuelle de panne selon l'âge du parc — le contrat préventif se révèle systématiquement gagnant dès la première ou deuxième année. Cet article détaille le calcul complet avec des données terrain réelles.",
        ],
      },
      {
        heading: "1. Le coût direct d'une panne : ce qu'on paie sur la facture",
        paragraphs: [
          "La facture directe d'une intervention curative (hors contrat) sur une porte sectionnelle industrielle se compose typiquement de :",
          "— Déplacement forfaitaire : 150-250 € HT selon distance depuis le prestataire (souvent majoré +30% en urgence ou en dehors des heures ouvrées).",
          "— Main d'œuvre : 85-120 € HT/heure (compter 1 à 3h selon le diagnostic et la réparation).",
          "— Pièces détachées : très variable (50 € pour un joint, 500-800 € pour une carte motorisation).",
          "— Diagnostic si pièce non immédiatement identifiée : souvent compté en plus (1h facturée).",
          "— TVA 20%.",
          "Moyenne observée sur 5 ans de données IEF & CO : 450 € TTC par intervention curative. Les interventions complexes (remplacement ressort de torsion + câble + joints) peuvent monter à 1200 € TTC. Une carte motorisation à remplacer sur un modèle récent avec programmation : 900-1400 € TTC.",
        ],
      },
      {
        heading: "2. Le coût indirect : l'arrêt d'exploitation",
        paragraphs: [
          "C'est ici que ça devient intéressant — et c'est ce que la plupart des acheteurs sous-estiment lourdement. Le coût d'une panne dépasse largement la seule facture de réparation dès qu'il y a interruption d'exploitation.",
          "Exemples concrets mesurés chez nos clients :",
          "— Entrepôt logistique e-commerce : 1 porte de quai HS = 2 à 4 camions immobilisés (à 120-180 €/h de facturation transporteur) + 3-5 opérateurs logistiques inoccupés (à 35 €/h chargé) + retards livraison avec pénalités clients. Coût moyen mesuré : 1 200 €/heure, soit 9 000-10 000 €/jour complet.",
          "— Plateforme agroalimentaire frigorifique : chambre froide ouverte = rupture chaîne du froid sur stocks exposés + risque sanitaire + nettoyage obligatoire. Coût moyen : 3 500-8 000 €/journée selon volumes et produits.",
          "— Site industriel avec flux PL intensif : porte rapide HS = rallentissement global de la chaîne de production + heures supplémentaires personnel. Coût : 800-2 000 €/heure selon activité.",
          "— Commerce de détail : rideau métallique HS = impossibilité d'ouvrir OU impossibilité de fermer = perte de CA direct OU gardiennage d'urgence. Coût : 200-500 €/heure selon enseigne.",
          "Ces chiffres sont issus d'observations réelles post-interventions IEF & CO sur les 3 dernières années. Le point important : une seule panne avec arrêt d'exploitation de 6 heures peut coûter 10 000-20 000 € selon le secteur.",
        ],
      },
      {
        heading: "3. Le calcul ROI : parc 20 portes sectionnelles intensives",
        paragraphs: [
          "Prenons un exemple réel : un entrepôt e-commerce avec 20 portes sectionnelles industrielles intensives (800-1200 cycles/jour chacune).",
          "Scénario 1 — Pas de contrat (curatif au coup par coup) :",
          "• Probabilité moyenne de panne : 2,5 pannes/porte/an (sur parc non maintenu préventivement)",
          "• Nombre total de pannes annuelles : 50",
          "• Coût facture moyenne : 450 € TTC × 50 = 22 500 € TTC",
          "• Coût arrêt d'exploitation moyen : 3h × 1 200 €/h × 50 = 180 000 € (certaines pannes résolues sans arrêt, compensent en partie)",
          "• Réaliste : 50% des pannes génèrent un arrêt moyen de 3h → 90 000 € de pertes d'exploitation",
          "• Total annuel : ~112 500 € TTC",
          "Scénario 2 — Contrat Or IEF & CO (1 750 €/porte/an) :",
          "• Coût contrat : 20 × 1 750 = 35 000 € HT (42 000 € TTC)",
          "• Probabilité de panne avec maintenance préventive trimestrielle : 0,5 panne/porte/an (réduction 80%)",
          "• Nombre total de pannes : 10 (toutes prises en charge sous contrat = 0 € facture additionnelle)",
          "• SLA 4h → pertes d'exploitation réduites à 50% des cas, moyenne 2h",
          "• Pertes d'exploitation résiduelles : 10 × 50% × 2h × 1 200 €/h = 12 000 €",
          "• Total annuel : ~54 000 € TTC",
          "Économie annuelle : 112 500 € - 54 000 € = 58 500 € HT. Le contrat Or se rentabilise en 7 mois environ, puis génère une économie nette récurrente de 58 500 €/an tout en améliorant la continuité d'activité et la sérénité opérationnelle.",
        ],
      },
      {
        heading: "4. Les bénéfices non chiffrés (mais bien réels)",
        paragraphs: [
          "Au-delà du pur calcul financier, le contrat de maintenance apporte des bénéfices qu'il est plus difficile de chiffrer mais qui font la différence :",
          "• Conformité légale garantie (arrêté 21/12/1993) — protection juridique en cas de contrôle ou d'accident.",
          "• Durée de vie des équipements prolongée : +30% en moyenne, soit des investissements CAPEX reportés de plusieurs années.",
          "• Sécurité personnel : maintenance préventive = détection précoce des défauts potentiellement dangereux.",
          "• Prévisibilité budgétaire : coût fixe annuel lissé vs factures curatives imprévisibles qui explosent les budgets.",
          "• Relation prestataire continue : meilleure connaissance de votre parc par le prestataire, interventions plus rapides et précises.",
          "• Reporting et traçabilité : carnet d'entretien numérique complet, utile en cas de cession, audit ou refinancement.",
        ],
      },
      {
        heading: "Conclusion : le calcul n'est pas si compliqué",
        paragraphs: [
          "Pour un parc professionnel de 5+ portes avec usage significatif (>200 cycles/jour par porte en moyenne), le contrat de maintenance préventif est économiquement gagnant. Le doute n'existe pas pour les sites critiques (logistique, agroalimentaire, hospitalier) où le contrat Or 24/7 est indispensable.",
          "La vraie question n'est pas « dois-je souscrire un contrat ? » mais « quel niveau (Bronze, Argent, Or) est adapté à mon cas ? ». IEF & CO réalise gratuitement un audit de votre parc avec chiffrage du contrat optimal. Contactez-nous.",
        ],
      },
    ],
  },

  {
    slug: "en-1090-exc2-achat-batiment-guide",
    title: "EN 1090 EXC2 expliqué aux acheteurs B2B : ce qu'il faut exiger de son métallier",
    excerpt:
      "La norme EN 1090 EXC2 est incontournable pour tout achat de structure métallique. Guide pratique pour non-spécialistes : ce qu'elle couvre, ce qu'elle exclut, comment vérifier son prestataire.",
    date: "25 mars 2026",
    dateISO: "2026-03-25",
    category: "Normes",
    author: "IEF & CO",
    readingMinutes: 10,
    sections: [
      {
        paragraphs: [
          "Vous êtes acheteur, directeur des achats ou maîtrise d'ouvrage, et vous devez signer un contrat pour la fabrication et la pose d'une structure métallique : charpente d'entrepôt, passerelle industrielle, mezzanine, escalier, garde-corps. On vous a expliqué que le métallier doit être « certifié EN 1090 EXC2 ». Mais concrètement — que signifie cette norme, que couvre-t-elle, pourquoi est-elle obligatoire, et comment vérifier que votre prestataire est vraiment en règle ? Ce guide pratique répond à toutes ces questions pour les non-spécialistes.",
        ],
      },
      {
        heading: "1. Ce qu'est la norme EN 1090 (en une phrase)",
        paragraphs: [
          "La norme EN 1090 (intitulée complète : « Exécution des structures en acier et en aluminium ») est le référentiel européen harmonisé qui régit la fabrication et le marquage CE des structures métalliques porteuses destinées au bâtiment ou aux ouvrages d'art.",
          "En clair : c'est la norme qui garantit qu'une structure acier a été conçue, fabriquée, soudée, contrôlée et livrée selon des standards de qualité européens vérifiables. Sans conformité EN 1090, une charpente métallique ne peut pas légalement être vendue en Europe pour un ouvrage de construction.",
          "La norme se décline en 3 parties : EN 1090-1 (exigences pour le marquage CE), EN 1090-2 (exigences techniques pour les structures acier), EN 1090-3 (pour l'aluminium). En métallerie B2B française, c'est surtout EN 1090-1 et EN 1090-2 qui s'appliquent.",
        ],
      },
      {
        heading: "2. Les 4 classes d'exécution : EXC1 / EXC2 / EXC3 / EXC4",
        paragraphs: [
          "La norme EN 1090 ne s'applique pas de la même manière à toutes les structures. Elle définit 4 classes d'exécution croissantes selon la criticité de l'ouvrage :",
          "• EXC1 : structures secondaires non porteuses (cloisons, garde-corps non structurels). Rarement utilisé.",
          "• EXC2 : structures de bâtiment standard (charpentes d'entrepôts, mezzanines, passerelles légères, escaliers). C'est le niveau adapté à 95% de la métallerie B2B française.",
          "• EXC3 : structures complexes ou à fortes charges dynamiques (ponts secondaires, bâtiments industriels lourds, constructions en zones sismiques).",
          "• EXC4 : structures critiques — ponts autoroutiers majeurs, hôpitaux, centrales nucléaires, infrastructures stratégiques. Très rare.",
          "La classe est déterminée par 3 paramètres : la classe de conséquence CC1-CC3 (gravité d'une défaillance), la catégorie de service SC1-SC2 (fatigue), la catégorie de production PC1-PC2 (soudabilité matériau). En pratique, 99% des charpentes d'entrepôts et bâtiments industriels sont en EXC2.",
        ],
      },
      {
        heading: "3. Ce qu'un métallier EN 1090 EXC2 doit vous garantir",
        paragraphs: [
          "Une entreprise certifiée EN 1090 EXC2 doit disposer d'un système qualité complet et documenté. Concrètement, elle doit vous fournir sur demande les éléments suivants :",
          "• Son certificat EN 1090 EXC2 en cours de validité (délivré par un organisme notifié type AFNOR, Bureau Veritas, Apave).",
          "• Son manuel qualité documentant les processus de fabrication.",
          "• La qualification individuelle des soudeurs (EN ISO 9606, renouvelée tous les 2-3 ans).",
          "• Les modes opératoires de soudage (WPS) documentés et qualifiés (WPQR selon EN ISO 15614).",
          "• Les certificats matière 3.1 selon EN 10204 pour chaque lot d'acier utilisé.",
          "• Les notes de calcul Eurocode 3 (EN 1993) pour chaque ouvrage fabriqué.",
          "• La déclaration de performance (DoP) du produit fini, accompagnée du marquage CE.",
          "• Un responsable de l'exécution en soudage (RWC) qualifié (diplôme IWE/IWT).",
          "Si votre prestataire ne peut pas vous fournir ces documents rapidement, c'est un red flag majeur.",
        ],
      },
      {
        heading: "4. Les questions à poser lors de la consultation",
        paragraphs: [
          "Voici la liste de questions à intégrer systématiquement dans votre consultation de prestataires en métallerie :",
          "1. « Êtes-vous certifié EN 1090 EXC2 ? Pouvez-vous me fournir votre certificat à jour ? »",
          "2. « Vos soudeurs sont-ils qualifiés EN ISO 9606 ? Combien en disposez-vous ? »",
          "3. « Quel organisme notifié vous a certifié ? À quelle date ? »",
          "4. « Avez-vous un responsable de l'exécution en soudage diplômé ? »",
          "5. « Pouvez-vous livrer un DOE complet à la réception (plans conformes, PV, certificats matière) ? »",
          "6. « Vos ouvrages sont-ils livrés avec marquage CE et DoP ? »",
          "7. « Quel est votre atelier ? Puis-je le visiter ? » — une entreprise sérieuse acceptera volontiers.",
          "8. « Pour mon projet, quel sera le RWC responsable ? Ses qualifications ? »",
          "9. « Avez-vous une RC décennale couvrant l'activité métallerie ? »",
          "10. « Quelle est votre méthode de contrôle qualité (PV essais, CND si requis) ? »",
          "Un prestataire IEF & CO ou équivalent sérieux répond sans hésiter et fournit documentation sur demande.",
        ],
      },
      {
        heading: "5. Les signaux d'alerte",
        paragraphs: [
          "À l'inverse, certains signaux doivent vous alerter lors de la consultation :",
          "• Prix anormalement bas (-30% par rapport aux concurrents) : souvent signe d'une absence de qualification ou d'acier low-cost sans certificat matière.",
          "• Refus ou lenteur à fournir le certificat EN 1090 : possible absence ou certificat expiré.",
          "• Absence de mention de notes de calcul Eurocode 3 dans la proposition : dimensionnement hasardeux.",
          "• Pas de devis détaillé poste par poste : manque de transparence fréquent chez les artisans non structurés.",
          "• Absence d'assurance RC décennale visible : disqualifiant immédiat.",
          "• Sous-traitance non déclarée : certaines petites structures sous-traitent la fabrication à des ateliers non certifiés.",
          "En cas de doute, vérifiez le certificat auprès de l'organisme notifié (leurs bases sont publiques).",
        ],
      },
      {
        heading: "Conclusion",
        paragraphs: [
          "Exiger la certification EN 1090 EXC2 n'est pas une formalité administrative — c'est la garantie que votre structure métallique aura été fabriquée selon les standards européens reconnus, avec traçabilité complète des matériaux, qualification des opérateurs, et contrôle qualité documenté. C'est aussi votre protection juridique en cas de sinistre ou de désordre ultérieur.",
          "IEF & CO est certifié EN 1090 EXC2 depuis 2022 par un organisme notifié français. Nous vous remettons systématiquement le dossier technique complet à la réception de chaque ouvrage — notes de calcul Eurocode 3, certificats matière 3.1, PV d'essais de soudage, déclaration de performance CE. Demandez-nous le dossier-type.",
        ],
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
