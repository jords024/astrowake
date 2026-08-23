import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import fluiAsset from "../../assets/bussola-tudo-flui.png.asset.json";

export default function BlocoTudoFlui() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from(imageRef.current, {
        opacity: 0,
        y: 32,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 85%", once: true },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="Tem semana que tudo flui"
      className="relative z-10 w-full overflow-hidden rounded-t-[2rem] border-t border-gold/25 bg-background py-14 shadow-[0_-30px_80px_-30px_rgba(0,0,0,0.9)] md:rounded-t-[3rem] md:py-24"
    >
      {/* Halo dourado ao fundo */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(55% 45% at 50% 40%, color-mix(in oklab, var(--gold) 18%, transparent) 0%, transparent 70%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div ref={imageRef} className="relative will-change-transform">
          <img
            src={fluiAsset.url}
            alt="Tem semana que tudo flui: você resolve tudo antes das 10h, responde todo mundo, destrava aquele negócio parado há meses e ainda sobra disposição para sair à noite"
            className="h-auto w-full rounded-2xl"
            loading="lazy"
            decoding="async"
            style={{
              maskImage: "radial-gradient(115% 110% at 50% 50%, #000 55%, transparent 96%)",
              WebkitMaskImage: "radial-gradient(115% 110% at 50% 50%, #000 55%, transparent 96%)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
