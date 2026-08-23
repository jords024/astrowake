import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { fbqTrack, fbqTrackCustom, trackPageView } from "../lib/fbq";
import heroAsset from "../assets/bussola-hero.png.asset.json";
import HeroBussola from "../components/bussola/hero-bussola";
import BlocoTudoFlui from "../components/bussola/bloco-tudo-flui";

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
  const heroRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (pixelFired.current) return;
    pixelFired.current = true;
    trackPageView();
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      gsap.to(hero, {
        scale: isMobile ? 0.96 : 0.92,
        filter: "brightness(0.55)",
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  const handleCheckout = () => {
    fbqTrack("InitiateCheckout", { content_name: "Bussola Astrologica" });
    fbqTrackCustom("ClicouCheckout", { origem: "hero_bussola" });
    window.location.href = CHECKOUT_URL;
  };

  return (
    <main className="relative w-full bg-background font-body text-foreground selection:bg-gold selection:text-background">
      <div ref={heroRef} className="sticky top-0 z-0 origin-center will-change-transform">
        <HeroBussola onCheckout={handleCheckout} />
      </div>
      <BlocoTudoFlui />
    </main>
  );
}
