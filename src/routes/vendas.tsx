import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@tanstack/react-router";
import { Suspense, lazy, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { fbqTrack, fbqTrackCustom, trackPageView } from "../lib/fbq";
import eclipseAsset from "../assets/astrowake-eclipse-bg.png.asset.json";

const HorizonHero = lazy(() => import("../components/ui/horizon-hero-section"));

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

const EASE = [0.16, 1, 0.3, 1] as const;

function Vendas() {
  const pixelFired = useRef(false);

  useEffect(() => {
    if (pixelFired.current) return;
    pixelFired.current = true;
    trackPageView();
  }, []);

  const handleCheckout = () => {
    fbqTrack("InitiateCheckout", { content_name: "Formacao Astrowake" });
    fbqTrackCustom("ClicouCheckout", { origem: "hero_vendas" });
    window.location.href = "https://pay.hotmart.com/SEU_LINK_DE_CHECKOUT";
  };

  return (
    <main className="relative w-full bg-background font-body text-foreground selection:bg-gold selection:text-background">
      {/* ===================================================================== */}
      {/* 1. PORTAL ASTROWAKE — HERO 3D                                         */}
      {/* ===================================================================== */}
      <ClientOnly fallback={<div className="h-screen w-full bg-background" />}>
        <Suspense fallback={<div className="h-screen w-full bg-background" />}>
          <HorizonHero />
        </Suspense>
      </ClientOnly>

      {/* ===================================================================== */}
      {/* 2. BLOCO 1: HEADLINE                                                  */}
      {/* ===================================================================== */}
      <section className="relative z-30 -mt-[20vh] bg-gradient-to-b from-transparent via-background to-background pb-24 pt-[34vh] md:pb-32">
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

          <h2 className="mt-8 font-display text-4xl font-black leading-[1.12] tracking-tighter text-foreground drop-shadow-[0_8px_30px_rgba(0,0,0,0.6)] sm:text-5xl md:text-6xl">
            No minuto em que você nasceu e puxou o ar pela primeira vez,{" "}
            <span className="text-gold-gradient drop-shadow-[0_10px_40px_rgba(214,164,68,0.35)]">
              ficou registrado quem você é de verdade.
            </span>
          </h2>

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
    </main>
  );
}
