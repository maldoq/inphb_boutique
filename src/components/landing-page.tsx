"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import type { StaticImageData } from "next/image";
import { Counter, MagneticLink, MaskLines } from "@/components/motion-kit";
import teamImage from "@/assets/img/magnific_equipe_etudiant_africain.jpeg";
import boutiqueImage from "@/assets/img/boutique_inphb.jpeg";
import graphicImage from "@/assets/img/mockup_graphique_produuit.jpeg";

export const LOGO = "https://inphb.edu.ci/wp-content/uploads/2024/03/inphblogo.png";
const G = { fontFamily: "var(--font-grotesk)" };

const stats: [number | null, string, string, string?][] = [
  [3, "places de graphistes", "", ""],
  [5, "étapes, de l’idée au produit", "", ""],
  [6, "familles de produits", "", "+"],
  [null, "lancement du projet", "Novembre 2026"],
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
const skills = [
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Canva",
  "CorelDRAW",
  "Blender",
  "Adobe After Effects",
];
const benefits: [string, string][] = [
  [
    "Contribution reconnue",
    "Un engagement valorisé et une contribution qui compte pour l’institution.",
  ],
  ["Projet concret", "Une collection pensée pour la communauté et portée à l’échelle de l’école."],
  ["Portfolio enrichi", "Des créations appliquées à des supports et produits réels."],
  ["Expérience collective", "Une expérience marquante au sein d’une équipe pluridisciplinaire."],
];
const timeline: [string, string][] = [
  ["Du jeudi 01 au samedi 03 octobre à 18h00 GMT", "Réception des candidatures"],
  ["Samedi 03 octobre", "Étude des profils et sélection"],
  ["Dimanche 04 octobre à partir de 15h00 GMT", "Entretiens en visioconférence"],
  ["Lundi 05 octobre", "Constitution de l’équipe créative"],
  ["Immédiatement après la constitution de l’équipe créative", "Démarrage opérationnel"],
];
const faqs: [string, string][] = [
  [
    "Le projet est-il rémunéré ?",
    "Il s’agit d’un appel à collaboration autour d’un projet institutionnel. Les modalités de collaboration et, le cas échéant, les éventuelles gratifications seront précisées aux candidats retenus avant le démarrage.",
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
    "Quand la collaboration démarre-t-elle ?",
    "La collaboration démarre après la constitution de l’équipe créative, prévue le lundi 05 octobre. Le démarrage opérationnel a lieu immédiatement après.",
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
      <symbol id="notebook" viewBox="0 0 64 64">
        <rect x="14" y="7" width="40" height="50" rx="3" fill="currentColor" />
        <path d="M10 17h8M10 27h8M10 37h8M10 47h8" stroke="currentColor" strokeWidth="3" />
        <path d="M24 20h20M24 28h16" stroke="#fff" strokeWidth="3" />
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

function ProjectImage({
  src,
  title,
  ratio,
}: {
  src: StaticImageData;
  title: string;
  ratio: string;
}) {
  return (
    <div className="project-image" style={{ aspectRatio: ratio.replace(":", " / ") }}>
      <Image src={src} alt={title} fill sizes="(max-width: 760px) 100vw, 760px" />
    </div>
  );
}

function HeroViz() {
  return (
    <svg
      className="viz"
      viewBox="0 0 600 620"
      role="img"
      aria-label="Exemples de produits de la boutique institutionnelle, présentés autour du logo INP-HB"
    >
      <circle cx="300" cy="280" r="250" fill="var(--tint)" />
      <circle
        className="spin"
        cx="300"
        cy="280"
        r="190"
        fill="none"
        stroke="var(--g)"
        strokeWidth="1.5"
        strokeDasharray="2 12"
        strokeLinecap="round"
      />
      <circle cx="300" cy="280" r="84" fill="var(--bg)" stroke="var(--g)" strokeWidth="2" />
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
      <text x="300" y="304" textAnchor="middle" fontSize="12" fill="var(--mut)">
        Boutique institutionnelle
      </text>
      <Tile x={96} y={120} id="hoodie" fill="#fff" color="#067138" />
      <Tile x={398} y={96} id="tee" fill="#fff" color="#067138" />
      <Tile x={440} y={320} id="mug" fill="#fff" color="#067138" />
      <Tile x={70} y={350} id="tote" fill="#fff" stroke="#067138" color="#067138" />
      <Tile x={252} y={440} s={96} id="notebook" fill="#fff" color="#067138" />
      <g style={G} fontWeight="700" fontSize="13" fill="var(--ink)">
        <text x="80" y="108">
          Hoodie
        </text>
        <text x="80" y="238" fontSize="10" fontWeight="400" fill="var(--mut)">
          Textile aux couleurs de l’école
        </text>
        <text x="398" y="84">
          T-shirt
        </text>
        <text x="398" y="214" fontSize="10" fontWeight="400" fill="var(--mut)">
          Collection étudiante
        </text>
        <text x="458" y="440">
          Mug
        </text>
        <text x="458" y="458" fontSize="10" fontWeight="400" fill="var(--mut)">
          Objet du quotidien
        </text>
        <text x="76" y="474">
          Tote bag
        </text>
        <text x="76" y="492" fontSize="10" fontWeight="400" fill="var(--mut)">
          Accessoire institutionnel
        </text>
        <text x="242" y="550">
          Carnet INP-HB
        </text>
        <text x="242" y="568" fontSize="10" fontWeight="400" fill="var(--mut)">
          Papeterie de la boutique
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
            <a href="#projet">Le projet</a>
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
                    <em key="e">commence ici!</em>,
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
                <MagneticLink href="#projet" className="btn w2">
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

        <section id="projet" className="obs" style={{ background: "var(--tint)" }}>
          <div className="w project-overview">
            <span className="kick">Le projet</span>
            <h2>Une boutique institutionnelle aux couleurs de l’INP-HB.</h2>
            <p className="lead">
              Les grandes universités du monde, comme l&apos;UM6P au Maroc ou l&apos;Université du
              Michigan aux États-Unis, possèdent chacune une boutique institutionnelle. On y trouve
              des articles à l&apos;effigie de l&apos;établissement : pulls, vêtements, polos,
              tasses et bien d&apos;autres objets. Ces boutiques permettent à chaque visiteur de
              repartir avec un souvenir, et à chaque membre de la communauté universitaire de porter
              avec fierté les couleurs de son école.
              <br />
              L&apos;Institut National Polytechnique Félix Houphouët-Boigny (INP-HB) entend
              s&apos;inscrire dans cette dynamique et se doter, à son tour, de sa propre boutique
              institutionnelle.
            </p>

            <div className="project-context-grid">
              <article className="card project-summary">
                <h3>Une ambition pour l’institut</h3>
                <p>
                  Porté par l’administration et né de la vision du Directeur Général, le projet
                  prévoit une gamme d’articles conçus avec soin et un espace dédié pour les
                  découvrir.
                </p>
              </article>
              <blockquote className="project-vision">
                <span>Notre ambition</span>
                <p>
                  Faire rayonner l’INP-HB aussi par son image, comme les grandes universités du
                  monde.
                </p>
              </blockquote>
            </div>

            <div className="project-audiences">
              <h3>Une boutique pensée pour toute la communauté</h3>
              <div className="project-audience-grid">
                <article>
                  <h4>Visiteurs et partenaires</h4>
                  <p>Un souvenir de l’INP-HB à emporter après une visite ou un événement.</p>
                </article>
                <article>
                  <h4>Étudiantes et étudiants</h4>
                  <p>Des articles à porter et à utiliser aux couleurs de leur école.</p>
                </article>
                <article>
                  <h4>Personnel de l’institut</h4>
                  <p>Une collection pour celles et ceux qui font vivre l’INP-HB au quotidien.</p>
                </article>
              </div>
            </div>

            <div className="project-team-note">
              <span className="project-team-mark" aria-hidden="true">
                BDE
              </span>
              <p>
                <strong>Une équipe projet 100 % étudiante.</strong> Cette année, l’administration a
                choisi de s’appuyer sur les étudiants eux-mêmes. Le Bureau des Élèves (BDE) a été
                associé au projet en tant qu’équipe projet. L’équipe collabore directement avec le
                comité de pilotage, qui valide chaque étape importante.
              </p>
            </div>
          </div>
        </section>

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
                <div
                  className={`team-role rv ${i === 2 ? "team-role-featured" : ""}`}
                  key={t}
                  style={{ transitionDelay: `${i * 0.12}s` }}
                >
                  <h3 className="gk">
                    {t} {i === 2 && <span className="tag">2 à 3 places</span>}
                  </h3>
                  <p>{d}</p>
                </div>
              ))}
            </div>
            <div className="team-visual">
              <ProjectImage
                src={teamImage}
                title="Équipe étudiante en atelier collaboratif et gestion de projet"
                ratio="16:9"
              />
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
                <ProjectImage
                  src={boutiqueImage}
                  title="Boutique institutionnelle de l’INP-HB"
                  ratio="2:1"
                />
                <div>
                  <h3>Aménagement de la paillote</h3>
                  <p>
                    Imaginer un espace accueillant où découvrir, choisir et vivre les produits de
                    l’institution.
                  </p>
                </div>
              </article>
              <article className="big rv" style={{ transitionDelay: ".12s" }}>
                <ProjectImage
                  src={graphicImage}
                  title="Création graphique, mockups, produits dérivés et branding"
                  ratio="2:1"
                />
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
              <h2>Ce que nous recherchons</h2>
              <p className="lead">
                Nous recherchons 2 à 3 graphistes à l’aise avec les outils de création visuelle.
                Photoshop et Illustrator constituent un avantage important.
              </p>
              <div className="sk" aria-label="Logiciels recherchés">
                {skills.map((name) => (
                  <span className="tool-badge" key={name}>
                    {name}
                  </span>
                ))}
              </div>
            </div>
            <div className="ben">
              <h3 className="benefits-heading">Ce que vous gagnez</h3>
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
