import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowDown, Lock, Sparkles } from "lucide-react";
import { fbqTrack, fbqTrackCustom, trackPageView } from "../lib/fbq";
import eclipseAsset from "../assets/astrowake-eclipse-bg.png.asset.json";
import portalAsset from "../assets/astrowake-portal.mp4.asset.json";

export const Route = createFileRoute("/vendas")({
  head: () => ({
    meta: [
      { title: "Astrowake — Formação com Crassus Gobbi" },
      {
        name: "description",
        content:
          "Acesse o seu Registro de Vida. Formação Astrowake com Crassus Gobbi: mapa astral, direção de vida e decisões com consciência.",
      },
      { property: "og:title", content: "Astrowake — Formação com Crassus Gobbi" },
      {
        property: "og:description",
        content:
          "Acesse o seu Registro de Vida. Formação Astrowake com Crassus Gobbi: mapa astral, direção de vida e decisões com consciência.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: eclipseAsset.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: eclipseAsset.url },
    ],
  }),
  component: Vendas,
});

const stages = [
  {
    word: "O NASCIMENTO",
    line1: "No minuto em que você nasceu e puxou o ar pela primeira vez,",
    line2: "ficou registrado quem você é de verdade.",
  },
  {
    word: "O LABIRINTO",
    line1: "Você passou anos se anulando para agradar todo mundo,",
    line2: "tentando tomar decisões no escuro.",
  },
  {
    word: "O RUMO",
    line1: "Chega de dar murro em ponta de faca.",
    line2: "O seu mapa guarda a resposta que você tanto procura.",
  },
];

const EASE = [0.16, 1, 0.3, 1] as const;

function Vendas() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const pixelFired = useRef(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (pixelFired.current) return;
    pixelFired.current = true;
    trackPageView();
  }, []);

  useEffect(() => {
    let frame = 0;
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const introHeight = window.innerHeight * 2;
        const progress = Math.min(window.scrollY / introHeight, 1);
        setScrollProgress(progress);
        setCurrentStage(Math.min(Math.floor(progress * 3), 2));
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const handleCheckout = () => {
    fbqTrack("InitiateCheckout", { content_name: "Formacao Astrowake" });
    fbqTrackCustom("ClicouCheckout", { origem: "hero_vendas" });
    window.location.href = "https://pay.hotmart.com/SEU_LINK_DE_CHECKOUT";
  };

  const stage = stages[currentStage]!;
  const fadeOut = Math.max(0, (scrollProgress - 0.82) / 0.18); // últimos 18% do scroll

  return (
    <div className="relative w-full bg-background text-foreground font-body selection:bg-gold selection:text-background">
      {/* ===================================================================== */}
      {/* 1. PORTAL CINEMATOGRÁFICO                                             */}
      {/* ===================================================================== */}
      <section className="relative w-full h-[280vh]">
        <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
          {/* FUNDO: VÍDEO + ZOOM + PARALLAX + DESFOQUE E ESCURECIMENTO GRADUAL */}
          <div className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover will-change-transform"
              style={{
                transform: `scale(${1 + scrollProgress * 0.2}) translateY(${scrollProgress * -40}px)`,
                filter: `brightness(${1 - scrollProgress * 0.55}) contrast(112%) blur(${scrollProgress * 8}px)`,
              }}
            >
              <source src={portalAsset.url} type="video/mp4" />
            </video>
            {/* Fusão em degradê com o preto da página */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background"
              style={{ opacity: 0.35 + scrollProgress * 0.65 }}
            />
            <div
              className="absolute inset-0 bg-background"
              style={{ opacity: Math.max(0, (scrollProgress - 0.65) / 0.35) * 0.8 }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 42%, transparent 0%, transparent 26%, rgba(10,10,10,0.55) 72%, rgba(10,10,10,0.95) 100%)",
              }}
            />
          </div>

          {/* BADGE FLUTUANTE */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="absolute top-6 left-6 z-30 flex items-center gap-2 rounded-full border border-gold/30 bg-background/70 px-4 py-2 backdrop-blur-md sm:top-8 sm:left-8"
          >
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/90">
              Portal Astrowake
            </span>
          </motion.div>

          {/* PALAVRAS COM TRANSIÇÃO FLUIDA */}
          <div
            className="relative z-20 max-w-4xl select-none px-6 text-center"
            style={{ opacity: 1 - fadeOut }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStage}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 40, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -40, scale: 1.04 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="space-y-5"
              >
                <h2 className="font-display text-5xl font-black tracking-tighter text-gold-gradient drop-shadow-[0_10px_45px_rgba(214,164,68,0.5)] sm:text-7xl md:text-8xl lg:text-9xl">
                  {stage.word}
                </h2>
                <div className="space-y-1">
                  <p className="text-lg font-medium tracking-tight text-foreground drop-shadow-[0_4px_18px_rgba(0,0,0,0.8)] sm:text-2xl">
                    {stage.line1}
                  </p>
                  <p className="text-base font-normal tracking-tight text-gold-soft drop-shadow-[0_4px_22px_rgba(214,164,68,0.35)] sm:text-xl">
                    {stage.line2}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* INDICADOR DE SCROLL */}
          <div
            className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-300"
            style={{ opacity: 1 - fadeOut }}
          >
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/80 drop-shadow">
              Role para atravessar o portal
            </span>
            <div className="h-1 w-40 overflow-hidden rounded-full border border-border bg-secondary/80">
              <div
                className="h-full bg-gradient-to-r from-gold to-gold-deep"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
            <ArrowDown className="mt-1 h-4 w-4 animate-bounce text-gold" />
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* 2. BLOCO 1: HEADLINE — SOBE POR CIMA DO ECLIPSE EM DEGRADÊ            */}
      {/* ===================================================================== */}
      <section className="relative z-30 -mt-[30vh] bg-gradient-to-b from-transparent via-background/95 to-background pt-[30vh] pb-24 md:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mx-auto max-w-4xl px-6 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-soft">
              Formação Astrowake com Crassus Gobbi
            </span>
          </div>

          <h1 className="mt-8 font-display text-4xl font-black leading-[1.12] tracking-tighter text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)] sm:text-5xl md:text-6xl">
            No minuto em que você nasceu e puxou o ar pela primeira vez,{" "}
            <span className="text-gold-gradient drop-shadow-[0_10px_40px_rgba(214,164,68,0.35)]">
              ficou registrado quem você é de verdade.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg font-normal leading-relaxed tracking-tight text-muted-foreground sm:text-xl">
            O problema é que você passou os últimos vinte anos tentando ser quem a sua família, o
            seu trabalho e os seus relacionamentos queriam que você fosse. Você se anulou tanto para
            dar conta de tudo que hoje mal se reconhece quando se olha no espelho.
          </p>

          <div className="mx-auto mt-10 max-w-md">
            <button
              onClick={handleCheckout}
              className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-gold via-gold-soft to-gold px-8 py-5 text-lg font-black uppercase tracking-wider text-background shadow-[0_18px_50px_-12px_color-mix(in_oklab,var(--gold)_45%,transparent)] transition-all hover:brightness-110 active:scale-[0.99]"
            >
              <span>Quero acessar meu registro de vida</span>
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              <span>Inscrição Segura • 7 Dias de Garantia Incondicional</span>
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
