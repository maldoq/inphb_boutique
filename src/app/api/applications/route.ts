import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { applicationSchema } from "@/lib/application-schema";
import { createApplicationsService, ServiceError } from "@/lib/services/applications.service";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const raw = formData.get("application");
    if (typeof raw !== "string") {
      return NextResponse.json(
        { error: "Les informations de candidature sont manquantes." },
        { status: 400 },
      );
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { error: "Le format des informations est invalide." },
        { status: 400 },
      );
    }

    const application = applicationSchema.parse(parsed);
    const uploaded = formData.get("portfolioFile");
    const file = uploaded instanceof File && uploaded.size > 0 ? uploaded : null;

    const { id } = await createApplicationsService().submit(application, file);
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Certaines informations sont invalides.", issues: error.flatten() },
        { status: 400 },
      );
    }
    if (error instanceof ServiceError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Application submission failed", error);
    return NextResponse.json(
      { error: "Une erreur inattendue est survenue. Réessayez." },
      { status: 500 },
    );
  }
}
