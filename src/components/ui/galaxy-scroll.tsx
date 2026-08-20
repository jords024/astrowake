import { useEffect, useRef } from "react";

type Star = { x: number; y: number; z: number; size: number; warm: boolean };

/**
 * Campo de estrelas em profundidade que só se move quando o usuário rola a
 * página. O loop de render é sob demanda: quando a velocidade zera, o
 * requestAnimationFrame é interrompido (custo ~0 de CPU/GPU em repouso).
 */
export default function GalaxyScroll({ opacity = 1 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    // heurística de aparelho fraco: poucos núcleos ou pouca memória
    const cores = (navigator as unknown as { hardwareConcurrency?: number }).hardwareConcurrency ?? 4;
    const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 4;
    const lowEnd = isMobile && (cores <= 4 || mem <= 4);

    let width = 0;
    let height = 0;
    const DEPTH = 1400;
    const count = reduced ? 0 : lowEnd ? 90 : isMobile ? 150 : 420;
    const stars: Star[] = [];

    const spawn = (z?: number): Star => ({
      x: (Math.random() - 0.5) * 2200,
      y: (Math.random() - 0.5) * 2200,
      z: z ?? Math.random() * DEPTH,
      size: 0.6 + Math.random() * 1.4,
      warm: Math.random() > 0.82,
    });

    for (let i = 0; i < count; i++) stars.push(spawn());

    // resolução reduzida no mobile: o canvas é escalado por CSS
    const scale = lowEnd ? 0.6 : isMobile ? 0.75 : 1;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.5) * scale;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let velocity = 0;
    let lastScrollY = window.scrollY;
    let raf = 0;
    let running = false;
    let visible = true;

    const focal = isMobile ? 340 : 460;

    const render = () => {
      velocity *= 0.9;
      if (Math.abs(velocity) < 0.05) velocity = 0;

      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const speed = Math.abs(velocity);
      const drawTrails = !isMobile && speed > 0.5;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i]!;
        s.z -= velocity;
        if (s.z <= 1) {
          Object.assign(s, spawn(DEPTH));
        } else if (s.z > DEPTH) {
          Object.assign(s, spawn(1 + Math.random() * 40));
        }

        const k = focal / s.z;
        const x = cx + s.x * k;
        const y = cy + s.y * k;
        if (x < -40 || x > width + 40 || y < -40 || y > height + 40) continue;

        const depthFade = 1 - s.z / DEPTH;
        const alpha = Math.max(0, Math.min(1, 0.12 + depthFade * 0.9));
        const r = Math.max(0.4, s.size * k * 1.6);
        const color = s.warm ? "214,164,68" : "220,232,255";

        if (drawTrails) {
          const trail = speed * k * 6;
          if (trail > 1.2) {
            const pk = focal / Math.max(s.z + velocity, 1);
            ctx.strokeStyle = `rgba(${color},${alpha * 0.5})`;
            ctx.lineWidth = r;
            ctx.beginPath();
            ctx.moveTo(cx + s.x * pk, cy + s.y * pk);
            ctx.lineTo(x, y);
            ctx.stroke();
          }
        }

        ctx.fillStyle = `rgba(${color},${alpha})`;
        // fillRect é bem mais barato que arc() em GPUs móveis
        const d = r * 2;
        ctx.fillRect(x - r, y - r, d, d);
      }

      if (velocity === 0) {
        running = false;
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(render);
    };

    const start = () => {
      if (running || !visible || count === 0) return;
      running = true;
      raf = requestAnimationFrame(render);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY;
      lastScrollY = y;
      // desativa a cena quando a hero já saiu da tela
      const nextVisible = y < window.innerHeight * 3.4;
      if (nextVisible !== visible) {
        visible = nextVisible;
        canvas.style.display = visible ? "block" : "none";
        if (!visible) {
          velocity = 0;
          if (raf) cancelAnimationFrame(raf);
          raf = 0;
          running = false;
          ctx.clearRect(0, 0, width, height);
          return;
        }
      }
      if (!visible) return;
      velocity += delta * (reduced ? 0 : isMobile ? 0.6 : 0.9);
      velocity = Math.max(-70, Math.min(70, velocity));
      start();
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        resize();
        start();
      }, 150);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(resizeTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full"
      style={{ opacity, transition: "opacity 0.2s linear", contain: "strict" }}
    />
  );
}
