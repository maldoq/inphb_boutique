import type { SupabaseClient } from "@supabase/supabase-js";
import type { ApplicationData } from "@/lib/application-schema";
import { calculateCandidateScore } from "@/lib/scoring";
import { createSupabaseAdmin } from "@/lib/supabase-admin";
import { applicationsRepository } from "@/lib/repositories/applications.repository";
import type { ApplicationStatus, ListParams, NewApplicationRow } from "@/lib/types";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "application/pdf"]);
const EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "application/pdf": "pdf",
};

/** Erreur métier : `status` est le code HTTP à renvoyer, `message` est affichable à l'utilisateur. */
export class ServiceError extends Error {
  constructor(
    message: string,
    readonly status = 400,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}

async function hasValidSignature(file: File) {
  const b = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  if (file.type === "image/jpeg") return b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff;
  if (file.type === "image/png")
    return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((x, i) => b[i] === x);
  if (file.type === "application/pdf") return new TextDecoder().decode(b.slice(0, 5)) === "%PDF-";
  return false;
}

function toRow(a: ApplicationData, filePath: string | null, score: number): NewApplicationRow {
  return {
    full_name: a.fullName,
    whatsapp: a.whatsapp,
    email: a.email,
    school: a.school,
    education_level: a.level,
    specialty: a.specialty,
    years_experience: a.yearsExperience,
    design_level: a.designLevel,
    experience_areas: a.experienceAreas,
    software_skills: a.softwareSkills,
    main_software: a.mainSoftware,
    has_physical_product_experience: a.hasPhysicalProductExperience === "yes",
    product_types: a.productTypes,
    has_professional_mockups: a.hasProfessionalMockups === "yes",
    portfolio_url: a.portfolioUrl || null,
    portfolio_file_path: filePath,
    commitment: a.commitment,
    candidate_score: score,
  };
}

export function createApplicationsService(db: SupabaseClient = createSupabaseAdmin()) {
  const repo = applicationsRepository(db);

  return {
    /** Envoi d'une candidature : contrôle du fichier, upload, score, insertion, nettoyage si échec. */
    async submit(application: ApplicationData, file: File | null) {
      if (
        file &&
        (file.size > MAX_FILE_SIZE ||
          !ACCEPTED_TYPES.has(file.type) ||
          !(await hasValidSignature(file)))
      ) {
        throw new ServiceError("Le fichier doit être un JPG, PNG ou PDF de 10 Mo maximum.", 400);
      }

      let filePath: string | null = null;
      if (file) {
        filePath = `portfolios/${crypto.randomUUID()}.${EXTENSIONS[file.type]}`;
        try {
          await repo.uploadPortfolio(filePath, file);
        } catch (error) {
          console.error("Portfolio upload failed", error);
          throw new ServiceError("Le portfolio n’a pas pu être téléversé. Réessayez.", 502, error);
        }
      }

      try {
        const score = calculateCandidateScore(application, Boolean(file));
        return await repo.insert(toRow(application, filePath, score));
      } catch (error) {
        console.error("Application insert failed", error);
        if (filePath)
          await repo
            .removePortfolio(filePath)
            .catch((e) => console.error("Portfolio cleanup failed", e));
        throw new ServiceError(
          "Votre candidature n’a pas pu être enregistrée. Réessayez.",
          502,
          error,
        );
      }
    },

    // --- Préparation du futur tableau de bord admin ---
    list: (params?: ListParams) => repo.list(params),
    get: (id: string) => repo.findById(id),
    changeStatus: (id: string, status: ApplicationStatus) => repo.updateStatus(id, status),
    async portfolioLink(id: string) {
      const row = await repo.findById(id);
      if (!row) throw new ServiceError("Candidature introuvable.", 404);
      if (!row.portfolio_file_path) return row.portfolio_url;
      return repo.signedPortfolioUrl(row.portfolio_file_path);
    },
  };
}

export type ApplicationsService = ReturnType<typeof createApplicationsService>;
