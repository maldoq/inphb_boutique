"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getPortfolioLinkAction, updateApplicationStatusAction } from "@/lib/actions/applications";
import { logoutAdminAction } from "@/lib/actions/admin-auth";
import { APPLICATION_STATUSES, type ApplicationRow, type ApplicationStatus } from "@/lib/types";

const STATUS_LABELS: Record<ApplicationStatus, string> = {
  received: "Reçue",
  reviewing: "En cours d’étude",
  shortlisted: "Présélectionnée",
  accepted: "Acceptée",
  rejected: "Refusée",
};

const STATUS_CLASS: Record<ApplicationStatus, string> = {
  received: "status-received",
  reviewing: "status-reviewing",
  shortlisted: "status-shortlisted",
  accepted: "status-accepted",
  rejected: "status-rejected",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getSafeExternalUrl(value: string | null) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

type AdminDashboardProps = {
  applications: ApplicationRow[];
  total: number;
  page: number;
  pageSize: number;
  status?: ApplicationStatus;
  loadError?: string;
};

export function AdminDashboard({
  applications,
  total,
  page,
  pageSize,
  status,
  loadError,
}: AdminDashboardProps) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(applications[0]?.id ?? null);
  const [search, setSearch] = useState("");
  const [portfolioLink, setPortfolioLink] = useState<{ id: string; url: string } | null>(null);
  const [actionError, setActionError] = useState("");
  const [pending, startTransition] = useTransition();

  const selected =
    applications.find((application) => application.id === selectedId) ?? applications[0];
  const externalPortfolioUrl = selected ? getSafeExternalUrl(selected.portfolio_url) : null;
  const filteredApplications = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase("fr");
    if (!normalizedSearch) return applications;
    return applications.filter((application) =>
      [application.full_name, application.email, application.specialty, application.school].some(
        (value) => value.toLocaleLowerCase("fr").includes(normalizedSearch),
      ),
    );
  }, [applications, search]);
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  function updateFilter(nextStatus: string) {
    const query = new URLSearchParams();
    if (nextStatus) query.set("status", nextStatus);
    query.set("page", "1");
    router.push(`/admin?${query.toString()}`);
  }

  function updatePage(nextPage: number) {
    const query = new URLSearchParams();
    if (status) query.set("status", status);
    query.set("page", String(nextPage));
    router.push(`/admin?${query.toString()}`);
  }

  function changeStatus(nextStatus: ApplicationStatus) {
    if (!selected) return;
    setActionError("");
    startTransition(async () => {
      try {
        await updateApplicationStatusAction(selected.id, nextStatus);
        router.refresh();
      } catch (error) {
        setActionError(error instanceof Error ? error.message : "La mise à jour a échoué.");
      }
    });
  }

  function requestPortfolio() {
    if (!selected) return;
    setActionError("");
    setPortfolioLink(null);
    startTransition(async () => {
      try {
        const url = await getPortfolioLinkAction(selected.id);
        if (url) setPortfolioLink({ id: selected.id, url });
        else setActionError("Aucun fichier de portfolio n’est associé à cette candidature.");
      } catch (error) {
        setActionError(error instanceof Error ? error.message : "Le portfolio est indisponible.");
      }
    });
  }

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <Link className="admin-brand" href="/admin">
          <span className="admin-brand-mark" aria-hidden="true">
            I
          </span>
          <span>
            <strong>INP-HB</strong>
            <small>Recrutement · Administration</small>
          </span>
        </Link>
        <form action={logoutAdminAction}>
          <button className="admin-button admin-button-quiet" type="submit">
            Se déconnecter
          </button>
        </form>
      </header>

      <section className="admin-overview">
        <div>
          <span className="admin-eyebrow">Espace de gestion</span>
          <h1>Candidatures</h1>
          <p>Consultez les profils, les projets et les portfolios reçus.</p>
        </div>
        <div className="admin-total">
          <strong>{total}</strong>
          <span>{status ? STATUS_LABELS[status].toLocaleLowerCase("fr") : "candidature(s)"}</span>
        </div>
      </section>

      {loadError && (
        <p className="admin-alert" role="alert">
          {loadError}
        </p>
      )}
      {actionError && (
        <p className="admin-alert" role="alert">
          {actionError}
        </p>
      )}

      <section className="admin-workspace" aria-label="Gestion des candidatures">
        <div className="admin-list-panel">
          <div className="admin-toolbar">
            <label className="admin-search">
              <span className="sr-only">Rechercher une candidature</span>
              <input
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Nom, e-mail, spécialité..."
                type="search"
                value={search}
              />
            </label>
            <label className="admin-status-filter">
              <span className="sr-only">Filtrer par statut</span>
              <select onChange={(event) => updateFilter(event.target.value)} value={status ?? ""}>
                <option value="">Tous les statuts</option>
                {APPLICATION_STATUSES.map((item) => (
                  <option key={item} value={item}>
                    {STATUS_LABELS[item]}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="admin-list-heading">
            <span>
              {filteredApplications.length} profil{filteredApplications.length > 1 ? "s" : ""} sur
              cette page
            </span>
            <span>Tri : plus récents</span>
          </div>

          <div className="admin-candidate-list">
            {filteredApplications.map((application) => (
              <button
                aria-pressed={selected?.id === application.id}
                className={`admin-candidate ${selected?.id === application.id ? "is-selected" : ""}`}
                key={application.id}
                onClick={() => {
                  setSelectedId(application.id);
                  setPortfolioLink(null);
                  setActionError("");
                }}
                type="button"
              >
                <span className="admin-avatar" aria-hidden="true">
                  {application.full_name.trim().charAt(0).toLocaleUpperCase("fr")}
                </span>
                <span className="admin-candidate-copy">
                  <strong>{application.full_name}</strong>
                  <small>
                    {application.specialty} · {application.design_level}
                  </small>
                  <span className={`admin-status ${STATUS_CLASS[application.status]}`}>
                    {STATUS_LABELS[application.status]}
                  </span>
                </span>
                <span
                  className="admin-score"
                  aria-label={`Score ${application.candidate_score} sur 100`}
                >
                  {application.candidate_score}
                  <small>/100</small>
                </span>
              </button>
            ))}
            {filteredApplications.length === 0 && (
              <p className="admin-empty">Aucune candidature ne correspond à cette recherche.</p>
            )}
            {applications.length === 0 && !loadError && (
              <p className="admin-empty">Aucune candidature n’a encore été reçue.</p>
            )}
          </div>

          <div className="admin-pagination">
            <button
              className="admin-button admin-button-quiet"
              disabled={page <= 1}
              onClick={() => updatePage(page - 1)}
              type="button"
            >
              Précédent
            </button>
            <span>
              Page {page} sur {pageCount}
            </span>
            <button
              className="admin-button admin-button-quiet"
              disabled={page >= pageCount}
              onClick={() => updatePage(page + 1)}
              type="button"
            >
              Suivant
            </button>
          </div>
        </div>

        <div className="admin-detail-panel">
          {selected ? (
            <>
              <div className="admin-detail-heading">
                <div>
                  <span className="admin-eyebrow">Profil candidat</span>
                  <h2>{selected.full_name}</h2>
                  <p>
                    Déposée le {formatDate(selected.submitted_at)}
                    {selected.updated_at !== selected.submitted_at &&
                      ` · Modifiée le ${formatDate(selected.updated_at)}`}
                  </p>
                </div>
                <div className="admin-score-large">
                  <strong>{selected.candidate_score}</strong>
                  <span>/100</span>
                  <small>Score indicatif</small>
                </div>
              </div>

              <div className="admin-detail-content">
                <section className="admin-detail-section">
                  <h3>Coordonnées</h3>
                  <div className="admin-facts">
                    <div>
                      <span>E-mail</span>
                      <a href={`mailto:${selected.email}`}>{selected.email}</a>
                    </div>
                    <div>
                      <span>WhatsApp</span>
                      <a href={`https://wa.me/${selected.whatsapp.replace(/\D/g, "")}`}>
                        {selected.whatsapp}
                      </a>
                    </div>
                    <div>
                      <span>Établissement</span>
                      <strong>{selected.school}</strong>
                    </div>
                    <div>
                      <span>Niveau et spécialité</span>
                      <strong>
                        {selected.education_level} · {selected.specialty}
                      </strong>
                    </div>
                  </div>
                </section>

                <section className="admin-detail-section">
                  <h3>Portfolio & projets</h3>
                  <div className="admin-portfolio-actions">
                    {externalPortfolioUrl ? (
                      <a
                        className="admin-button admin-button-primary"
                        href={externalPortfolioUrl}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Voir le portfolio en ligne
                      </a>
                    ) : selected.portfolio_url ? (
                      <span className="admin-muted">
                        Le lien de portfolio enregistré est invalide
                      </span>
                    ) : (
                      <span className="admin-muted">Aucun lien externe fourni</span>
                    )}
                    {selected.portfolio_file_path && (
                      <button
                        className="admin-button admin-button-outline"
                        disabled={pending}
                        onClick={requestPortfolio}
                        type="button"
                      >
                        {pending ? "Préparation..." : "Générer le lien du fichier"}
                      </button>
                    )}
                    {portfolioLink?.id === selected.id && (
                      <a
                        className="admin-file-link"
                        href={portfolioLink.url}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Ouvrir le fichier envoyé ↗
                      </a>
                    )}
                  </div>
                  <div className="admin-facts admin-facts-spaced">
                    <div>
                      <span>Années d’expérience</span>
                      <strong>{selected.years_experience} an(s)</strong>
                    </div>
                    <div>
                      <span>Niveau en design</span>
                      <strong>{selected.design_level}</strong>
                    </div>
                    <div>
                      <span>Domaines pratiqués</span>
                      <strong>{selected.experience_areas.join(", ") || "Non renseignés"}</strong>
                    </div>
                    <div>
                      <span>Logiciels maîtrisés</span>
                      <strong>{selected.software_skills.join(", ") || "Non renseignés"}</strong>
                    </div>
                    <div>
                      <span>Logiciel principal</span>
                      <strong>{selected.main_software}</strong>
                    </div>
                    <div>
                      <span>Expérience produits physiques</span>
                      <strong>{selected.has_physical_product_experience ? "Oui" : "Non"}</strong>
                    </div>
                    <div>
                      <span>Types de produits</span>
                      <strong>{selected.product_types.join(", ") || "Aucun indiqué"}</strong>
                    </div>
                    <div>
                      <span>Mockups professionnels</span>
                      <strong>{selected.has_professional_mockups ? "Oui" : "Non"}</strong>
                    </div>
                  </div>
                </section>

                <section className="admin-detail-section admin-review-section">
                  <div>
                    <h3>Suivi du dossier</h3>
                    <p>Les changements sont enregistrés immédiatement.</p>
                  </div>
                  <label>
                    <span className="sr-only">Statut de la candidature</span>
                    <select
                      disabled={pending}
                      onChange={(event) => changeStatus(event.target.value as ApplicationStatus)}
                      value={selected.status}
                    >
                      {APPLICATION_STATUSES.map((item) => (
                        <option key={item} value={item}>
                          {STATUS_LABELS[item]}
                        </option>
                      ))}
                    </select>
                  </label>
                </section>
              </div>
            </>
          ) : (
            <div className="admin-detail-empty">
              <span aria-hidden="true">↖</span>
              <h2>Sélectionnez un profil</h2>
              <p>Les informations détaillées de la candidature apparaîtront ici.</p>
            </div>
          )}
        </div>
      </section>
      <footer className="admin-footer">INP-HB · Données réservées à l’équipe de recrutement</footer>
    </main>
  );
}
