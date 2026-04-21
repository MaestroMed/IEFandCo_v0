export interface Testimonial {
  id: number;
  name: string;
  company: string;
  text: string;
  rating: number;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Mr Benjamin",
    company: "LAMY",
    text: "Dire que cette modernisation de 3 mois a ete une tache herculeenne serait un euphemisme. A ce jour, je reste convaincu qu'aucune autre entreprise de construction dans la region n'aurait pu gerer une telle tache et la mener a bien avec succes.",
    rating: 5,
  },
  {
    id: 2,
    name: "Thomas Owaller",
    company: "",
    text: "Tout au long du projet, IEF & Co a offert un service professionnel et fiable a chaque etape. L'equipe a gere le projet de bout en bout, faisant preuve de determination pour livrer notre nouvel entrepot et espace de bureaux selon les normes les plus elevees.",
    rating: 5,
  },
  {
    id: 3,
    name: "Ulysse Lefebvre",
    company: "",
    text: "Toute l'equipe d'IEF & Co m'a inspire une grande confiance et le projet s'est deroule sans accroc du debut a la fin. L'equipe sur le chantier a fait preuve de competences et de connaissances exceptionnelles, et je suis satisfait a 101% du resultat final.",
    rating: 5,
  },
];
