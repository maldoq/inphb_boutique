import { z } from "zod";

const requiredText = (label: string, max = 120) =>
  z.string().trim().min(1, `${label} est obligatoire`).max(max, `${label} est trop long`);

const experienceAreas = [
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
const productTypes = ["Hoodies", "T-shirts", "Bags", "Mugs", "Packaging", "Accessories"] as const;

const applicationFields = {
  fullName: requiredText("Le nom complet"),
  whatsapp: requiredText("Le numéro WhatsApp", 30),
  email: z.string().trim().email("Adresse e-mail invalide").max(254),
  school: requiredText("L’établissement"),
  level: requiredText("Le niveau d’études", 80),
  specialty: requiredText("La spécialité"),
  yearsExperience: z.coerce.number().int().min(0).max(50),
  designLevel: z.enum(["Intermediate", "Advanced", "Expert"], {
    errorMap: () => ({ message: "Sélectionnez votre niveau" }),
  }),
  experienceAreas: z.array(z.enum(experienceAreas)).min(1, "Sélectionnez au moins un domaine"),
  softwareSkills: z.array(z.enum(softwareOptions)).min(1, "Sélectionnez au moins un logiciel"),
  mainSoftware: z.enum(softwareOptions, {
    errorMap: () => ({ message: "Sélectionnez votre logiciel principal" }),
  }),
  hasPhysicalProductExperience: z.enum(["yes", "no"]),
  productTypes: z.array(z.enum(productTypes)),
  hasProfessionalMockups: z.enum(["yes", "no"]),
  portfolioUrl: z
    .string()
    .trim()
    .max(2048, "Le lien est trop long")
    .refine((value) => !value || z.string().url().safeParse(value).success, "Entrez une URL valide")
    .optional()
    .default(""),
  commitment: z.boolean().refine((value) => value, "Votre engagement est requis pour candidater."),
};

const applicationBaseSchema = z.object(applicationFields);

export const applicationDraftSchema = applicationBaseSchema
  .extend({ commitment: z.boolean() })
  .partial();

export const applicationSchema = applicationBaseSchema.superRefine((data, ctx) => {
  if (data.hasPhysicalProductExperience === "yes" && data.productTypes.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["productTypes"],
      message: "Sélectionnez au moins un type de produit",
    });
  }
  if (data.softwareSkills.length > 0 && !data.softwareSkills.includes(data.mainSoftware)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["mainSoftware"],
      message: "Choisissez un logiciel déjà sélectionné",
    });
  }
});

export type ApplicationData = z.infer<typeof applicationSchema>;

export const emptyApplication: ApplicationData = {
  fullName: "",
  whatsapp: "",
  email: "",
  school: "",
  level: "",
  specialty: "",
  yearsExperience: 0,
  designLevel: "Intermediate",
  experienceAreas: [],
  softwareSkills: [],
  mainSoftware: "Photoshop",
  hasPhysicalProductExperience: "no",
  productTypes: [],
  hasProfessionalMockups: "no",
  portfolioUrl: "",
  commitment: false,
};
