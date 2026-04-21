export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export const navigation: NavItem[] = [
  {
    label: "Services",
    href: "/services",
    children: [
      { label: "Fermetures industrielles", href: "/services/fermetures-industrielles" },
      { label: "Portails & clôtures", href: "/services/portails-clotures" },
      { label: "Structures métalliques", href: "/services/structures-metalliques" },
      { label: "Menuiserie & vitrerie", href: "/services/menuiserie-vitrerie" },
      { label: "Portes coupe-feu", href: "/services/portes-coupe-feu" },
      { label: "Automatismes", href: "/services/automatismes" },
      { label: "Maintenance & dépannage", href: "/services/maintenance" },
    ],
  },
  {
    label: "Maintenance",
    href: "/maintenance/contrats",
    children: [
      { label: "Contrats Bronze / Argent / Or", href: "/maintenance/contrats" },
      { label: "Dépannage urgent", href: "/depannage" },
      { label: "Maintenance Hörmann", href: "/maintenance/hormann" },
      { label: "Maintenance Crawford", href: "/maintenance/crawford" },
      { label: "Maintenance Maviflex", href: "/maintenance/maviflex" },
      { label: "Maintenance Came", href: "/maintenance/came" },
    ],
  },
  { label: "Réalisations", href: "/realisations" },
  {
    label: "Ressources",
    href: "/glossaire",
    children: [
      { label: "Comparatifs", href: "/comparatifs" },
      { label: "Glossaire technique", href: "/glossaire" },
      { label: "Blog & guides", href: "/blog" },
    ],
  },
  { label: "Estimateur", href: "/estimateur" },
  { label: "Zones d'intervention", href: "/zones-intervention" },
  { label: "À propos", href: "/a-propos" },
  { label: "Contact", href: "/contact" },
];

export const companyInfo = {
  name: "IEF & CO",
  fullName: "IEF AND CO",
  description: "Concepteur et fabricant de solutions metalliques sur mesure",
  address: {
    street: "8 Rue Rene Dubos",
    city: "Groslay",
    postalCode: "95410",
    region: "Ile-de-France",
    country: "FR",
  },
  phone: "+33 1 34 05 87 03",
  phoneDisplay: "01 34 05 87 03",
  email: "contact@iefandco.com",
  website: "https://iefandco.com",
  siren: "880 693 981",
  rcs: "Pontoise",
  capital: "12 000",
  president: "Otman FARIAD",
  founded: 2020,
  naf: "2511Z",
  geo: { lat: 49.0083, lng: 2.3447 },
  areaServed: [
    "Paris",
    "Val-d'Oise",
    "Seine-Saint-Denis",
    "Hauts-de-Seine",
    "Essonne",
    "Yvelines",
    "Seine-et-Marne",
    "Val-de-Marne",
  ],
  social: {
    linkedin: "https://fr.linkedin.com/company/ief-and-co",
  },
};
