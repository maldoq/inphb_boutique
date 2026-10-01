import type { Metadata } from "next";
import { ApplicationForm } from "@/components/application-form";

export const metadata: Metadata = {
  title: "Candidater",
  description:
    "Candidatez pour rejoindre l’équipe créative de la Boutique institutionnelle de l’INP-HB.",
  robots: { index: false, follow: false },
};

export default function ApplyPage() {
  return <ApplicationForm />;
}
