"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch, type FieldPath } from "react-hook-form";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  FileUp,
  LoaderCircle,
  Save,
  ShieldCheck,
} from "lucide-react";
import {
  applicationDraftSchema,
  applicationSchema,
  emptyApplication,
  type ApplicationData,
} from "@/lib/application-schema";
import { Button } from "@/components/ui/button";

const LOGO = "https://inphb.edu.ci/wp-content/uploads/2024/03/inphblogo.png";
const DRAFT_KEY = "inphb-creative-application-draft";
const steps = [
  { title: "Informations personnelles", description: "Faisons connaissance." },
  { title: "Votre profil design", description: "Votre parcours et vos domaines." },
  { title: "Vos outils", description: "Les logiciels au cœur de votre pratique." },
  { title: "Design produit", description: "Votre expérience du concret." },
  { title: "Portfolio & engagement", description: "Le dernier pas avant de nous rejoindre." },
];
const experienceOptions = [
  "Branding",
  "Advertising Design",
  "Posters",
  "Illustration",
  "Packaging",
  "Product Mockups",
  "Motion Design",
  "Other",
] as const;
const softwareOptions = [
  "Photoshop",
  "Illustrator",
  "Canva",
  "CorelDRAW",
  "Blender",
  "After Effects",
  "Other",
] as const;
const productOptions = ["Hoodies", "T-shirts", "Bags", "Mugs", "Packaging", "Accessories"] as const;

type StepFields = FieldPath<ApplicationData>[];
const fieldsByStep: StepFields[] = [
  ["fullName", "whatsapp", "email", "school", "level", "specialty"],
  ["yearsExperience", "designLevel", "experienceAreas"],
  ["softwareSkills", "mainSoftware"],
  ["hasPhysicalProductExperience", "productTypes", "hasProfessionalMockups"],
  ["portfolioUrl", "commitment"],
];

const G = { fontFamily: "var(--font-grotesk)" };
const inputClass =
  "min-h-12 w-full rounded-xl border-2 border-ink bg-bg px-4 text-base text-ink outline-none transition placeholder:text-muted focus:border-ember focus:ring-4 focus:ring-ember/25";
const choice = (on: boolean) =>
  `rounded-xl border-2 border-ink text-left transition ${on ? "bg-brand text-white shadow-[3px_3px_0_var(--ink)]" : "bg-bg text-ink hover:bg-tint"}`;

function Field({
  label,
  error,
  hint,
  children,
}: {
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-ink" style={G}>
        {label}
      </span>
      {children}
      {hint && !error && <span className="mt-1.5 block text-xs text-muted">{hint}</span>}
      {error && (
        <span role="alert" className="mt-1.5 block text-xs font-bold text-red-600">
          {error}
        </span>
      )}
    </label>
  );
}

