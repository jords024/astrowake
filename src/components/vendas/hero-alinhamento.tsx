import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import p1 from "../../assets/planetas/p1.webp.asset.json";
import p2 from "../../assets/planetas/p2.webp.asset.json";
import p3 from "../../assets/planetas/p3.webp.asset.json";
import p4 from "../../assets/planetas/p4.webp.asset.json";
import p5 from "../../assets/planetas/p5.webp.asset.json";
import p6 from "../../assets/planetas/p6.webp.asset.json";
import p7 from "../../assets/planetas/p7.webp.asset.json";
import p8 from "../../assets/planetas/p8.webp.asset.json";

type Planeta = {
  url: string;
  alt: string;
  /** largura relativa ao container (%) */
  w: number;
  /** deslocamento inicial em % da largura (positivo = direita) */
  offset: number;
  /** rotação inicial em graus */
  rot: number;
};

const PLANETAS: Planeta[] = [
  { url: p1.url, alt: "Mercúrio", w: 8, offset: -46, rot: -18 },
  { url: p2.url, alt: "Vênus", w: 11, offset: 52, rot: 14 },
  { url: p3.url, alt: "Terra e Lua", w: 11, offset: -58, rot: -10 },
  { url: p4.url, alt: "Marte", w: 8, offset: 44, rot: 20 },
  { url: p5.url, alt: "Júpiter", w: 26, offset: -40, rot: -12 },
  { url: p6.url, alt: "Saturno", w: 23, offset: 48, rot: 16 },
  { url: p7.url, alt: "Urano", w: 10, offset: -50, rot: -16 },
  { url: p8.url, alt: "Netuno", w: 17, offset: 42, rot: 12 },
];

const titles: Record<number, string> = {
  0: "ASTROWAKE",
  1: "LABIRINTO",
  2: "O RUMO",
};

const subtitles: Record<number, { line1: string; line2: string }> = {
  0: { line1: "O despertar de um conhecimento ancestral....", line2: "" },
  1: {
    line1: "Você passou anos se anulando para agradar todo mundo,",
    line2: "tentando tomar decisões no escuro",
  },
  2: {
    line1: "Chega de dar murro em ponta de faca,",
    line2: "o seu mapa guarda a resposta que você procura",
  },
};

