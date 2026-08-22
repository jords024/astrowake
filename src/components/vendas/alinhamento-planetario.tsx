import { useEffect, useRef } from "react";

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

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

export default function AlinhamentoPlanetario() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const lineRef = useRef<HTMLDivElement | null>(null);
  const sunRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const amp = isMobile ? 0.55 : 1;

    const apply = (progress: number) => {
      itemsRef.current.forEach((el, i) => {
        const planeta = PLANETAS[i];
        if (!el || !planeta) return;
        // cada planeta alinha em um instante levemente diferente (cascata)
        const start = i * 0.055;
        const t = easeOut(clamp01((progress - start) / (1 - start * 0.6)));
        const inv = 1 - t;
        const dx = planeta.offset * amp * inv;
        const rot = planeta.rot * amp * inv;
        const scale = 0.72 + 0.28 * t;
        el.style.transform = `translate3d(${dx}%, ${inv * 8 * amp}px, 0) rotate(${rot}deg) scale(${scale})`;
        el.style.opacity = String(0.25 + 0.75 * t);
      });
      if (lineRef.current) {
        lineRef.current.style.transform = `scaleY(${easeOut(clamp01(progress * 1.1))})`;
        lineRef.current.style.opacity = String(0.15 + 0.55 * clamp01(progress));
      }
      if (sunRef.current) {
        sunRef.current.style.opacity = String(0.45 + 0.55 * clamp01(progress * 1.4));
      }
    };

    if (reduced) {
      apply(1);
      return;
    }

    let ticking = false;
    let visible = false;

    const update = () => {
      ticking = false;
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = rect.height + vh * 0.6;
      const progress = clamp01((vh * 0.85 - rect.top) / total);
      apply(progress);
    };

    const onScroll = () => {
      if (!visible || ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        if (visible) update();
      },
      { rootMargin: "20% 0px" },
    );
    io.observe(section);

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden bg-background py-24 md:py-32"
      aria-label="Alinhamento planetário"
    >
      {/* Fundo preto puro: necessário para o blend "screen" dos planetas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(130% 85% at 50% 45%, #000 40%, color-mix(in oklab, #000 65%, var(--background)) 72%, transparent 100%)",
        }}
      />

      {/* Sol no topo */}
      <div
        ref={sunRef}
        aria-hidden
        className="pointer-events-none absolute -top-[42vw] left-1/2 h-[70vw] w-[150vw] -translate-x-1/2 rounded-[50%] opacity-50 md:-top-[26vw] md:h-[44vw] md:w-[110vw]"
        style={{
          background:
            "radial-gradient(closest-side, color-mix(in oklab, var(--gold-soft) 92%, white) 0%, color-mix(in oklab, var(--gold) 70%, transparent) 42%, color-mix(in oklab, var(--gold-deep) 26%, transparent) 62%, transparent 78%)",
        }}
      />

      {/* Fusão suave com o bloco anterior */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 md:h-56"
        style={{ background: "linear-gradient(to bottom, var(--background), transparent)" }}
      />

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-gold/80">
          O alinhamento
        </p>
        <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-gold-gradient sm:text-4xl md:text-5xl">
          Quando tudo se alinha, a vida para de parecer um acaso
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
          Cada área da sua vida é um corpo em movimento. O Astrowake mostra a ordem por trás delas.
        </p>
      </div>

      {/* Coluna de planetas */}
      <div className="relative mx-auto mt-16 w-full max-w-lg px-6 md:mt-20">
        <div
          ref={lineRef}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-full w-px origin-top -translate-x-1/2 opacity-0"
          style={{
            background:
              "linear-gradient(to bottom, transparent, color-mix(in oklab, var(--gold) 55%, transparent) 12%, color-mix(in oklab, var(--gold) 35%, transparent) 80%, transparent)",
          }}
        />

        <div className="relative flex flex-col items-center gap-6 md:gap-9">
          {PLANETAS.map((planeta, i) => (
            <div
              key={planeta.alt}
              ref={(el) => {
                if (el) itemsRef.current[i] = el;
              }}
              className="will-change-transform"
              style={{ width: `${planeta.w * 1.85}%`, opacity: 0.25 }}
            >
              <img
                src={planeta.url}
                alt={planeta.alt}
                loading="lazy"
                decoding="async"
                className="block w-full select-none"
                style={{ mixBlendMode: "screen" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