function MultiChoice<Option extends string>({
  options,
  value,
  onChange,
  error,
}: {
  options: readonly Option[];
  value: Option[];
  onChange: (value: Option[]) => void;
  error?: string;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {options.map((option) => {
          const selected = value.includes(option);
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() =>
                onChange(selected ? value.filter((i) => i !== option) : [...value, option])
              }
              className={`flex min-h-11 items-center gap-2 px-3 text-sm font-semibold ${choice(selected)}`}
            >
              <span
                className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 ${selected ? "border-white bg-white text-brand" : "border-ink"}`}
              >
                {selected && <Check size={12} strokeWidth={3} />}
              </span>
              {option}
            </button>
          );
        })}
      </div>
      {error && (
        <span role="alert" className="mt-2 block text-xs font-bold text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}

function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string; detail?: string }[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={`p-4 ${choice(value === o.value)}`}
        >
          <span className="block text-base font-bold" style={G}>
            {o.label}
          </span>
          {o.detail && (
            <span
              className={`mt-1 block text-xs leading-5 ${value === o.value ? "text-white/85" : "text-muted"}`}
            >
              {o.detail}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function ProgressRing({ percent }: { percent: number }) {
  const r = 52,
    c = 2 * Math.PI * r;
  return (
    <div className="relative h-36 w-36" role="img" aria-label={`Dossier complété à ${percent} %`}>
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={r} fill="none" stroke="var(--tint)" strokeWidth="12" />
        <motion.circle
          cx="60"
          cy="60"
          r={r}
          fill="none"
          stroke="var(--g)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={c}
          animate={{ strokeDashoffset: c * (1 - percent / 100) }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <b className="block text-3xl leading-none text-ink" style={G}>
            {percent}%
          </b>
          <span className="text-[11px] text-muted">complété</span>
        </div>
      </div>
    </div>
  );
}

export function ApplicationForm() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [draftReady, setDraftReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    reset,
    control,
    getFieldState,
    formState,
  } = useForm<ApplicationData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: emptyApplication,
    mode: "onTouched",
  });
  const watchedValues = useWatch<ApplicationData>({ control });
  const { errors } = formState;
  const values = useMemo(() => ({ ...emptyApplication, ...watchedValues }), [watchedValues]);

  const percent = useMemo(() => {
    const done = (name: FieldPath<ApplicationData>) => {
      if (name === "portfolioUrl") return Boolean(values.portfolioUrl?.trim()) || Boolean(file);
      if (name === "productTypes")
        return values.hasPhysicalProductExperience === "no" || values.productTypes.length > 0;
      const v = values[name as keyof ApplicationData];
      if (Array.isArray(v)) return v.length > 0;
      if (typeof v === "string") return v.trim().length > 0;
      if (typeof v === "boolean") return v;
      return step > fieldsByStep.findIndex((f) => f.includes(name));
    };
    const all = fieldsByStep.flat();
    return Math.round((all.filter(done).length / all.length) * 100);
  }, [values, file, step]);

  useEffect(() => {
    const saved = window.localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const parsed = applicationDraftSchema.safeParse(JSON.parse(saved));
        if (parsed.success) reset({ ...emptyApplication, ...parsed.data });
      } catch {
        window.localStorage.removeItem(DRAFT_KEY);
      }
    }
    setDraftReady(true);
  }, [reset]);

  useEffect(() => {
    if (!draftReady) return;
    let timeout: number | undefined;
    const subscription = watch((value) => {
      setIsSaving(true);
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {
        window.localStorage.setItem(DRAFT_KEY, JSON.stringify(value));
        setIsSaving(false);
      }, 400);
    });
    return () => {
      window.clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, [draftReady, watch]);

  const updateExperienceAreas = (value: ApplicationData["experienceAreas"]) =>
    setValue("experienceAreas", value, { shouldDirty: true, shouldValidate: true });
  const updateSoftwareSkills = (value: ApplicationData["softwareSkills"]) =>
    setValue("softwareSkills", value, { shouldDirty: true, shouldValidate: true });
  const updateProductTypes = (value: ApplicationData["productTypes"]) =>
    setValue("productTypes", value, { shouldDirty: true, shouldValidate: true });

  const nextStep = async () => {
    const valid = await trigger(fieldsByStep[step], { shouldFocus: true });
    if (valid && step < steps.length - 1) setStep(step + 1);
  };

  const submit = async (application: ApplicationData) => {
    setSubmitError("");
    if (
      file &&
      (file.size > 10 * 1024 * 1024 ||
        !["image/jpeg", "image/png", "application/pdf"].includes(file.type))
    ) {
      setFileError("Le fichier doit être un JPG, PNG ou PDF de 10 Mo maximum.");
      return;
    }
    setFileError("");
    setSubmitting(true);
    try {
      const data = new FormData();
      data.set("application", JSON.stringify(application));
      if (file) data.set("portfolioFile", file);
      const response = await fetch("/api/applications", { method: "POST", body: data });
      const result: { id?: string; error?: string } = await response.json();
      if (!response.ok) throw new Error(result.error ?? "La candidature n’a pas pu être envoyée.");
      window.localStorage.removeItem(DRAFT_KEY);
      router.push("/apply/success");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Une erreur inattendue est survenue.",
      );
      setSubmitting(false);
    }
  };

  const errorFor = (name: FieldPath<ApplicationData>) =>
    getFieldState(name, formState).error?.message;
  const saveLabel = isSaving ? (
    <>
      <Save size={13} /> Enregistrement…
    </>
  ) : (
    <>
      <CheckCircle2 size={13} /> Brouillon enregistré
    </>
  );

  return (
    <div className="page min-h-screen">
      <header>
        <div className="w">
          <Link href="/" className="logo" aria-label="INP-HB, accueil">
            <Image
              src={LOGO}
              alt="INP-HB"
              width={140}
              height={46}
              priority
              unoptimized
              style={{ height: 40, width: "auto" }}
            />
          </Link>
          <Link href="/" className="text-sm font-semibold text-ink hover:text-brand">
            Retour à l’accueil
          </Link>
        </div>
      </header>

      <div className="w grid gap-10 py-8 md:grid-cols-[300px_1fr] md:py-14">
        {/* Parcours */}
        <aside className="hidden md:block">
          <div className="sticky top-24">
            <span className="kick">Candidature graphiste</span>
            <h1 className="text-4xl font-bold">Rejoignez l’équipe créative.</h1>
            <div className="mt-8 flex items-center gap-5">
              <ProgressRing percent={percent} />
              <p className="text-sm text-muted">
                Quelques minutes suffisent pour nous montrer votre univers.
              </p>
            </div>
            <ol className="relative mt-8 space-y-5">
              <span
                aria-hidden
                className="absolute bottom-3 left-[15px] top-3 border-l-[3px] border-dashed border-brand"
              />
              {steps.map((item, index) => (
                <li key={item.title} className="relative flex items-center gap-4">
                  <span
                    className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-ink text-xs font-bold ${index < step ? "bg-brand text-white" : index === step ? "bg-ember text-[#0A0A0A]" : "bg-bg text-muted"}`}
                    style={G}
                  >
                    {index < step ? <Check size={14} strokeWidth={3} /> : index + 1}
                  </span>
                  <span
                    className={`text-sm font-bold ${index === step ? "text-ink" : "text-muted"}`}
                    style={G}
                  >
                    {item.title}
                  </span>
                </li>
              ))}
            </ol>
            <div className="mt-8 flex items-center gap-2 text-xs text-muted">
              <ShieldCheck size={15} className="text-brand" /> Vos informations restent
              confidentielles.
            </div>
          </div>
        </aside>

        <section className="min-w-0 py-0">
          <div className="mb-4 md:hidden">
            <div
              className="mb-2 flex items-center justify-between text-xs font-bold text-ink"
              style={G}
            >
              <span>
                Étape {step + 1} sur {steps.length}
              </span>
              <span>{percent}% complété</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full border-2 border-ink bg-bg">
              <motion.div
                className="h-full bg-brand"
                animate={{ width: `${percent}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          <div className="rounded-[28px] border-2 border-ink bg-bg p-5 shadow-[8px_8px_0_var(--g)] sm:p-8 md:p-10">
            <div className="flex items-start justify-between gap-4 border-b-2 border-ink pb-6">
              <div>
                <span className="text-xs font-bold text-brand" style={G}>
                  Étape {step + 1} / {steps.length}
                </span>
                <h2 className="mt-1 text-3xl font-bold md:text-4xl">{steps[step].title}</h2>
                <p className="mt-2 text-sm text-muted">{steps[step].description}</p>
              </div>
              <span className="hidden items-center gap-1.5 rounded-full border-2 border-ink bg-tint px-3 py-1.5 text-xs font-semibold text-ink sm:inline-flex">
                {saveLabel}
              </span>
            </div>

            <form onSubmit={handleSubmit(submit)} noValidate>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 36 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -36 }}
                  transition={{ duration: 0.28, ease: "easeOut" }}
                  className="space-y-6 py-7"
                >
                  {step === 0 && (
                    <div className="grid gap-5 sm:grid-cols-2">
                      <Field label="Nom complet" error={errorFor("fullName")}>
                        <input
                          autoComplete="name"
                          placeholder="Ex. Aïcha Kouamé"
                          className={inputClass}
                          {...register("fullName")}
                        />
                      </Field>
                      <Field
                        label="Numéro WhatsApp"
                        error={errorFor("whatsapp")}
                        hint="Avec l’indicatif du pays si possible."
                      >
                        <input
                          type="tel"
                          autoComplete="tel"
                          placeholder="+225 07 00 00 00 00"
                          className={inputClass}
                          {...register("whatsapp")}
                        />
                      </Field>
                      <Field label="Adresse e-mail" error={errorFor("email")}>
                        <input
                          type="email"
                          autoComplete="email"
                          placeholder="vous@exemple.com"
                          className={inputClass}
                          {...register("email")}
                        />
                      </Field>
                      <Field label="École / établissement" error={errorFor("school")}>
                        <input
                          autoComplete="organization"
                          placeholder="Votre établissement"
                          className={inputClass}
                          {...register("school")}
                        />
                      </Field>
                      <Field label="Niveau d’études" error={errorFor("level")}>
                        <input
                          placeholder="Ex. Cycle ingénieur, Master 2…"
                          className={inputClass}
                          {...register("level")}
                        />
                      </Field>
                      <Field label="Spécialité" error={errorFor("specialty")}>
                        <input
                          placeholder="Ex. Design graphique"
                          className={inputClass}
                          {...register("specialty")}
                        />
                      </Field>
                    </div>
                  )}
                  {step === 1 && (
                    <div className="space-y-6">
                      <Field
                        label="Années d’expérience"
                        error={errorFor("yearsExperience")}
                        hint="Une expérience académique ou personnelle compte aussi."
                      >
                        <input
                          type="number"
                          min="0"
                          max="50"
                          className={inputClass}
                          {...register("yearsExperience", { valueAsNumber: true })}
                        />
                      </Field>
                      <Field
                        label="Comment décririez-vous votre niveau ?"
                        error={errorFor("designLevel")}
                      >
                        <RadioGroup
                          value={values.designLevel}
                          onChange={(v) =>
                            setValue("designLevel", v as ApplicationData["designLevel"], {
                              shouldValidate: true,
                            })
                          }
                          options={[
                            {
                              value: "Intermediate",
                              label: "Intermédiaire",
                              detail: "Des bases solides, une pratique régulière.",
                            },
                            {
                              value: "Advanced",
                              label: "Avancé",
                              detail: "Autonome, avec un portfolio affirmé.",
                            },
                            {
                              value: "Expert",
                              label: "Expert",
                              detail: "Une maîtrise approfondie et une vraie vision.",
                            },
                          ]}
                        />
                      </Field>
                      <Field label="Vos domaines d’expérience" error={errorFor("experienceAreas")}>
                        <MultiChoice
                          options={experienceOptions}
                          value={values.experienceAreas}
                          onChange={updateExperienceAreas}
                          error={errorFor("experienceAreas")}
                        />
                      </Field>
                    </div>
                  )}
                  {step === 2 && (
                    <div className="space-y-6">
                      <Field
                        label="Quels logiciels utilisez-vous ?"
                        error={errorFor("softwareSkills")}
                        hint="Sélectionnez tous les outils que vous maîtrisez."
                      >
                        <MultiChoice
                          options={softwareOptions}
                          value={values.softwareSkills}
                          onChange={(value) => {
                            updateSoftwareSkills(value);
                            if (value.length && !value.some((s) => s === values.mainSoftware))
                              setValue("mainSoftware", value[0], { shouldValidate: true });
                          }}
                          error={errorFor("softwareSkills")}
                        />
                      </Field>
                      <Field
                        label="Quel est votre logiciel principal ?"
                        error={errorFor("mainSoftware")}
                      >
                        <select
                          className={inputClass}
                          value={values.mainSoftware}
                          onChange={(e) => {
                            const s = softwareOptions.find((o) => o === e.target.value);
                            if (s) setValue("mainSoftware", s, { shouldValidate: true });
                          }}
                        >
                          <option value="">Choisir parmi vos logiciels</option>
                          {values.softwareSkills.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>
                  )}
                  {step === 3 && (
                    <div className="space-y-7">
                      <Field
                        label="Avez-vous déjà travaillé sur des produits physiques ?"
                        error={errorFor("hasPhysicalProductExperience")}
                      >
                        <RadioGroup
                          value={values.hasPhysicalProductExperience}
                          onChange={(v) => {
                            setValue("hasPhysicalProductExperience", v as "yes" | "no", {
                              shouldValidate: true,
                            });
                            if (v === "no") updateProductTypes([]);
                          }}
                          options={[
                            {
                              value: "yes",
                              label: "Oui",
                              detail: "J’ai déjà conçu pour des objets réels.",
                            },
                            {
                              value: "no",
                              label: "Pas encore",
                              detail: "Je souhaite développer cette expérience.",
                            },
                          ]}
                        />
                      </Field>
                      {values.hasPhysicalProductExperience === "yes" && (
                        <Field label="Quels types de produits ?" error={errorFor("productTypes")}>
                          <MultiChoice
                            options={productOptions}
                            value={values.productTypes}
                            onChange={updateProductTypes}
                            error={errorFor("productTypes")}
                          />
                        </Field>
                      )}
                      <Field
                        label="Avez-vous déjà réalisé des mockups professionnels ?"
                        error={errorFor("hasProfessionalMockups")}
                      >
                        <RadioGroup
                          value={values.hasProfessionalMockups}
                          onChange={(v) =>
                            setValue("hasProfessionalMockups", v as "yes" | "no", {
                              shouldValidate: true,
                            })
                          }
                          options={[
                            { value: "yes", label: "Oui" },
                            { value: "no", label: "Pas encore" },
                          ]}
                        />
                      </Field>
                    </div>
                  )}
                  {step === 4 && (
                    <div className="space-y-6">
                      <Field
                        label="Lien vers votre portfolio"
                        error={errorFor("portfolioUrl")}
                        hint="Behance, Dribbble, site personnel… Un lien ou un fichier suffit."
                      >
                        <input
                          type="url"
                          placeholder="https://…"
                          className={inputClass}
                          {...register("portfolioUrl")}
                        />
                      </Field>
                      <Field
                        label="Joindre un portfolio (optionnel)"
                        error={fileError}
                        hint="JPG, PNG ou PDF · 10 Mo maximum"
                      >
                        <label
                          className={`flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-5 text-center transition ${fileError ? "border-red-500 bg-red-50 dark:bg-red-950/30" : "border-ink bg-tint hover:border-ember"}`}
                        >
                          <FileUp size={24} className="text-ember" />
                          <span className="mt-2 text-sm font-bold text-ink" style={G}>
                            {file ? file.name : "Choisir un fichier"}
                          </span>
                          <span className="mt-1 text-xs text-muted">
                            {file
                              ? `${(file.size / 1024 / 1024).toFixed(2)} Mo`
                              : "ou déposer votre fichier ici"}
                          </span>
                          <input
                            type="file"
                            accept=".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf"
                            className="sr-only"
                            onChange={(e) => {
                              const s = e.target.files?.[0] ?? null;
                              setFile(s);
                              setFileError(
                                s && s.size > 10 * 1024 * 1024
                                  ? "Le fichier dépasse la limite de 10 Mo."
                                  : "",
                              );
                            }}
                          />
                        </label>
                        {file && (
                          <button
                            type="button"
                            className="mt-2 text-xs font-bold text-ink underline"
                            onClick={() => setFile(null)}
                          >
                            Retirer le fichier
                          </button>
                        )}
                      </Field>
                      <label
                        className={`flex cursor-pointer gap-3 rounded-xl border-2 p-4 transition ${errorFor("commitment") ? "border-red-500 bg-red-50 dark:bg-red-950/30" : "border-ink hover:bg-tint"}`}
                      >
                        <input
                          type="checkbox"
                          className="mt-1 h-5 w-5 accent-[#067138]"
                          checked={values.commitment}
                          onChange={(e) =>
                            setValue("commitment", e.target.checked, { shouldValidate: true })
                          }
                        />
                        <span>
                          <span className="block text-sm font-bold leading-6 text-ink">
                            I am ready to officially join the team and actively participate in the
                            project.
                          </span>
                          <span className="mt-1 block text-xs leading-5 text-muted">
                            Je suis prêt·e à rejoindre officiellement l’équipe et à participer
                            activement au projet. Cet engagement est obligatoire.
                          </span>
                        </span>
                      </label>
                      {errorFor("commitment") && (
                        <span role="alert" className="-mt-4 block text-xs font-bold text-red-600">
                          {errorFor("commitment")}
                        </span>
                      )}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {submitError && (
                <div
                  role="alert"
                  className="mb-5 rounded-xl border-2 border-red-500 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
                >
                  {submitError}
                </div>
              )}
              <div className="flex items-center justify-between gap-3 border-t-2 border-ink pt-5">
                {step > 0 ? (
                  <Button type="button" variant="secondary" onClick={() => setStep(step - 1)}>
                    <ArrowLeft size={16} /> Précédent
                  </Button>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted">
                    <Save size={13} /> Brouillon sauvegardé automatiquement
                  </span>
                )}
                {step < steps.length - 1 ? (
                  <Button type="button" onClick={nextStep}>
                    Continuer <ArrowRight size={16} />
                  </Button>
                ) : (
                  <Button type="submit" variant="accent" disabled={submitting}>
                    {submitting ? (
                      <>
                        <LoaderCircle className="animate-spin" size={16} /> Envoi…
                      </>
                    ) : (
                      <>
                        Envoyer ma candidature <ArrowRight size={16} />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </div>
          <p className="mt-5 text-center text-xs leading-5 text-muted">
            En envoyant ce formulaire, vous acceptez que les informations communiquées soient
            utilisées pour l’étude de votre candidature.
          </p>
        </section>
      </div>
    </div>
  );
}
