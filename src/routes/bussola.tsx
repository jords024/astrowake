import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { fbqTrack, fbqTrackCustom, trackPageView } from "../lib/fbq";
import heroAsset from "../assets/bussola-hero.png.asset.json";
import HeroBussola from "../components/bussola/hero-bussola";
import BlocoTudoFlui from "../components/bussola/bloco-tudo-flui";
import BlocoSemanaSeguinte from "../components/bussola/bloco-semana-seguinte";
import BlocoRelogioCosmico from "../components/bussola/bloco-relogio-cosmico";
import Bloco12Casas from "../components/bussola/bloco-12-casas";
import BlocoHistoriaCrassus from "../components/bussola/bloco-historia-crassus";
import BlocoErroNuncaFoiVoce from "../components/bussola/bloco-erro-nunca-foi-voce";


const DESCRICAO =
  "Aprenda a identificar quais portas estão abertas para você agora — no dinheiro, no amor, na carreira e em outras 9 áreas da vida. Acesso imediato, 7 dias de garantia.";

export const Route = createFileRoute("/bussola")({
  head: () => ({
    meta: [
      { title: "Bússola Astrológica — Saiba quais portas estão abertas agora" },
      { name: "description", content: DESCRICAO },
      {
        property: "og:title",
        content: "Bússola Astrológica — Saiba quais portas estão abertas agora",
      },
      { property: "og:description", content: DESCRICAO },
      { property: "og:type", content: "website" },
      { property: "og:image", content: heroAsset.url },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: heroAsset.url },
    ],
  }),
  component: BussolaPage,
});

const CHECKOUT_URL = "https://pay.hotmart.com/Q107238351O";

function BussolaPage() {
  const pixelFired = useRef(false);

  useEffect(() => {
    if (pixelFired.current) return;
    pixelFired.current = true;
    trackPageView();
  }, []);

  const handleCheckout = () => {
    fbqTrack("InitiateCheckout", { content_name: "Bussola Astrologica" });
    fbqTrackCustom("ClicouCheckout", { origem: "hero_bussola" });
    window.location.href = CHECKOUT_URL;
  };

  return (
    <main className="relative w-full bg-background font-body text-foreground selection:bg-gold selection:text-background">
      <HeroBussola onCheckout={handleCheckout} />
      <BlocoTudoFlui />
      <BlocoSemanaSeguinte />
      <BlocoRelogioCosmico />
      <Bloco12Casas />
      <BlocoHistoriaCrassus />

    </main>
  );
}
