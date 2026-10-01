export const siteConfig = {
  name: "Boutique institutionnelle de l’INP-HB",
  shortName: "Boutique INP-HB",
  description:
    "Rejoignez l’équipe créative qui donnera son image à la boutique officielle de l’INP-HB.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://boutique.inphb.ci",
};

export const recruitmentDates = [
  { label: "Ouverture des candidatures", date: "Dès maintenant", status: "current" },
  { label: "Clôture des candidatures", date: "Date à confirmer", status: "upcoming" },
  { label: "Étude des dossiers", date: "Après la clôture", status: "upcoming" },
  { label: "Lancement du projet", date: "Début novembre 2026", status: "upcoming" },
] as const;
