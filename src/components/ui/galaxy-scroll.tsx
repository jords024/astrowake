import { useEffect, useRef } from "react";

type Star = { x: number; y: number; z: number; size: number; hue: number };

/**
 * Campo de estrelas em profundidade que só se move quando o usuário rola a
 * página (para baixo = avanço, para cima = recuo). A velocidade decai
 * suavemente até parar, dando sensação de "andamento" cinematográfico.
 */
export default function GalaxyScroll({ opacity = 1 }: { opacity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    const DEPTH = 1400;
    const count = isMobile ? 260 : 520;
    const stars: Star[] = [];

    const spawn = (z?: number): Star => ({
      x: (Math.random() - 0.5) * 2200,
      y: (Math.random() - 0.5) * 2200,
      z: z ?? Math.random() * DEPTH,
      size: 0.6 + Math.random() * 1.4,
      hue: Math.random(),
    });

    for (let i = 0; i < count; i++) stars.push(spawn());

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let velocity = 0; // unidades de z por frame
    let lastScrollY = window.scrollY;
    let raf = 0;

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY;
      lastScrollY = y;
      // impulso proporcional ao deslocamento do scroll
      velocity += delta * (reduced ? 0.15 : 0.9);
      velocity = Math.max(-70, Math.min(70, velocity));
    };

    const focal = isMobile ? 340 : 460;

    const render = () => {
      raf = requestAnimationFrame(render);

      // amortecimento: para quando o scroll para
      velocity *= 0.92;
      if (Math.abs(velocity) < 0.02) velocity = 0;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      const cx = width / 2;
      const cy = height / 2;
      const speed = Math.abs(velocity);

      for (const s of stars) {
        s.z -= velocity;
        if (s.z <= 1) {
          Object.assign(s, spawn(DEPTH));
        } else if (s.z > DEPTH) {
          Object.assign(s, spawn(1 + Math.random() * 40));
        }

        const k = focal / s.z;
        const x = cx + s.x * k;
        const y = cy + s.y * k;
        if (x < -80 || x > width + 80 || y < -80 || y > height + 80) continue;

        const depthFade = 1 - s.z / DEPTH;
        const alpha = Math.max(0, Math.min(1, 0.12 + depthFade * 0.9));
        const r = Math.max(0.35, s.size * k * 1.6);

        // rastro proporcional à velocidade do scroll
        const trail = Math.min(90, speed * k * 6);
        const warm = s.hue > 0.82;
        const color = warm ? "214,164,68" : "220,232,255";

        if (trail > 1.2) {
          const pz = s.z + velocity;
          const pk = focal / Math.max(pz, 1);
          const px = cx + s.x * pk;
          const py = cy + s.y * pk;
          ctx.strokeStyle = `rgba(${color},${alpha * 0.55})`;
          ctx.lineWidth = r;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(x, y);
          ctx.stroke();
        }

        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] h-full w-full"
      style={{ opacity, transition: "opacity 0.2s linear" }}
    />
  );
}
