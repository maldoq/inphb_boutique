import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Client navigateur (clé anon). Il ne peut PAS lire ni écrire la table `applications`
 * (RLS activée, droits révoqués pour anon/authenticated) : c'est voulu.
 * Les écritures passent par l'API serveur (service role). Ce client sert aux
 * fonctions publiques exposées explicitement, comme le suivi de candidature.
 */
let browserClient: SupabaseClient | null = null;

export function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function getSupabase(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon)
    throw new Error("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY manquantes.");
  browserClient ??= createClient(url, anon, { auth: { persistSession: false } });
  return browserClient;
}

export type SubmissionStatus = "received" | "reviewing" | "shortlisted" | "accepted" | "rejected";

/** Suivi public : on connaît la référence (UUID) reçue à l'envoi, on obtient uniquement le statut. */
export async function getSubmissionStatus(reference: string) {
  const { data, error } = await getSupabase().rpc("get_application_status", { p_id: reference });
  if (error) throw new Error("Impossible de récupérer le statut de la candidature.");
  const row = (data as { status: SubmissionStatus; submitted_at: string }[] | null)?.[0];
  return row ?? null;
}
