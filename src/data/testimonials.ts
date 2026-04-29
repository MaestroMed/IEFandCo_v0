export interface Testimonial {
  id: number;
  name: string;
  company: string;
  text: string;
  rating: number;
  /** Optional avatar uploaded from the BO (testimonials.photoMediaId). */
  photoUrl?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Mr Benjamin",
    company: "LAMY",
    text: "Dire que cette modernisation de 3 mois a été une tâche herculéenne serait un euphémisme. À ce jour, je reste convaincu qu'aucune autre entreprise de construction dans la région n'aurait pu gérer une telle tâche et la mener à bien avec succès.",
    rating: 5,
  },
  {
    id: 2,
    name: "Thomas Owaller",
    company: "",
    text: "Tout au long du projet, IEF & Co a offert un service professionnel et fiable à chaque étape. L'équipe a géré le projet de bout en bout, faisant preuve de détermination pour livrer notre nouvel entrepôt et espace de bureaux selon les normes les plus élevées.",
    rating: 5,
  },
  {
    id: 3,
    name: "Ulysse Lefebvre",
    company: "",
    text: "Toute l'équipe d'IEF & Co m'a inspiré une grande confiance et le projet s'est déroulé sans accroc du début à la fin. L'équipe sur le chantier a fait preuve de compétences et de connaissances exceptionnelles, et je suis satisfait à 101% du résultat final.",
    rating: 5,
  },
];
