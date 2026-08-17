// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

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

    const createStarField = () => {
      const starCount = 3500;
      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let j = 0; j < starCount; j++) {
          const radius = 200 + Math.random() * 800;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[j * 3 + 2] = radius * Math.cos(phi);

          const color = new THREE.Color();
          const choice = Math.random();
          if (choice < 0.6) color.setHSL(0.12, 0.9, 0.75);
          else if (choice < 0.85) color.setHSL(0.15, 0.8, 0.85);
          else color.setHSL(0.08, 0.4, 0.9);

          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;
          sizes[j] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: { time: { value: 0 }, depth: { value: i } },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            void main() {
              vColor = color;
              vec3 pos = position;
              float angle = time * 0.05 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });

        const stars = new THREE.Points(geometry, material);
        refs.scene.add(stars);
        refs.stars.push(stars);
      }
    };

    const createNebula = () => {
      const geometry = new THREE.PlaneGeometry(8000, 4000, 100, 100);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x0a0a0a) },
          color2: { value: new THREE.Color(0xd6a444) },
          opacity: { value: 0.35 },
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          void main() {
            vUv = uv;
            vec3 pos = position;
            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
            pos.z += elevation;
            vElevation = elevation;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          void main() {
            float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
            alpha *= 1.0 + vElevation * 0.01;
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false,
      });

      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.z = -1050;
      refs.scene.add(nebula);
      refs.nebula = nebula;
    };

    const createMountains = () => {
      const layers = [
        { distance: -50, height: 60, color: 0x0a0a0a, opacity: 1 },
        { distance: -100, height: 80, color: 0x121212, opacity: 0.85 },
        { distance: -150, height: 100, color: 0x1c1a17, opacity: 0.65 },
        { distance: -200, height: 120, color: 0x2b2723, opacity: 0.45 },
      ];

      layers.forEach((layer, index) => {
        const points: THREE.Vector2[] = [];
        const segments = 50;
        for (let i = 0; i <= segments; i++) {
          const x = (i / segments - 0.5) * 1000;
          const y =
            Math.sin(i * 0.1) * layer.height +
            Math.sin(i * 0.05) * layer.height * 0.5 +
            Math.random() * layer.height * 0.2 -
            100;
          points.push(new THREE.Vector2(x, y));
        }
        points.push(new THREE.Vector2(5000, -300));
        points.push(new THREE.Vector2(-5000, -300));

        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
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

    const createAtmosphere = () => {
      const geometry = new THREE.SphereGeometry(600, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 } },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          uniform float time;
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(0.96, 0.65, 0.1) * intensity;
            float pulse = sin(time * 2.0) * 0.1 + 0.9;
            atmosphere *= pulse;
            gl_FragColor = vec4(atmosphere, intensity * 0.25);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
      });
      refs.scene.add(new THREE.Mesh(geometry, material));
    };

    const animate = () => {
      refs.animationId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      refs.stars.forEach((starField: any) => {
        if (starField.material.uniforms) starField.material.uniforms.time.value = time;
      });
      if (refs.nebula?.material.uniforms) refs.nebula.material.uniforms.time.value = time * 0.5;

      if (refs.camera && refs.targetCameraX !== undefined) {
        const s = 0.05;
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * s;
        smoothCameraPos.current.y += (refs.targetCameraY - smoothCameraPos.current.y) * s;
        smoothCameraPos.current.z += (refs.targetCameraZ - smoothCameraPos.current.z) * s;

        refs.camera.position.x = smoothCameraPos.current.x + Math.sin(time * 0.1) * 2;
        refs.camera.position.y = smoothCameraPos.current.y + Math.cos(time * 0.15) * 1;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, 10, -600);
      }

      refs.mountains.forEach((mountain: any, i: number) => {
        const parallaxFactor = 1 + i * 0.5;
        mountain.position.x = Math.sin(time * 0.1) * 2 * parallaxFactor;
        mountain.position.y = 50 + Math.cos(time * 0.15) * 1 * parallaxFactor;
      });

      refs.composer?.render();
    };

    const initThree = () => {
      if (!canvasRef.current) return;

      refs.scene = new THREE.Scene();
      refs.scene.fog = new THREE.FogExp2(0x0a0a0a, 0.00025);

      refs.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000,
      );
      refs.camera.position.z = 100;
      refs.camera.position.y = 20;

      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      refs.renderer.toneMappingExposure = 0.6;

      refs.composer = new EffectComposer(refs.renderer);
      refs.composer.addPass(new RenderPass(refs.scene, refs.camera));
      refs.composer.addPass(
        new UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          0.85,
          0.4,
          0.85,
        ),
      );

      createStarField();
      createNebula();
      createMountains();
      createAtmosphere();

      refs.locations = refs.mountains.map((m: any) => m.position.z);

      animate();
      setIsReady(true);
    };

    initThree();

    const handleResize = () => {
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
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

    const tl = gsap.timeline();

    if (menuRef.current) {
      tl.from(menuRef.current, { x: -100, opacity: 0, duration: 1, ease: "power3.out" });
    }
    if (titleRef.current) {
      tl.from(
        titleRef.current.querySelectorAll(".title-char"),
        { y: 160, opacity: 0, duration: 1.2, stagger: 0.05, ease: "power4.out" },
        "-=0.5",
      );
    }
    if (subtitleRef.current) {
      tl.from(
        subtitleRef.current.querySelectorAll(".subtitle-line"),
        { y: 40, opacity: 0, duration: 0.9, stagger: 0.15, ease: "power3.out" },
        "-=0.8",
      );
    }
    if (scrollProgressRef.current) {
      tl.from(scrollProgressRef.current, { opacity: 0, y: 40, duration: 1 }, "-=0.5");
    }

    return () => {
      tl.kill();
    };
  }, [isReady, currentSection]);

  useEffect(() => {
    const handleScroll = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return;
      const progress = Math.min(window.scrollY / maxScroll, 1);

      setScrollProgress(progress);
      const newSection = Math.min(Math.floor(progress * (totalSections + 1)), totalSections);
      setCurrentSection(newSection);

      const refs = threeRefs.current;
      const sectionProgress = (progress * totalSections) % 1;

      const cameraPositions = [
        { x: 0, y: 30, z: 300 },
        { x: 0, y: 40, z: -50 },
        { x: 0, y: 50, z: -700 },
      ];
      const currentPos = cameraPositions[newSection] || cameraPositions[0];
      const nextPos = cameraPositions[newSection + 1] || currentPos;

      refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * sectionProgress;
      refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * sectionProgress;
      refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * sectionProgress;

      refs.mountains.forEach((mountain: any, i: number) => {
        const speed = 1 + i * 0.9;
        const targetZ = mountain.userData.baseZ + window.scrollY * speed * 0.5;
        if (refs.nebula) refs.nebula.position.z = targetZ + progress * speed * 0.01 - 100;
        if (progress > 0.7) mountain.position.z = 600000;
        else if (refs.locations) mountain.position.z = refs.locations[i];
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const splitTitle = (text: string) =>
    text.split("").map((char, i) => (
      <span key={`${char}-${i}`} className="title-char inline-block">
        {char === " " ? "\u00a0" : char}
      </span>
    ));

  const subtitle = subtitles[currentSection] ?? subtitles[0]!;

  return (
    <div className="relative w-full bg-background">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 h-full w-full" />

      {/* Vinheta para leitura */}
      <div
        className="pointer-events-none fixed inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, transparent 0%, transparent 35%, rgba(10,10,10,0.55) 78%, rgba(10,10,10,0.95) 100%)",
        }}
      />

      {/* Menu lateral */}
      <div
        ref={menuRef}
        className="fixed left-4 top-1/2 z-20 hidden -translate-y-1/2 md:block"
        style={{ visibility: "hidden" }}
      >
        <p
          className="text-xs font-bold uppercase tracking-[0.5em] text-gold/80"
          style={{ writingMode: "vertical-rl" }}
        >
          Astrowake
        </p>
      </div>

      {/* Conteúdo principal */}
      <div className="pointer-events-none fixed inset-0 z-10 flex flex-col items-center justify-center px-6 text-center">
        <h1
          ref={titleRef}
          className="font-display text-5xl font-black tracking-tighter text-gold-gradient drop-shadow-[0_10px_45px_rgba(214,164,68,0.5)] sm:text-7xl md:text-8xl lg:text-9xl"
          style={{ visibility: "hidden" }}
        >
          {splitTitle(titles[currentSection] || "NASCIMENTO")}
        </h1>

        <div ref={subtitleRef} className="mt-6 space-y-1" style={{ visibility: "hidden" }}>
          <p className="subtitle-line text-base font-medium tracking-tight text-foreground drop-shadow-[0_4px_18px_rgba(0,0,0,0.8)] sm:text-xl">
            {subtitle.line1}
          </p>
          <p className="subtitle-line text-sm font-normal tracking-tight text-gold-soft drop-shadow-[0_4px_22px_rgba(214,164,68,0.35)] sm:text-lg">
            {subtitle.line2}
          </p>
        </div>
      </div>

      {/* Indicador de scroll */}
      <div
        ref={scrollProgressRef}
        className="pointer-events-none fixed bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2"
        style={{ visibility: "hidden" }}
      >
        <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-foreground/80">
          Role para entrar
        </span>
        <div className="h-1 w-40 overflow-hidden rounded-full border border-border bg-secondary/70">
          <div
            className="h-full bg-gradient-to-r from-gold to-gold-deep"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
        <span className="text-[10px] font-bold tracking-widest text-gold/80">
          {String(currentSection + 1).padStart(2, "0")} / 03
        </span>
      </div>

      {/* Alturas de scroll */}
      <div className="relative z-[5]">
        {Array.from({ length: totalSections + 1 }).map((_, i) => (
          <section key={i} className="h-screen w-full" />
        ))}
      </div>
    </div>
  );
}
