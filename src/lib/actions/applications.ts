"use server";

import { z } from "zod";
import { assertAdmin } from "@/lib/admin-auth";
import { createApplicationsService } from "@/lib/services/applications.service";
import { APPLICATION_STATUSES } from "@/lib/types";

const listSchema = z.object({
  page: z.number().int().min(1).optional(),
  pageSize: z.number().int().min(1).max(100).optional(),
  status: z.enum(APPLICATION_STATUSES).optional(),
  minScore: z.number().min(0).max(100).optional(),
  sort: z.enum(["score", "date"]).optional(),
});

export async function listApplicationsAction(input: unknown = {}) {
  await assertAdmin();
  return createApplicationsService().list(listSchema.parse(input));
}

export async function updateApplicationStatusAction(id: string, status: unknown) {
  await assertAdmin();
  await createApplicationsService().changeStatus(
    z.string().uuid().parse(id),
    z.enum(APPLICATION_STATUSES).parse(status),
  );
}

export async function getPortfolioLinkAction(id: string) {
  await assertAdmin();
  return createApplicationsService().portfolioLink(z.string().uuid().parse(id));
}
