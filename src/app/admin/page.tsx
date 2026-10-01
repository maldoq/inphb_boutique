import type { Metadata } from "next";
import { AdminDashboard } from "@/components/admin-dashboard";
import { AdminLoginForm } from "@/components/admin-login-form";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createApplicationsService } from "@/lib/services/applications.service";
import { APPLICATION_STATUSES } from "@/lib/types";

export const metadata: Metadata = {
  title: "Administration des candidatures",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type AdminPageProps = {
  searchParams: Promise<{ page?: string; status?: string }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  if (!(await isAdminAuthenticated())) return <AdminLoginForm />;

  const params = await searchParams;
  const parsedPage = Number(params.page);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const status = APPLICATION_STATUSES.find((item) => item === params.status);
  const pageSize = 30;

  try {
    const result = await createApplicationsService().list({
      page,
      pageSize,
      status,
      sort: "date",
    });
    return (
      <AdminDashboard
        applications={result.rows}
        page={result.page}
        pageSize={result.pageSize}
        status={status}
        total={result.total}
      />
    );
  } catch (error) {
    console.error("Admin applications dashboard failed to load", error);
    return (
      <AdminDashboard
        applications={[]}
        loadError="Impossible de charger les candidatures. Vérifiez la configuration Supabase et la migration SQL."
        page={page}
        pageSize={pageSize}
        status={status}
        total={0}
      />
    );
  }
}
