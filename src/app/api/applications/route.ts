import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { applicationSchema } from "@/lib/application-schema";
import { calculateCandidateScore } from "@/lib/scoring";
import { createSupabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "application/pdf"]);

async function hasValidFileSignature(file: File) {
  const bytes = new Uint8Array(await file.slice(0, 8).arrayBuffer());
  if (file.type === "image/jpeg")
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (file.type === "image/png")
    return [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every(
      (byte, index) => bytes[index] === byte,
    );
  if (file.type === "application/pdf")
    return new TextDecoder().decode(bytes.slice(0, 5)) === "%PDF-";
  return false;
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const rawApplication = formData.get("application");
    if (typeof rawApplication !== "string") {
      return NextResponse.json(
        { error: "Les informations de candidature sont manquantes." },
        { status: 400 },
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawApplication);
    } catch {
      return NextResponse.json(
        { error: "Le format des informations est invalide." },
        { status: 400 },
      );
    }

    const application = applicationSchema.parse(parsed);
    const uploaded = formData.get("portfolioFile");
    const file = uploaded instanceof File && uploaded.size > 0 ? uploaded : null;

    if (
      file &&
      (file.size > MAX_FILE_SIZE ||
        !ACCEPTED_TYPES.has(file.type) ||
        !(await hasValidFileSignature(file)))
    ) {
      return NextResponse.json(
        { error: "Le fichier doit être un JPG, PNG ou PDF de 10 Mo maximum." },
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdmin();
    let portfolioFilePath: string | null = null;

    if (file) {
      const extension =
        file.type === "application/pdf" ? "pdf" : file.type === "image/png" ? "png" : "jpg";
      portfolioFilePath = `portfolios/${crypto.randomUUID()}.${extension}`;
      const { error: uploadError } = await supabase.storage
        .from(process.env.SUPABASE_STORAGE_BUCKET ?? "applications")
        .upload(portfolioFilePath, file, { contentType: file.type, upsert: false });

      if (uploadError) {
        console.error("Portfolio upload failed", uploadError);
        return NextResponse.json(
          { error: "Le portfolio n’a pas pu être téléversé. Réessayez." },
          { status: 502 },
        );
      }
    }

    const candidateScore = calculateCandidateScore(application, Boolean(file));
    const { data, error } = await supabase
      .from("applications")
      .insert({
        full_name: application.fullName,
        whatsapp: application.whatsapp,
        email: application.email,
        school: application.school,
        education_level: application.level,
        specialty: application.specialty,
        years_experience: application.yearsExperience,
        design_level: application.designLevel,
        experience_areas: application.experienceAreas,
        software_skills: application.softwareSkills,
        main_software: application.mainSoftware,
        has_physical_product_experience: application.hasPhysicalProductExperience === "yes",
        product_types: application.productTypes,
        has_professional_mockups: application.hasProfessionalMockups === "yes",
        portfolio_url: application.portfolioUrl || null,
        portfolio_file_path: portfolioFilePath,
        commitment: application.commitment,
        candidate_score: candidateScore,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Application insert failed", error);
      if (portfolioFilePath) {
        const { error: cleanupError } = await supabase.storage
          .from(process.env.SUPABASE_STORAGE_BUCKET ?? "applications")
          .remove([portfolioFilePath]);
        if (cleanupError) console.error("Portfolio cleanup failed", cleanupError);
      }
      return NextResponse.json(
        { error: "Votre candidature n’a pas pu être enregistrée. Réessayez." },
        { status: 502 },
      );
    }

    return NextResponse.json({ id: data.id }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Certaines informations sont invalides.", issues: error.flatten() },
        { status: 400 },
      );
    }
    console.error("Application submission failed", error);
    return NextResponse.json(
      { error: "Une erreur inattendue est survenue. Réessayez." },
      { status: 500 },
    );
  }
}
