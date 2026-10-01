import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  ApplicationRow,
  ApplicationStatus,
  ListParams,
  NewApplicationRow,
  Page,
} from "@/lib/types";

export const BUCKET = process.env.SUPABASE_STORAGE_BUCKET ?? "applications";

export class RepositoryError extends Error {
  constructor(
    message: string,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "RepositoryError";
  }
}

/** Accès aux données uniquement : aucune règle métier ici. Le client est injecté. */
export function applicationsRepository(db: SupabaseClient) {
  return {
    async insert(row: NewApplicationRow) {
      const { data, error } = await db.from("applications").insert(row).select("id").single();
      if (error) throw new RepositoryError("Insertion de la candidature impossible.", error);
      return data as { id: string };
    },

    async findById(id: string) {
      const { data, error } = await db.from("applications").select("*").eq("id", id).maybeSingle();
      if (error) throw new RepositoryError("Lecture de la candidature impossible.", error);
      return data as ApplicationRow | null;
    },

    async list({
      page = 1,
      pageSize = 20,
      status,
      minScore,
      sort = "score",
    }: ListParams = {}): Promise<Page<ApplicationRow>> {
      const from = (page - 1) * pageSize;
      let query = db.from("applications").select("*", { count: "exact" });
      if (status) query = query.eq("status", status);
      if (minScore !== undefined) query = query.gte("candidate_score", minScore);
      query =
        sort === "score"
          ? query
              .order("candidate_score", { ascending: false })
              .order("submitted_at", { ascending: false })
          : query.order("submitted_at", { ascending: false });
      const { data, error, count } = await query.range(from, from + pageSize - 1);
      if (error) throw new RepositoryError("Liste des candidatures indisponible.", error);
      return { rows: (data ?? []) as ApplicationRow[], total: count ?? 0, page, pageSize };
    },

    async updateStatus(id: string, status: ApplicationStatus) {
      const { error } = await db.from("applications").update({ status }).eq("id", id);
      if (error) throw new RepositoryError("Mise à jour du statut impossible.", error);
    },

    async uploadPortfolio(path: string, file: File) {
      const { error } = await db.storage
        .from(BUCKET)
        .upload(path, file, { contentType: file.type, upsert: false });
      if (error) throw new RepositoryError("Téléversement du portfolio impossible.", error);
    },

    async removePortfolio(path: string) {
      const { error } = await db.storage.from(BUCKET).remove([path]);
      if (error) throw new RepositoryError("Suppression du portfolio impossible.", error);
    },

    async signedPortfolioUrl(path: string, expiresInSeconds = 300) {
      const { data, error } = await db.storage.from(BUCKET).createSignedUrl(path, expiresInSeconds);
      if (error) throw new RepositoryError("Lien du portfolio indisponible.", error);
      return data.signedUrl;
    },
  };
}

export type ApplicationsRepository = ReturnType<typeof applicationsRepository>;
