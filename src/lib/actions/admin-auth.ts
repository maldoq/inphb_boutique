"use server";

import { redirect } from "next/navigation";
import { createAdminSession, destroyAdminSession, isAdminPasswordValid } from "@/lib/admin-auth";

export async function loginAdminAction(
  _previousState: { error: string } | null,
  formData: FormData,
) {
  const password = formData.get("password");
  if (typeof password !== "string" || !password) {
    return { error: "Saisissez le mot de passe administrateur." };
  }

  try {
    if (!isAdminPasswordValid(password)) {
      return { error: "Mot de passe incorrect." };
    }
    await createAdminSession();
  } catch (error) {
    console.error("Admin login configuration failed", error);
    return { error: "L’accès administrateur n’est pas correctement configuré sur le serveur." };
  }

  redirect("/admin");
}

export async function logoutAdminAction() {
  await destroyAdminSession();
  redirect("/admin");
}
