"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ArrowDown, ArrowRight } from "lucide-react";
import { MagneticLink, MaskLines, MouseGlow, Counter } from "@/components/motion-kit";

const LOGO = "https://inphb.edu.ci/wp-content/uploads/2024/03/inphblogo.png";
const btn =
  "inline-flex min-h-14 items-center gap-3 rounded-full px-8 font-grotesk text-base font-semibold transition-colors";

type Piece = {
  cls: string;
  depth: number;
  delay: number;
  label: string;
  tone: string;
  rotate: number;
};
const pieces: Piece[] = [
  { cls: "mockup-hoodie", depth: 38, delay: 0.9, label: "INP\nHB", tone: "", rotate: -7 },
  { cls: "mockup-shirt", depth: 62, delay: 1.0, label: "GRANDE\nÉCOLE", tone: "", rotate: 8 },
  { cls: "mockup-tote", depth: 24, delay: 1.1, label: "IDÉES\nEN ACTION", tone: "", rotate: 7 },
  { cls: "mockup-mug", depth: 76, delay: 1.2, label: "INP-HB", tone: "", rotate: 0 },
];

export function Hero() {
  const reduce = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const mx = useSpring(useMotionValue(0), { stiffness: 70, damping: 18 });
  const my = useSpring(useMotionValue(0), { stiffness: 70, damping: 18 });
  const { scrollYProgress } = useScroll({ target: root, offset: ["start start", "end start"] });
  const collageY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140]);
  const wordY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -90]);

  const onMove = (e: React.PointerEvent) => {
    if (reduce) return;
    mx.set(e.clientX / window.innerWidth - 0.5);
    my.set(e.clientY / window.innerHeight - 0.5);
  };

  return (
    <>
      {/* page reveal curtain */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[100] grid place-items-center bg-brand"
        initial={{ y: 0 }}
        animate={{ y: "-100%" }}
        transition={{ duration: 0.9, delay: 0.35, ease: [0.76, 0, 0.24, 1] }}
      >
        <Image
          src={LOGO}
          alt=""
          width={168}
          height={56}
          priority
          unoptimized
          className="h-14 w-auto brightness-0 invert"
        />
      </motion.div>

      <section
        ref={root}
        onPointerMove={onMove}
        id="accueil"
        className="grain relative min-h-[100svh] overflow-hidden bg-white pt-28"
      >
        <MouseGlow />

        {/* oversized background word */}
        <motion.div
          aria-hidden
          style={{ y: wordY }}
          className="pointer-events-none absolute -bottom-10 -left-6 select-none font-display text-[32vw] font-bold leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_rgba(6,113,56,.14)]"
        >
          INP·HB
        </motion.div>

        {/* geometric floaters */}
        <motion.svg
          aria-hidden
          className="absolute right-[6%] top-28 h-24 w-24 animate-float text-ember"
          viewBox="0 0 100 100"
          fill="none"
        >
          <motion.circle
            cx="50"
            cy="50"
            r="42"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="6 8"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, delay: 1.2 }}
          />
        </motion.svg>

        <div className="relative z-10 mx-auto grid w-[min(100%-3rem,1320px)] items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mb-8 flex items-center gap-5"
            >
              <Image
                src={LOGO}
                alt="INP-HB"
                width={150}
                height={50}
                priority
                unoptimized
                className="h-12 w-auto"
              />
              <span className="h-px w-12 bg-brand/40" />
              <span className="font-grotesk text-sm font-medium text-muted">
                Recrutement graphistes
              </span>
            </motion.div>

            <h1 className="font-display text-[clamp(2.9rem,7.4vw,7rem)] font-bold leading-[.92] tracking-[-0.055em] text-ink">
              <MaskLines
                lines={[
                  "La prochaine",
                  <span key="a" className="text-brand">
                    identité visuelle
                  </span>,
                  "de l’INP-HB",
                  <span key="b">
                    commence <span className="italic text-ember">ici.</span>
                  </span>,
                ]}
              />
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.7 }}
              className="mt-8 max-w-xl text-lg leading-8 text-muted md:text-xl"
            >
              Rejoignez l’équipe créative chargée de concevoir la première collection officielle de
              produits institutionnels de l’INP-HB.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.45, duration: 0.7 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <MagneticLink
                href="/apply"
                className={`${btn} bg-brand text-white shadow-soft hover:bg-brand-dark`}
              >
                Postuler maintenant <ArrowRight size={18} />
              </MagneticLink>
              <MagneticLink
                href="#projet"
                className={`${btn} border-2 border-ink text-ink hover:bg-ink hover:text-white`}
              >
                Découvrir le projet <ArrowDown size={18} />
              </MagneticLink>
            </motion.div>

            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.7 }}
              className="mt-14 flex gap-12 font-grotesk"
            >
              <div>
                <dt className="text-sm text-muted">Places ouvertes</dt>
                <dd className="text-4xl font-bold text-brand">
                  <Counter to={3} />
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted">Produits à imaginer</dt>
                <dd className="text-4xl font-bold text-brand">
                  <Counter to={6} suffix="+" />
                </dd>
              </div>
            </motion.dl>
          </div>

          {/* layered collage */}
          <motion.div
            style={{ y: collageY }}
            className="relative mx-auto aspect-square w-full max-w-[640px]"
          >
            <div className="absolute inset-[6%] rotate-3 rounded-[2.5rem] bg-brand" />
            <div className="absolute inset-[6%] -rotate-2 rounded-[2.5rem] border-2 border-ink/90" />
            {pieces.map((p) => (
              <ParallaxPiece key={p.cls} piece={p} mx={mx} my={my} />
            ))}
            <motion.div
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: -10 }}
              transition={{ type: "spring", delay: 1.6 }}
              className="absolute -left-2 top-[8%] z-20 rounded-full bg-ember px-5 py-3 font-grotesk text-sm font-bold text-white shadow-lg"
            >
              Collection 01
            </motion.div>
          </motion.div>
        </div>

        {/* scroll indicator */}
        <div
          className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
          aria-hidden
        >
          <span className="font-grotesk text-xs text-muted">Défiler</span>
          <span className="relative h-12 w-px overflow-hidden bg-ink/15">
            <span className="absolute inset-0 animate-scrollcue bg-brand" />
          </span>
        </div>
      </section>
    </>
  );
}

function ParallaxPiece({
  piece,
  mx,
  my,
}: {
  piece: Piece;
  mx: ReturnType<typeof useSpring>;
  my: ReturnType<typeof useSpring>;
}) {
  const x = useTransform(mx, [-0.5, 0.5], [-piece.depth, piece.depth]);
  const y = useTransform(my, [-0.5, 0.5], [-piece.depth, piece.depth]);
  return (
    <motion.div style={{ x, y }} className="absolute inset-0 z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: piece.delay, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="absolute inset-0"
      >
        <div
          className="absolute inset-0 animate-float"
          style={{ animationDelay: `${piece.delay}s` }}
        >
          <div className={`mockup ${piece.cls}`}>
            <span className="mockup-mark whitespace-pre-line">{piece.label}</span>
            <span className="shine" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
