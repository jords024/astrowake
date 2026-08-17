// @ts-nocheck
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const titleRef = useRef<HTMLHeadingElement | null>(null);
  const subtitleRef = useRef<HTMLDivElement | null>(null);
  const scrollProgressRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const smoothCameraPos = useRef({ x: 0, y: 30, z: 100 });

  const [scrollProgress, setScrollProgress] = useState(0);
  const [outro, setOutro] = useState(0);
  const [currentSection, setCurrentSection] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const totalSections = 2;

  const threeRefs = useRef<any>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    mountains: [],
    animationId: null,
  });

  useEffect(() => {
    const refs = threeRefs.current;


    const createMountains = () => {
      const layers = [
        { distance: -50, height: 60, top: 0x080808, base: 0x000000, opacity: 1 },
        { distance: -100, height: 80, top: 0x0c0c0c, base: 0x020202, opacity: 0.95 },
        { distance: -150, height: 100, top: 0x101010, base: 0x040404, opacity: 0.85 },
        { distance: -200, height: 120, top: 0x141414, base: 0x060606, opacity: 0.7 },

      ];

      layers.forEach((layer, index) => {
        const points: THREE.Vector2[] = [];
        const segments = 90;
        let minY = Infinity;
        let maxY = -Infinity;
        const seed = index * 13.7;
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 1000;
          // ruído determinístico: silhueta estável e mais natural
          const y =
            Math.sin(i * 0.13 + seed) * layer.height +
            Math.sin(i * 0.061 + seed * 1.7) * layer.height * 0.55 +
            Math.sin(i * 0.31 + seed * 0.6) * layer.height * 0.18 -
            100;
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
          points.push(new THREE.Vector2(x, y));
        }
        points.push(new THREE.Vector2(5000, -300));
        points.push(new THREE.Vector2(-5000, -300));

        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            topColor: { value: new THREE.Color(layer.top) },
            baseColor: { value: new THREE.Color(layer.base) },
            ridge: { value: maxY },
            floor: { value: -300 },
            opacity: { value: layer.opacity },
            rim: { value: 0.55 - index * 0.1 },
          },
          vertexShader: `
            varying float vY;
            void main() {
              vY = position.y;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 topColor;
            uniform vec3 baseColor;
            uniform float ridge;
            uniform float floor;
            uniform float opacity;
            uniform float rim;
            varying float vY;
            void main() {
              float t = clamp((vY - floor) / max(ridge - floor, 0.001), 0.0, 1.0);
              vec3 col = mix(baseColor, topColor, pow(t, 1.6));
              // luz fria rasante vinda do sol, só perto da crista
              col += vec3(0.60, 0.72, 1.0) * pow(t, 9.0) * rim;

              gl_FragColor = vec4(col, opacity);
            }
          `,
          transparent: true,
          side: THREE.DoubleSide,
        });

        const mountain = new THREE.Mesh(geometry, material);
        mountain.position.z = layer.distance;
        mountain.position.y = layer.distance;
        mountain.userData = { baseZ: layer.distance, index };
        refs.scene.add(mountain);
        refs.mountains.push(mountain);
      });
    };



    const animate = () => {
      refs.animationId = requestAnimationFrame(animate);
      const now = Date.now() * 0.001;
      const time = now;

      // delta-time real: suavização idêntica em 60/120Hz e em telas lentas
      const dt = Math.min(Math.max(now - (refs.lastTime ?? now), 0), 0.1);
      refs.lastTime = now;

      refs.stars.forEach((starField: any) => {
        if (starField.material.uniforms) starField.material.uniforms.time.value = time;
      });
      if (refs.nebula?.material.uniforms) refs.nebula.material.uniforms.time.value = time * 0.12;

      // deriva única e lenta — todos os elementos respiram no mesmo ritmo
      const driftX = Math.sin(time * 0.06) * (refs.isMobile ? 1.2 : 2.4);
      const driftY = Math.sin(time * 0.045) * (refs.isMobile ? 0.6 : 1.2);

      if (refs.camera && refs.targetCameraX !== undefined) {
        const k = 1 - Math.pow(0.001, dt); // ~equivalente a lerp estável por segundo
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * k;
        smoothCameraPos.current.y += (refs.targetCameraY - smoothCameraPos.current.y) * k;
        smoothCameraPos.current.z += (refs.targetCameraZ - smoothCameraPos.current.z) * k;

        refs.camera.position.x = smoothCameraPos.current.x + driftX;
        refs.camera.position.y = smoothCameraPos.current.y + driftY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.rotation.z = Math.sin(time * 0.04) * 0.006; // respiro cinematográfico
        refs.camera.lookAt(driftX * 0.35, 10, -600);
      }

      // Estrelas e nebulosa acompanham a câmera: o céu nunca fica vazio
      const camZ = refs.camera ? refs.camera.position.z : 0;
      refs.stars.forEach((starField: any, i: number) => {
        starField.position.z = camZ - i * 40;
      });
      if (refs.nebula) refs.nebula.position.z = camZ - 2200;

      // Sol: sempre no horizonte à frente da câmera
      if (refs.sun) {
        refs.sun.position.z = camZ - 1000;
        refs.sun.position.x = driftX * 0.35;
        refs.sun.position.y = (refs.isMobile ? 105 : 110) + driftY * 0.25;
        refs.sunHalos?.forEach((h: any) => {
          if (h.material.uniforms) h.material.uniforms.time.value = time;
        });
      }


      // Estrelas cadentes: eventos raros e elegantes
      refs.shootingStars?.forEach((s: any) => {
        s.t += dt;
        if (s.t < s.delay) {
          s.mesh.visible = false;
          return;
        }
        const p = (s.t - s.delay) / s.duration;
        if (p >= 1) {
          s.t = 0;
          s.delay = 4 + Math.random() * 10;
          s.startX = -400 + Math.random() * 300;
          s.startY = 150 + Math.random() * 220;
          s.mesh.visible = false;
          return;
        }
        s.mesh.visible = true;
        s.mesh.position.set(
          s.startX + p * s.travel,
          s.startY - p * s.travel * 0.35,
          camZ - 700 - s.depth,
        );
        s.mesh.material.opacity = Math.sin(p * Math.PI) * 0.9;
      });

      // montanhas: apenas paralaxe coerente com a deriva da câmera (sem movimento próprio)
      refs.mountains.forEach((mountain: any, i: number) => {
        const parallax = 1 - i * 0.18;
        mountain.position.x = -driftX * parallax * 0.6;
        mountain.position.y = 50 - driftY * parallax * 0.3;
        if (mountain.material.uniforms) mountain.material.uniforms.time.value = time;
      });


      refs.composer?.render();
    };


    // FOV horizontal constante: em retrato o retrato não "corta" a cena
    const fovFor = (aspect: number) => {
      const baseH = 75; // fov vertical de referência em paisagem (16:9)
      if (aspect >= 1) return baseH;
      const hFov = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(baseH) / 2) * (16 / 9));
      return THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(hFov / 2) / aspect));
    };

    const initThree = () => {
      if (!canvasRef.current) return;

      refs.isMobile = window.matchMedia("(max-width: 767px)").matches;

      refs.scene = new THREE.Scene();
      refs.scene.fog = new THREE.FogExp2(0x070c18, 0.00016);

      const aspect = window.innerWidth / window.innerHeight;
      refs.camera = new THREE.PerspectiveCamera(fovFor(aspect), aspect, 0.1, 2000);
      refs.camera.position.z = 100;
      refs.camera.position.y = 20;

      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: !refs.isMobile,
        alpha: true,
        powerPreference: "high-performance",
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, refs.isMobile ? 1.5 : 2));
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      refs.renderer.toneMappingExposure = 0.9;

      refs.composer = new EffectComposer(refs.renderer);
      refs.composer.addPass(new RenderPass(refs.scene, refs.camera));
      refs.composer.addPass(
        new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          refs.isMobile ? 0.55 : 0.8,
          refs.isMobile ? 0.7 : 0.85,
          refs.isMobile ? 0.85 : 0.8,

        ),
      );

      createStarField();
      createNebula();
      createSun();
      createShootingStars();
      createMountains();
      createAtmosphere();


      refs.locations = refs.mountains.map((m: any) => m.position.z);

      animate();
      setIsReady(true);
    };

    initThree();

    const handleResize = () => {
      if (refs.camera && refs.renderer && refs.composer) {
        const a = window.innerWidth / window.innerHeight;
        refs.isMobile = window.matchMedia("(max-width: 767px)").matches;
        refs.camera.aspect = a;
        refs.camera.fov = fovFor(a);
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.composer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId);
      window.removeEventListener("resize", handleResize);
      refs.renderer?.dispose();
    };
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
        // mobile: um único movimento limpo, sem letras espalhadas
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
      // evita que letras fiquem invisíveis/deslocadas ao interromper a animação
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

      // fase visível (0,1,2) — trava na fase mais próxima, sem oscilar
      const stagePos = progress * totalSections; // 0..2
      setCurrentSection(Math.min(Math.round(stagePos), totalSections));

      const refs = threeRefs.current;

      // câmera segue o MESMO eixo das fases: 3 chaves, 2 trechos
      const seg = Math.min(Math.floor(stagePos), totalSections - 1);
      const f = easeInOut(Math.min(Math.max(stagePos - seg, 0), 1));

      const cameraPositions = [
        { x: 0, y: 30, z: 300 },
        { x: 0, y: 40, z: -50 },
        { x: 0, y: 50, z: -700 },
      ];
      const a = cameraPositions[seg]!;
      const b = cameraPositions[seg + 1] ?? a;

      refs.targetCameraX = a.x + (b.x - a.x) * f;
      refs.targetCameraY = a.y + (b.y - a.y) * f;
      refs.targetCameraZ = a.z + (b.z - a.z) * f;

      const eased = easeInOut(progress);
      refs.mountains.forEach((mountain: any, i: number) => {
        if (refs.locations) {
          mountain.position.z = refs.locations[i] - eased * 260 * (1 + i * 0.35);
        }
      });
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
      <span key={`${char}-${i}`} className="title-char inline-block text-gold-gradient [text-shadow:0_4px_40px_rgba(0,0,0,0.95)]">
        {char === " " ? "\u00a0" : char}
      </span>
    ));

  const subtitle = subtitles[currentSection] ?? subtitles[0]!;
  const sceneOpacity = 1 - outro;

  return (
    <div className="relative w-full bg-background">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 h-full w-full"
        style={{ opacity: sceneOpacity, transition: "opacity 0.2s linear" }}
      />

      {/* Vinheta para leitura */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse at 50% 48%, rgba(6,8,16,0.10) 0%, rgba(6,8,16,0.06) 40%, rgba(6,8,16,0.40) 78%, rgba(6,8,16,0.85) 100%)",

        }}
      />

      {/* Fusão inferior com a próxima seção */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[2] h-[45vh]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, color-mix(in oklab, var(--background) 55%, transparent) 45%, var(--background) 100%)",
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
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[46vh] w-[90vw] max-w-4xl -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
          style={{ background: "radial-gradient(ellipse, rgba(6,8,16,0.30) 0%, rgba(6,8,16,0.16) 60%, transparent 80%)" }}
        />
        <h1
          key={`title-${currentSection}`}
          ref={titleRef}
          className="relative max-w-[92vw] font-display text-[2.75rem] font-black leading-none tracking-tighter drop-shadow-[0_10px_45px_rgba(214,164,68,0.5)] sm:text-7xl md:text-8xl lg:text-9xl"
          style={{ visibility: "hidden" }}
        >
          {splitTitle(titles[currentSection] || "NASCIMENTO")}
        </h1>

        <div
          ref={subtitleRef}
          className="relative mt-5 max-w-[34rem] space-y-2 sm:mt-6"
          style={{ visibility: "hidden" }}
        >
          <p className="subtitle-line text-[0.95rem] font-medium leading-snug tracking-tight text-foreground drop-shadow-[0_4px_18px_rgba(0,0,0,0.8)] sm:text-xl">
            {subtitle.line1}
          </p>
          <p className="subtitle-line text-[0.85rem] font-normal leading-snug tracking-tight text-gold-soft drop-shadow-[0_4px_22px_rgba(214,164,68,0.35)] sm:text-lg">
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
        <span className="max-w-[80vw] text-center text-[0.7rem] font-semibold uppercase leading-relaxed tracking-[0.22em] text-foreground/85 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] sm:text-xs sm:tracking-[0.3em]">
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
