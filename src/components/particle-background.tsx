"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
  r: number;
  g: number;
  b: number;
  phase: number;
  phaseSpeed: number;
}

function isLightTheme(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.theme === "light";
}

const DARK_PALETTE = [
  [180, 150, 255],
  [110, 175, 255],
  [80, 230, 180],
  [255, 130, 200],
  [255, 210, 80],
] as const;

const LIGHT_PALETTE = [
  [140, 80, 255],
  [60, 120, 240],
  [20, 170, 120],
  [230, 60, 140],
  [220, 140, 20],
] as const;

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // mouse in viewport coords (canvas is fixed)
  const mouse = useRef({ x: -9999, y: -9999 });
  const particles = useRef<Particle[]>([]);
  const raf = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Canvas covers the full viewport (fixed), use viewport size only
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const rndPick = (palette: readonly (readonly number[])[]) => {
      const c = palette[Math.floor(Math.random() * palette.length)];
      return { r: c[0], g: c[1], b: c[2] };
    };

    const PARTICLE_COUNT = 180;

    const spawn = () => {
      const light = isLightTheme();
      const palette = light ? LIGHT_PALETTE : DARK_PALETTE;
      particles.current = Array.from({ length: PARTICLE_COUNT }, () => {
        const { r, g, b } = rndPick(palette);
        // Mix tiny sparkles and medium glows for visual variety
        const isBig = Math.random() < 0.2;
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: isBig ? Math.random() * 3 + 3 : Math.random() * 1.5 + 0.8,
          opacity: isBig ? Math.random() * 0.4 + 0.3 : Math.random() * 0.55 + 0.25,
          r, g, b,
          phase: Math.random() * Math.PI * 2,
          phaseSpeed: (Math.random() * 0.6 + 0.3) * 0.012,
        };
      });
    };
    spawn();
    window.addEventListener("resize", spawn);

    // Canvas is position:fixed — coordinates are always viewport-relative
    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    const onLeave = () => { mouse.current = { x: -9999, y: -9999 }; };
    document.addEventListener("mouseleave", onLeave);

    const CONNECT_DIST = 110;
    const MOUSE_RADIUS = 160;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const light = isLightTheme();
      const ps = particles.current;
      const mx = mouse.current.x;
      const my = mouse.current.y;

      // ── Update physics ──
      for (const p of ps) {
        // Twinkle breathing
        p.phase += p.phaseSpeed;
        const breathe = 0.75 + 0.25 * Math.sin(p.phase);

        // Mouse repulsion
        const dx = mx - p.x;
        const dy = my - p.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < MOUSE_RADIUS * MOUSE_RADIUS) {
          const d = Math.sqrt(d2);
          const force = ((MOUSE_RADIUS - d) / MOUSE_RADIUS) * 0.32;
          p.vx -= (dx / d) * force;
          p.vy -= (dy / d) * force;
        }
        p.vx *= 0.974;
        p.vy *= 0.974;
        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        (p as Particle & { _breathe?: number })._breathe = breathe;
      }

      // ── Connection lines ──
      for (let i = 0; i < ps.length; i++) {
        for (let j = i + 1; j < ps.length; j++) {
          const dx = ps[i].x - ps[j].x;
          const dy = ps[i].y - ps[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const t = 1 - dist / CONNECT_DIST;
            const alpha = t * t * (light ? 0.14 : 0.2);
            ctx.beginPath();
            ctx.moveTo(ps[i].x, ps[i].y);
            ctx.lineTo(ps[j].x, ps[j].y);
            ctx.strokeStyle = `rgba(${ps[i].r},${ps[i].g},${ps[i].b},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }

      // ── Draw cute round glowing particles ──
      for (const p of ps) {
        const breathe = (p as Particle & { _breathe?: number })._breathe ?? 1;
        const r = p.radius * breathe;
        const op = p.opacity * breathe;

        // Use shadowBlur for native soft glow — no star artifacts
        ctx.save();
        ctx.shadowColor = `rgba(${p.r},${p.g},${p.b},0.85)`;
        ctx.shadowBlur = r * (light ? 10 : 14);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.r},${p.g},${p.b},${op})`;
        ctx.fill();
        ctx.restore();
      }

      // ── Cursor soft aura ──
      if (mx > 0 && mx < canvas.width + 100) {
        const aura = ctx.createRadialGradient(mx, my, 0, mx, my, MOUSE_RADIUS * 0.75);
        aura.addColorStop(0,   `rgba(180,150,255,${light ? 0.08 : 0.12})`);
        aura.addColorStop(0.5, `rgba(110,175,255,${light ? 0.04 : 0.07})`);
        aura.addColorStop(1,   `rgba(80,230,180,0)`);
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(mx, my, MOUSE_RADIUS * 0.75, 0, Math.PI * 2);
        ctx.fill();
      }

      raf.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("resize", spawn);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
}
