import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowDown, Lock, Sparkles, ShieldCheck } from "lucide-react";
import { fbqTrack, fbqTrackCustom, trackPageView } from "../lib/fbq";
import eclipseAsset from "../assets/astrowake-eclipse-bg.png.asset.json";

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

function Vendas() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState(0);
  const pixelFired = useRef(false);

  useEffect(() => {
    if (pixelFired.current) return;
    pixelFired.current = true;
    trackPageView();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const introHeight = window.innerHeight * 1.5;
      const progress = Math.min(scrollY / introHeight, 1);
      setScrollProgress(progress);
      const stageIndex = Math.min(Math.floor(progress * 3), 2);
      setCurrentStage(stageIndex);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCheckout = () => {
    fbqTrack("InitiateCheckout", { content_name: "Formacao Astrowake" });
    fbqTrackCustom("ClicouCheckout", { origem: "hero_vendas" });
    window.location.href = "https://pay.hotmart.com/SEU_LINK_DE_CHECKOUT";
  };

  return (
    <div className="relative w-full bg-background text-foreground font-body selection:bg-gold selection:text-background">
      {/* ========================================================================= */}
      {/* 1. SEÇÃO FIXA DE TRANSIÇÃO DO PORTAL (SCROLL INICIAL)                     */}
      {/* ========================================================================= */}
      <section className="relative w-full h-[220vh]">
        <div className="sticky top-0 w-full h-screen overflow-hidden flex flex-col items-center justify-center">
          {/* IMAGEM DE FUNDO DO ECLIPSE COM PROFUNDIDADE */}
          <div className="absolute inset-0 w-full h-full pointer-events-none">
            <img
              src={eclipseAsset.url}
              alt="Portal Astrowake — eclipse dourado com rodas astronômicas e montanhas de obsidiana"
              className="h-full w-full object-cover transition-transform duration-75 ease-linear will-change-transform"
              style={{
                transform: `scale(${1.05 + scrollProgress * 0.1}) translateY(${scrollProgress * 20}px)`,
              }}
              fetchPriority="high"
            />
            {/* Degradê de fusão com a página escura */}
            <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 40%, transparent 0%, transparent 25%, rgba(10,10,10,0.6) 70%, rgba(10,10,10,0.95) 100%)",
              }}
            />
          </div>

          {/* BADGE FLUTUANTE SUPERIOR */}
          <div className="absolute top-6 left-6 z-30 flex items-center gap-2 rounded-full border border-gold/30 bg-background/70 px-4 py-2 backdrop-blur-md sm:top-8 sm:left-8">
            <Sparkles className="h-4 w-4 text-gold" />
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/90">
              Portal Astrowake
            </span>
          </div>

          {/* PALAVRAS HUMANAS DO SCROLL (O NASCIMENTO -> O LABIRINTO -> O RUMO) */}
          <div className="relative z-20 max-w-4xl select-none px-6 text-center">
            <h2 className="font-display text-5xl font-black tracking-tight text-gold-gradient drop-shadow-[0_10px_35px_rgba(200,150,60,0.35)] sm:text-7xl md:text-8xl lg:text-9xl">
              {stages[currentStage]?.word}
            </h2>
            <div className="mt-5 space-y-1 sm:mt-6">
              <p className="text-lg font-medium text-foreground drop-shadow-md sm:text-2xl">
                {stages[currentStage]?.line1}
              </p>
              <p className="text-base font-normal text-gold-soft drop-shadow-md sm:text-xl">
                {stages[currentStage]?.line2}
              </p>
            </div>
          </div>

          {/* INDICADOR DE SCROLL INFERIOR */}
          <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-foreground/80 drop-shadow">
              Role para entrar na página
            </span>
            <div className="h-1 w-36 overflow-hidden rounded-full border border-border bg-secondary/80">
              <div
                className="h-full bg-gradient-to-r from-gold to-gold-deep transition-all duration-150"
                style={{ width: `${scrollProgress * 100}%` }}
              />
            </div>
            <ArrowDown className="mt-1 h-4 w-4 animate-bounce text-gold" />
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. BLOCO 1 COMPLETO: HEADLINE HUMANA E CHAMADA DE ENTRADA                 */}
      {/* ========================================================================= */}
      <section className="relative z-20 border-y border-border bg-gradient-to-b from-background via-secondary/30 to-background py-24 md:py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 backdrop-blur-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-gold-soft">
              Formação Astrowake com Crassus Gobbi
            </span>
          </div>

          <h1 className="mt-8 font-display text-4xl font-black leading-[1.12] tracking-tight text-white sm:text-5xl md:text-6xl">
            No minuto em que você nasceu e puxou o ar pela primeira vez,{" "}
            <span className="text-gold-gradient">ficou registrado quem você é de verdade.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg font-normal leading-relaxed text-muted-foreground sm:text-xl">
            O problema é que você passou os últimos vinte anos tentando ser quem a sua família, o
            seu trabalho e os seus relacionamentos queriam que você fosse. Você se anulou tanto para
            dar conta de tudo que hoje mal se reconhece quando se olha no espelho.
          </p>

          <div className="mx-auto mt-10 max-w-md">
            <button
              onClick={handleCheckout}
              className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-gold via-gold-soft to-gold px-8 py-5 text-lg font-black uppercase tracking-wider text-background shadow-[0_18px_50px_-12px_color-mix(in_oklab,var(--gold)_35%,transparent)] transition-all hover:brightness-110 active:scale-[0.99]"
            >
              <span>Quero acessar meu registro de vida</span>
              <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
            </button>
            <p className="mt-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" />
              <span>Inscrição Segura • 7 Dias de Garantia Incondicional</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
