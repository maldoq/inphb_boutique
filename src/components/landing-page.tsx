"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { Counter, MagneticLink, MaskLines } from "@/components/motion-kit";

export const LOGO = "https://inphb.edu.ci/wp-content/uploads/2024/03/inphblogo.png";
const G = { fontFamily: "var(--font-grotesk)" };

const stats: [number | null, string, string, string?][] = [
  [3, "places de graphistes", "", ""],
  [5, "étapes, de l’idée au produit", "", ""],
  [6, "familles de produits", "", "+"],
  [null, "lancement du projet", "Nov. 2026"],
];
const team = [
  ["Proposeurs de produits", "Repèrent les idées et usages qui font sens pour la communauté."],
  ["Stratèges marketing", "Comprennent les publics et créent le désir autour de la marque."],
  ["Graphistes", "Donnent forme à l’identité, conçoivent les visuels et les mockups."],
];
const steps: [string, string, string][] = [
  [
    "Proposition",
    "Une idée répond à un vrai besoin.",
    "M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z",
  ],
  ["Analyse", "Pertinence et faisabilité.", "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4"],
  ["Design", "On dessine et on prototype. C’est vous.", "M12 20l8-8-5-5-8 8-1 6zM14 6l4 4"],
  ["Validation", "Relu et approuvé.", "m5 12 5 5L20 7"],
  [
    "Production",
    "Le produit rejoint la boutique.",
    "M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10",
  ],
];
const skills: [string, number][] = [
  ["Photoshop", 95],
  ["Illustrator", 92],
  ["Branding", 88],
  ["Mockups", 84],
  ["Design produit", 78],
];
const benefits: [string, string][] = [
  ["Grande récompense finale", "La reconnaissance de votre contribution."],
  ["Projet réel", "Porté à l’échelle de l’école."],
  ["Portfolio renforcé", "Des créations qui existent en vrai."],
  ["Réseau", "Une équipe pluridisciplinaire."],
  ["Visibilité", "Votre signature vue par toute la communauté."],
];
const timeline: [string, string][] = [
  ["Dès maintenant", "Ouverture des candidatures"],
  ["À confirmer", "Clôture des candidatures"],
  ["Après la clôture", "Étude des dossiers"],
  ["Début nov. 2026", "Lancement du projet"],
];
const faqs: [string, string][] = [
  [
    "Le projet est-il rémunéré ?",
    "Il s’agit d’un appel à collaboration autour d’un projet institutionnel. Les modalités, les éventuelles gratifications et la récompense finale seront précisées aux candidats retenus avant le démarrage.",
  ],
  [
    "Quel portfolio envoyer ?",
    "Un lien en ligne est idéal. Vous pouvez aussi joindre un JPG, PNG ou PDF de 10 Mo maximum, avec quelques projets aboutis.",
  ],
  [
    "Les réunions sont-elles obligatoires ?",
    "La collaboration implique des temps d’échange et de validation. Le calendrier et le format seront partagés en amont.",
  ],
  [
    "Quand le projet démarre-t-il ?",
    "Le lancement est prévu début novembre 2026, après l’étude des dossiers.",
  ],
];

function Symbols() {
  return (
    <svg width="0" height="0" className="absolute" aria-hidden="true">
      <symbol id="hoodie" viewBox="0 0 64 64">
        <path
          d="M20 8 6 18l6 12 6-4v30h28V26l6 4 6-12L44 8c-2 6-5 8-12 8s-10-2-12-8z"
          fill="currentColor"
        />
      </symbol>
      <symbol id="tee" viewBox="0 0 64 64">
        <path
          d="M22 8 4 18l6 12 8-4v30h28V26l8 4 6-12L42 8c-2 4-5 6-10 6s-8-2-10-6z"
          fill="currentColor"
        />
      </symbol>
      <symbol id="mug" viewBox="0 0 64 64">
        <path d="M12 14h34v30a8 8 0 0 1-8 8H20a8 8 0 0 1-8-8z" fill="currentColor" />
        <path d="M46 20h4a8 8 0 0 1 0 16h-4" fill="none" stroke="currentColor" strokeWidth="5" />
      </symbol>
      <symbol id="tote" viewBox="0 0 64 64">
        <path d="M10 24h44l-3 34H13z" fill="currentColor" />
        <path d="M22 24v-6a10 10 0 0 1 20 0v6" fill="none" stroke="currentColor" strokeWidth="4" />
      </symbol>
      <symbol id="poster" viewBox="0 0 64 64">
        <rect x="14" y="6" width="36" height="52" rx="3" fill="currentColor" />
        <circle cx="32" cy="26" r="9" fill="#fff" />
        <rect x="21" y="42" width="22" height="4" fill="#fff" />
      </symbol>
    </svg>
  );
}

