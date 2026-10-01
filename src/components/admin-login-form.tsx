"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAdminAction } from "@/lib/actions/admin-auth";

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(loginAdminAction, null);

  return (
    <main className="admin-shell admin-login-shell">
      <section className="admin-login-card">
        <span className="admin-eyebrow">INP-HB · Recrutement</span>
        <h1>Administration</h1>
        <p>Connectez-vous pour consulter les candidatures et leurs portfolios.</p>
        <form action={formAction}>
          <label htmlFor="admin-password">Mot de passe administrateur</label>
          <input
            autoComplete="current-password"
            id="admin-password"
            name="password"
            required
            type="password"
          />
          {state?.error && (
            <p className="admin-form-error" role="alert">
              {state.error}
            </p>
          )}
          <button className="admin-button admin-button-primary" disabled={pending} type="submit">
            {pending ? "Connexion..." : "Se connecter"}
          </button>
        </form>
        <Link className="admin-back-link" href="/">
          Retour au site
        </Link>
      </section>
    </main>
  );
}
