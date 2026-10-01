"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

function Reference() {
  const ref = useSearchParams().get("ref");
  if (!ref) return null;
  return (
    <div className="mt-6 rounded-xl border-2 border-dashed border-ink bg-tint px-4 py-3 text-left">
      <span className="block text-xs font-bold text-muted">Votre référence de suivi</span>
      <code className="mt-1 block break-all text-sm font-bold text-ink">{ref}</code>
    </div>
  );
}

export default function ApplicationSuccessPage() {
  return (
    <main className="page grid min-h-screen place-items-center px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl rounded-[28px] border-2 border-ink bg-bg p-8 text-center shadow-[8px_8px_0_var(--g)] md:p-14"
      >
        <motion.div
          initial={{ scale: 0.4, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", delay: 0.15 }}
          className="mx-auto grid h-20 w-20 place-items-center rounded-full border-2 border-ink bg-brand text-white"
        >
          <Check size={34} strokeWidth={3} />
        </motion.div>
        <span className="kick mt-8">Candidature envoyée</span>
        <h1 className="text-4xl font-bold md:text-5xl">Merci de faire partie de l’aventure.</h1>
        <p className="mt-5 text-base leading-7 text-muted">
          Votre candidature a bien été reçue. L’équipe étudiera votre profil et vous recontactera si
          votre candidature est retenue pour la suite du projet.
        </p>
        <p className="mt-3 text-sm text-muted">
          Pensez à surveiller votre boîte mail et votre WhatsApp.
        </p>
        <Suspense fallback={null}>
          <Reference />
        </Suspense>
        <ButtonLink href="/" variant="secondary" className="mt-9">
          <ArrowLeft size={16} /> Retour à l’accueil
        </ButtonLink>
      </motion.div>
    </main>
  );
}