function Tile({
  x,
  y,
  s = 104,
  id,
  fill,
  stroke = "var(--line)",
  color,
}: {
  x: number;
  y: number;
  s?: number;
  id: string;
  fill: string;
  stroke?: string;
  color: string;
}) {
  const p = s * 0.62;
  return (
    <g className="fl">
      <rect
        x={x}
        y={y}
        width={s}
        height={s}
        rx={s / 4}
        fill={fill}
        stroke={stroke}
        strokeWidth="3"
      />
      <use
        href={`#${id}`}
        x={x + (s - p) / 2}
        y={y + (s - p) / 2}
        width={p}
        height={p}
        color={color}
      />
    </g>
  );
}

function HeroViz() {
  return (
    <svg
      className="viz"
      viewBox="0 0 600 560"
      role="img"
      aria-label="Schéma de la collection : hoodie, t-shirt, mug, tote bag et affiche autour du logo INP-HB"
    >
      <circle cx="300" cy="280" r="250" fill="var(--g)" />
      <circle
        className="spin"
        cx="300"
        cy="280"
        r="190"
        fill="none"
        stroke="#fff"
        strokeWidth="2.5"
        strokeDasharray="4 12"
        strokeLinecap="round"
      />
      <circle cx="300" cy="280" r="84" fill="var(--bg)" stroke="var(--line)" strokeWidth="3" />
      <text
        x="300"
        y="276"
        textAnchor="middle"
        style={G}
        fontWeight="700"
        fontSize="34"
        fill="var(--ink)"
      >
        INP·HB
      </text>
      <text x="300" y="304" textAnchor="middle" fontSize="13" fill="var(--mut)">
        Collection 01
      </text>
      <Tile x={96} y={120} id="hoodie" fill="#fff" color="#067138" />
      <Tile x={398} y={96} id="tee" fill="#F47A00" color="#0A0A0A" />
      <Tile x={440} y={320} id="mug" fill="#fff" color="#067138" />
      <Tile x={70} y={350} id="tote" fill="#0A0A0A" stroke="#fff" color="#F47A00" />
      <Tile x={252} y={440} s={96} id="poster" fill="#fff" color="#067138" />
      <g style={G} fontWeight="700" fontSize="14" fill="var(--ink)">
        <text x="100" y="108">
          Hoodies
        </text>
        <text x="398" y="84">
          T-shirts
        </text>
        <text x="458" y="440">
          Mugs
        </text>
        <text x="76" y="474">
          Tote bags
        </text>
      </g>
    </svg>
  );
}