const TOTAL_SECTIONS = 2;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function HeroAlinhamento() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const sunRef = useRef<HTMLDivElement | null>(null);
  const columnRef = useRef<HTMLDivElement | null>(null);

  const [currentSection, setCurrentSection] = useState(0);
  const [outro, setOutro] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const amp = isMobile ? 0.6 : 1;

    const apply = (progress: number) => {
      itemsRef.current.forEach((el, i) => {
        const planeta = PLANETAS[i];
        if (!el || !planeta) return;
        const start = i * 0.055;
        const t = easeOut(clamp01((progress - start) / (1 - start * 0.6)));
        const inv = 1 - t;
        const dx = planeta.offset * amp * inv;
        const rot = planeta.rot * amp * inv;
        const scale = 0.72 + 0.28 * t;
        el.style.transform = `translate3d(${dx}%, ${inv * 10 * amp}px, 0) rotate(${rot}deg) scale(${scale})`;
        el.style.opacity = String(0.22 + 0.78 * t);
      });
      if (lineRef.current) {
        lineRef.current.style.transform = `scaleY(${easeOut(clamp01(progress * 1.15))})`;
        lineRef.current.style.opacity = String(0.12 + 0.5 * clamp01(progress));
      }
      if (sunRef.current) {
        sunRef.current.style.opacity = String(0.4 + 0.6 * clamp01(progress * 1.5));
      }
      if (columnRef.current) {
        columnRef.current.style.transform = `translate3d(0, ${(0.5 - progress) * 6}vh, 0)`;
      }
    };

    let ticking = false;

    const update = () => {
      ticking = false;
      const total = root.offsetHeight - window.innerHeight;
      const scrolled = clamp01(total > 0 ? -root.getBoundingClientRect().top / total : 0);

      if (!reduced) apply(scrolled);

      const section = Math.min(TOTAL_SECTIONS, Math.round(scrolled * TOTAL_SECTIONS));
      setCurrentSection((prev) => (prev === section ? prev : section));

      // fade-out final para o próximo bloco
      const fadeStart = 0.86;
      setOutro(clamp01((scrolled - fadeStart) / (1 - fadeStart)));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    if (reduced) apply(1);
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const subtitle = subtitles[currentSection] ?? subtitles[0]!;
  const sceneOpacity = 1 - outro;

  return (
    <div ref={rootRef} className="relative w-full bg-background">
      {/* Camada fixa: céu, sol e planetas */}
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#000]"
        style={{ opacity: sceneOpacity }}
        aria-hidden
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(130% 85% at 50% 30%, #05050a 40%, #000 78%, #000 100%)",
          }}
        />

        {/* Sol no topo */}
        <div
          ref={sunRef}
          className="absolute -top-[26vw] left-1/2 h-[64vw] w-[150vw] -translate-x-1/2 rounded-[50%] opacity-40 md:-top-[16vw] md:h-[40vw] md:w-[100vw]"
          style={{
            background:
              "radial-gradient(closest-side, color-mix(in oklab, var(--gold-soft) 92%, white) 0%, color-mix(in oklab, var(--gold) 70%, transparent) 40%, color-mix(in oklab, var(--gold-deep) 24%, transparent) 60%, transparent 78%)",
          }}
        />

        {/* Coluna de planetas */}
        <div
          ref={columnRef}
          className="absolute inset-0 mx-auto flex w-full max-w-md flex-col items-center justify-center gap-[1.6vh] px-6 py-[10vh] will-change-transform"
          style={{ mixBlendMode: "screen" }}
        >
          <div
            ref={lineRef}
            className="absolute left-1/2 top-[8vh] h-[84vh] w-px origin-top -translate-x-1/2 opacity-0"
            style={{
              background:
                "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--gold) 50%, transparent) 12%, color-mix(in oklab, var(--gold) 30%, transparent) 80%, transparent)",
            }}
          />
          {PLANETAS.map((planeta, i) => (
            <div
              key={planeta.alt}
              ref={(el) => {
                if (el) itemsRef.current[i] = el;
              }}
              className="will-change-transform"
              style={{ width: `${planeta.w * 1.5}%`, opacity: 0.22, mixBlendMode: "screen" }}
            >
              <img
                src={planeta.url}
                alt=""
                decoding="async"
                className="block w-full select-none"
              />
            </div>
          ))}
        </div>

        {/* Véu para legibilidade do texto */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 34% at 50% 52%, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.62) 55%, transparent 100%)",
          }}
        />
      </div>

      {/* Marca lateral */}
      <div className="pointer-events-none fixed left-5 top-1/2 z-10 hidden -translate-y-1/2 md:block">
        <p
          className="text-xs font-bold uppercase tracking-[0.5em] text-gold/80"
          style={{ writingMode: "vertical-rl" }}
        >
          Astrowake
        </p>
      </div>

      {/* Conteúdo principal */}
      <div
        className="pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-center px-6 pb-36 text-center sm:pb-28"
        style={{
          opacity: sceneOpacity,
          transform: `translateY(${-outro * 60}px)`,
        }}
      >
        <h1
          key={`title-${currentSection}`}
          className="relative max-w-[92vw] animate-fade-in font-display text-[2.75rem] font-black leading-none tracking-tighter text-foreground drop-shadow-[0_10px_45px_rgba(214,164,68,0.45)] sm:text-7xl md:text-8xl lg:text-9xl"
        >
          {titles[currentSection] ?? titles[0]}
        </h1>

        <div key={`sub-${currentSection}`} className="relative mt-5 max-w-[34rem] animate-fade-in space-y-2 sm:mt-6">
          <p className="text-[0.95rem] font-medium leading-snug tracking-tight text-foreground drop-shadow-[0_4px_18px_rgba(0,0,0,0.9)] sm:text-xl">
            {subtitle.line1}
          </p>
          {subtitle.line2 ? (
            <p className="text-[0.85rem] font-normal leading-snug tracking-tight text-gold-soft drop-shadow-[0_4px_22px_rgba(0,0,0,0.8)] sm:text-lg">
              {subtitle.line2}
            </p>
          ) : null}
        </div>
      </div>

      {/* Indicador de scroll */}
      <div
        className="pointer-events-none fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3"
        style={{ opacity: sceneOpacity }}
      >
        <span className="max-w-[80vw] text-center text-[0.7rem] font-semibold uppercase leading-relaxed tracking-[0.22em] text-foreground/85 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:text-xs sm:tracking-[0.3em]">
          {currentSection === 0
            ? "Desça para acessar as instruções da sua alma"
            : currentSection < TOTAL_SECTIONS
              ? "Continue descendo"
              : "Você chegou — siga para o próximo passo"}
        </span>

        <ChevronDown className="h-5 w-5 animate-bounce text-gold drop-shadow-[0_2px_14px_rgba(214,164,68,0.6)]" />

        <div className="hidden items-center gap-2 md:flex">
          {Array.from({ length: TOTAL_SECTIONS + 1 }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentSection ? "w-7 bg-gold" : "w-1.5 bg-foreground/25"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Alturas de scroll */}
      <div className="relative z-[5]">
        {Array.from({ length: TOTAL_SECTIONS + 1 }).map((_, i) => (
          <section key={i} className="h-[100svh] w-full" />
        ))}
      </div>
    </div>
  );
}
