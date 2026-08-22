import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Zap, Tag } from "lucide-react";
import heroAsset from "../../assets/bussola-hero.png.asset.json";

const EASE = [0.16, 1, 0.3, 1] as const;

type Props = {
  onCheckout: () => void;
};

export default function HeroBussola({ onCheckout }: Props) {
  return (
    <header className="relative isolate flex min-h-[100svh] w-full items-center overflow-hidden bg-[oklch(0.09_0.03_265)]">
      {/* Fundo cósmico — mandala nítida à direita, nebulosa azul à esquerda */}
      <img
        src={heroAsset.url}
        alt="Roda zodiacal dourada com planetas em um céu estrelado"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[70%_center] md:object-[center_center]"
        loading="eager"
        fetchPriority="high"
      />

      {/* Brilho azul da galáxia no lado esquerdo */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_18%_45%,oklch(0.42_0.13_265/0.55),transparent_70%)]" />

      {/* Véu apenas atrás do texto — mandala permanece nítida */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[oklch(0.07_0.02_265/0.85)] via-[oklch(0.07_0.02_265/0.55)] to-[oklch(0.07_0.02_265/0.8)] md:bg-[linear-gradient(90deg,oklch(0.07_0.02_265/0.92)_0%,oklch(0.07_0.02_265/0.75)_32%,oklch(0.07_0.02_265/0.25)_50%,transparent_65%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[oklch(0.07_0.02_265)] to-transparent" />


      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="max-w-2xl text-center md:text-left"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            Bússola Astrológica
          </span>

          <h1 className="mt-6 font-display text-4xl leading-[1.08] tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Pare de insistir em portas fechadas.{" "}
            <span className="text-gold-gradient font-semibold">
              Aprenda a identificar quais estão abertas para você agora
            </span>
            , no dinheiro, no amor, na carreira e em outras{" "}
            <span className="text-gold">9 áreas</span> da sua vida…
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg md:mx-0 mx-auto">
            Em vez de gastar energia tentando fazer acontecer a qualquer custo, descubra o que o seu
            próprio mapa está sinalizando, e aprenda a agir de acordo com o momento que está vivendo{" "}
            <strong className="font-semibold text-foreground">AGORA</strong> sem misticismo raso e
            com precisão de um relógio cósmico
          </p>

          <p className="mt-5 flex items-start justify-center gap-2 text-sm text-muted-foreground md:justify-start">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
            <span>
              Sem precisar se tornar especialista em astrologia ou decorar centenas de símbolos
            </span>
          </p>

          <div className="mt-9 max-w-md md:mx-0 mx-auto">
            <button
              type="button"
              onClick={onCheckout}
              className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-gold-deep via-gold-soft to-gold px-8 py-5 text-sm font-black uppercase tracking-[0.16em] text-background shadow-[0_18px_50px_-12px_color-mix(in_oklab,var(--gold)_45%,transparent)] transition-all hover:brightness-110 active:scale-[0.99] sm:text-base"
            >
              <span>Quero abrir minhas portas</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground md:justify-start">
              <span className="flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-gold" /> Acesso imediato
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-gold" /> 7 dias de garantia
              </span>
              <span className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-gold" /> R$67
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