export function LandingPage() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.2 },
    );
    document.querySelectorAll(".obs,.rv").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="page">
      <Symbols />
      <header>
        <div className="w">
          <Link className="logo" href="/" aria-label="INP-HB, accueil">
            <Image
              src={LOGO}
              alt="INP-HB"
              width={140}
              height={46}
              priority
              unoptimized
              style={{ height: 40, width: "auto" }}
            />
          </Link>
          <nav aria-label="Navigation principale">
            <a href="#equipe">Équipe</a>
            <a href="#process">Processus</a>
            <a href="#profil">Profil</a>
            <a href="#calendrier">Calendrier</a>
            <Link className="btn" href="/apply">
              Postuler
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="w">
            <div>
              <h1>
                <MaskLines
                  lines={[
                    "La prochaine",
                    <b key="b">identité visuelle</b>,
                    "de l’INP-HB",
                    <em key="e">commence ici.</em>,
                  ]}
                />
              </h1>
              <p>
                Rejoignez l’équipe créative chargée de concevoir la première collection officielle
                de produits institutionnels de l’INP-HB.
              </p>
              <div className="cta">
                <MagneticLink href="/apply" className="btn o">
                  Postuler maintenant
                </MagneticLink>
                <MagneticLink href="#equipe" className="btn w2">
                  Découvrir le projet
                </MagneticLink>
              </div>
            </div>
            <HeroViz />
          </div>
        </section>

        <div className="stats">
          <div className="w">
            {stats.map(([n, label, text, suffix]) => (
              <div className="st" key={label}>
                <b>{n === null ? text : <Counter to={n} suffix={suffix} />}</b>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <section id="equipe" className="obs">
          <div className="w">
            <span className="kick">L’équipe</span>
            <h2>Trois métiers, une seule collection.</h2>
            <p className="lead">
              Une petite équipe complémentaire fait avancer le projet de l’idée à l’objet. Vous
              rejoignez les graphistes.
            </p>
            <div
              className="bar"
              role="img"
              aria-label="Répartition de l’équipe : produit, marketing, design"
            >
              <div>Produit</div>
              <div>Marketing</div>
              <div>Design</div>
            </div>
            <div className="legend">
              {team.map(([t, d], i) => (
                <div key={t}>
                  <h3 className="gk" style={{ fontSize: "1.3rem" }}>
                    {t} {i === 2 && <span className="tag">2 à 3 places</span>}
                  </h3>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="obs" style={{ background: "var(--tint)" }}>
          <div className="w">
            <span className="kick">Le processus</span>
            <h2>Comment naît un produit&nbsp;?</h2>
            <div className="flow">
              {steps.map(([t, d, path], i) => (
                <div className="step rv" key={t} style={{ transitionDelay: `${i * 0.1}s` }}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d={path} />
                  </svg>
                  <div>
                    <h3>{t}</h3>
                    <p>{d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="obs">
          <div className="w">
            <span className="kick">Les chantiers</span>
            <h2>Un lieu. Une collection.</h2>
            <div className="two">
              <article className="big rv">
                <svg viewBox="0 0 600 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <rect width="600" height="240" fill="#FFB35C" />
                  <circle cx="470" cy="70" r="40" fill="#fff" />
                  <path d="M120 150 300 50l180 100z" fill="#067138" />
                  <rect x="150" y="150" width="300" height="90" fill="#0A0A0A" />
                  <rect x="270" y="170" width="60" height="70" fill="#F47A00" />
                  <path d="M0 240h600v-14H0z" fill="#067138" />
                </svg>
                <div>
                  <h3>Aménagement de la paillote</h3>
                  <p>
                    Imaginer un espace accueillant où découvrir, choisir et vivre les produits de
                    l’institution.
                  </p>
                </div>
              </article>
              <article className="big rv" style={{ transitionDelay: ".12s" }}>
                <svg viewBox="0 0 600 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                  <rect width="600" height="240" fill="#067138" />
                  <circle
                    cx="300"
                    cy="120"
                    r="150"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeDasharray="4 10"
                  />
                  <use href="#hoodie" x="110" y="60" width="110" height="110" color="#fff" />
                  <use href="#tee" x="245" y="40" width="110" height="110" color="#F47A00" />
                  <use href="#mug" x="390" y="80" width="90" height="90" color="#fff" />
                  <use href="#tote" x="40" y="130" width="70" height="70" color="#0A0A0A" />
                </svg>
                <div>
                  <h3>Collection de produits</h3>
                  <p>
                    Du vêtement aux accessoires, composer une gamme créative, cohérente et fièrement
                    INP-HB.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section id="profil" className="obs" style={{ background: "var(--tint)" }}>
          <div className="w prof">
            <div>
              <span className="kick">Le profil</span>
              <h2>La maîtrise du geste, le goût du collectif.</h2>
              <p className="lead">
                Nous recherchons 2 à 3 graphistes avancés. Voici le niveau attendu sur nos outils.
              </p>
              <div className="sk">
                {skills.map(([n, v]) => (
                  <div key={n}>
                    {n}
                    <i style={{ ["--v" as string]: `${v}%` }} />
                    <span>{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="ben">
              {benefits.map(([t, d], i) => (
                <div className="card rv" key={t} style={{ transitionDelay: `${i * 0.08}s` }}>
                  <div className="gl" />
                  <h3>{t}</h3>
                  <p>{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="calendrier">
          <div className="w">
            <span className="kick">Calendrier</span>
            <h2>Le bon moment, c’est maintenant.</h2>
            <div className="tl">
              {timeline.map(([b, s]) => (
                <div key={b}>
                  <b>{b}</b>
                  <span>{s}</span>
                </div>
              ))}
            </div>
            <p style={{ color: "var(--mut)", fontSize: ".85rem", marginTop: "2rem" }}>
              Calendrier prévisionnel, susceptible d’évoluer.
            </p>
          </div>
        </section>

        <section style={{ background: "var(--tint)" }}>
          <div className="w faq">
            <div>
              <span className="kick">Questions</span>
              <h2>Avant de vous lancer.</h2>
            </div>
            <div>
              {faqs.map(([q, a]) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="final">
          <div className="w">
            <h2>Et si votre prochain design portait les couleurs de l’INP-HB&nbsp;?</h2>
            <MagneticLink href="/apply" className="btn o">
              Rejoindre l’équipe
            </MagneticLink>
          </div>
          <div className="circ" />
        </section>
      </main>

      <footer>
        <div className="w">
          <span>INP-HB · Boutique institutionnelle</span>
          <span>Un projet pour faire rayonner l’identité de l’école.</span>
        </div>
      </footer>
    </div>
  );
}
