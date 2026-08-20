// @ts-nocheck
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import GalaxyScroll from "./galaxy-scroll";


const titles: Record<number, string> = {
  0: "NASCIMENTO",
  1: "LABIRINTO",
  2: "O RUMO",
};

const subtitles: Record<number, { line1: string; line2: string }> = {
  0: {
    line1: "No minuto em que você nasceu e puxou o ar,",
    line2: "ficou registrado quem você é de verdade",
  },
  1: {
    line1: "Você passou anos se anulando para agradar todo mundo,",
    line2: "tentando tomar decisões no escuro",
  },
  2: {
    line1: "Chega de dar murro em ponta de faca,",
    line2: "o seu mapa guarda a resposta que você procura",
  },
};

export default function HorizonHero() {
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [outro, setOutro] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const totalSections = 2;

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    gsap.set(
      [menuRef.current, titleRef.current, subtitleRef.current, scrollProgressRef.current],
      { visibility: "visible" },
    );

    const isMobile =
      typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

    const tl = gsap.timeline();

    if (menuRef.current) {
      tl.from(menuRef.current, { x: -100, opacity: 0, duration: 1, ease: "power3.out" });
    }
    if (titleRef.current) {
      if (isMobile) {
        tl.fromTo(
          titleRef.current,
          { y: 28, opacity: 0, filter: "blur(6px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.7,
            ease: "power2.out",
            clearProps: "filter,transform",
          },
          "-=0.6",
        );
      } else {
        tl.fromTo(
          titleRef.current.querySelectorAll(".title-char"),
          { y: 120, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            stagger: 0.035,
            ease: "power3.out",
            clearProps: "transform,opacity",
          },
          "-=0.5",
        );
      }
    }

    if (subtitleRef.current) {
      tl.from(
        subtitleRef.current.querySelectorAll(".subtitle-line"),
        {
          y: isMobile ? 14 : 40,
          opacity: 0,
          duration: isMobile ? 0.5 : 0.9,
          stagger: isMobile ? 0.08 : 0.15,
          ease: "power2.out",
        },
        isMobile ? "-=0.45" : "-=0.8",
      );
    }
    if (scrollProgressRef.current) {
      tl.from(scrollProgressRef.current, { opacity: 0, y: 40, duration: 1 }, "-=0.5");
    }

    return () => {
      tl.kill();
      if (titleRef.current) gsap.set(titleRef.current, { clearProps: "all" });
      const chars = titleRef.current?.querySelectorAll(".title-char");
      if (chars?.length) gsap.set(chars, { clearProps: "all" });
      const lines = subtitleRef.current?.querySelectorAll(".subtitle-line");
      if (lines?.length) gsap.set(lines, { clearProps: "all" });
    };
  }, [isReady, currentSection]);

  useEffect(() => {
    let raf = 0;
    const easeInOut = (t: number) => t * t * (3 - 2 * t);

    const apply = () => {
      raf = 0;
      const vh = window.innerHeight;
      const heroSpan = vh * totalSections;
      if (heroSpan <= 0) return;

      const progress = Math.min(Math.max(window.scrollY / heroSpan, 0), 1);
      setScrollProgress(progress);
      setOutro(Math.max(0, Math.min(1, (window.scrollY - vh * 1.9) / (vh * 0.7))));

      const stagePos = progress * totalSections;
      setCurrentSection(Math.min(Math.round(stagePos), totalSections));
    };

    const handleScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(apply);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    apply();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const splitTitle = (text: string) =>
    text.split("").map((char, i) => (
      <span
        key={`${char}-${i}`}
        className="title-char inline-block text-gold-gradient"
      >
        {char === " " ? "\u00a0" : char}
      </span>
    ));

  const subtitle = subtitles[currentSection] ?? subtitles[0]!;
  const sceneOpacity = 1 - outro;

  return (
    <div className="relative w-full bg-black">
      {/* Fundo preto sólido */}
      <div
        className="fixed inset-0 z-0 bg-black"
        style={{ opacity: sceneOpacity, transition: "opacity 0.2s linear" }}
      />

      {/* Galáxia em profundidade reagindo ao scroll */}
      <GalaxyScroll opacity={sceneOpacity} />


      {/* Fusão inferior com a próxima seção */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[2] h-[45vh]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.55) 45%, #000000 100%)",
        }}
      />

      {/* Menu lateral */}
      <div
        ref={menuRef}
        className="pointer-events-none fixed left-4 top-1/2 z-20 hidden -translate-y-1/2 md:block"
        style={{ visibility: "hidden", opacity: sceneOpacity }}
      >
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
          transition: "opacity 0.2s linear",
        }}
      >
        <h1
          key={`title-${currentSection}`}
          ref={titleRef}
          className="relative max-w-[92vw] font-display text-[2.75rem] font-black leading-none tracking-tighter sm:drop-shadow-[0_10px_45px_rgba(214,164,68,0.5)] sm:text-7xl md:text-8xl lg:text-9xl"
          style={{ visibility: "hidden" }}
        >
          {splitTitle(titles[currentSection] || "NASCIMENTO")}
        </h1>

        <div
          ref={subtitleRef}
          className="relative mt-5 max-w-[34rem] space-y-2 sm:mt-6"
          style={{ visibility: "hidden" }}
        >
          <p className="subtitle-line text-[0.95rem] font-medium leading-snug tracking-tight text-foreground sm:drop-shadow-[0_4px_18px_rgba(0,0,0,0.8)] sm:text-xl">
            {subtitle.line1}
          </p>
          <p className="subtitle-line text-[0.85rem] font-normal leading-snug tracking-tight text-gold-soft sm:drop-shadow-[0_4px_22px_rgba(214,164,68,0.35)] sm:text-lg">
            {subtitle.line2}
          </p>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div
        ref={scrollProgressRef}
        className="pointer-events-none fixed bottom-[max(1.5rem,env(safe-area-inset-bottom))] left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-3"
        style={{ visibility: "hidden", opacity: sceneOpacity }}
      >
        <span className="max-w-[80vw] text-center text-[0.7rem] font-semibold uppercase leading-relaxed tracking-[0.22em] text-foreground/85 sm:drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:text-xs sm:tracking-[0.3em]">
          {currentSection === 0
            ? "Desça para acessar as instruções da sua alma"
            : currentSection < totalSections
              ? "Continue descendo"
              : "Você chegou — siga para o próximo passo"}
        </span>

        <ChevronDown className="h-5 w-5 animate-bounce text-gold drop-shadow-[0_2px_14px_rgba(214,164,68,0.6)]" />

        <div className="hidden items-center gap-2 md:flex">
          {Array.from({ length: totalSections + 1 }).map((_, i) => (
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
        {Array.from({ length: totalSections + 1 }).map((_, i) => (
          <section key={i} className="h-[100svh] w-full" />
        ))}
      </div>
    </div>
  );
}
