"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed galaxy background for GCC L1 Hero.
 * - Canvas 2D, no dependencies (design.md: canvas first, 3D only if needed)
 * - Idle slow spin; spin speed follows scroll velocity and eases back to idle
 * - Lower particle count on narrow screens; static render only for reduced motion
 *
 * Mount once in the layout. Page content needs `position: relative; z-index: 1`.
 */

// ---- tuning knobs -----------------------------------------------------------
const TILT = 1.15; // 0 = face-on, PI/2 = edge-on
const ROLL = -0.38; // in-plane lean, matches the Figma diagonal
const IDLE_SPEED = 0.018; // rad/sec at rest
const BOOST_SPEED = 0.95; // extra rad/sec at full scroll speed
const FULL_BOOST_VELOCITY = 2800; // px/sec that counts as "fast"
const PARTICLES_DESKTOP = 7000;
const PARTICLES_MOBILE = 2600;
const PARTICLES_STATIC = 3500;
const STARS = 320;
const STARS_MOBILE = 240;

const COLORS = ["#ffffff", "#cfe3ff", "#9ec5ff", "#ffe6a8", "#3fb950"];
const COLOR_WEIGHTS = [0.3, 0.3, 0.22, 0.16, 0.02]; // sparse GitHub-green dots

// ---- helpers ----------------------------------------------------------------
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (a, b) => a + Math.random() * (b - a);
const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

function pickColor() {
  let r = Math.random();
  for (let i = 0; i < COLORS.length; i++) {
    r -= COLOR_WEIGHTS[i];
    if (r <= 0) return i;
  }
  return 0;
}

function makeGalaxy(count) {
  const arms = 2;
  const pts = COLORS.map(() => []);
  for (let i = 0; i < count; i++) {
    const inBulge = Math.random() < 0.28;
    let r, a;
    if (inBulge) {
      r = Math.pow(Math.random(), 2.2) * 0.3;
      a = Math.random() * Math.PI * 2;
    } else {
      r = 0.1 + Math.pow(Math.random(), 1.5) * 0.9;
      const arm = i % arms;
      a =
        (arm / arms) * Math.PI * 2 +
        r * 5.2 +
        gauss() * (0.25 + r * 0.55);
    }
    r += gauss() * 0.015;
    const point = {
      r: Math.max(0, r),
      a,
      z: gauss() * 0.05 * (1 - Math.min(r, 1) * 0.6),
      size: Math.random() < 0.04 ? rand(1.6, 2.2) : rand(0.6, 1.3),
      alpha: rand(0.3, 1) * (inBulge ? 1 : 0.85),
      color: pickColor(),
    };
    pts[point.color].push(point);
  }
  return pts;
}

function makeStars(count) {
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    size: Math.random() < 0.06 ? rand(1.4, 2) : rand(0.5, 1.1),
    alpha: rand(0.15, 0.7),
    tw: Math.random() * Math.PI * 2,
    green: Math.random() < 0.05,
    blue: Math.random() < 0.2,
  }));
}

// ---- component --------------------------------------------------------------
export default function GalaxyBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const narrowQuery = window.matchMedia("(max-width: 767px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let narrow = narrowQuery.matches;
    let isStatic = motionQuery.matches;
    let galaxy = makeGalaxy(isStatic ? PARTICLES_STATIC : narrow ? PARTICLES_MOBILE : PARTICLES_DESKTOP);
    let stars = makeStars(narrow ? STARS_MOBILE : STARS);
    let w = 0,
      h = 0,
      dpr = 1,
      cx = 0,
      cy = 0,
      R = 0;
    let rot = 0.6;
    let speed = IDLE_SPEED;
    let boostSmooth = 0;
    let scrollDirection = 1;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let rafId = 0;

    function resize() {
      narrow = narrowQuery.matches;
      isStatic = motionQuery.matches;
      dpr = Math.min(window.devicePixelRatio || 1, narrow ? 1.5 : 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      canvas.style.opacity = narrow ? "0.82" : "1";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (w < 768) {
        cx = w * 0.66;
        cy = h * 0.53;
        R = Math.min(w * 0.68, h * 0.34);
      } else {
        cx = w * 0.7;
        cy = h * 0.52;
        R = Math.min(w * 0.3, h * 0.78);
      }
      const nextGalaxyCount = isStatic ? PARTICLES_STATIC : narrow ? PARTICLES_MOBILE : PARTICLES_DESKTOP;
      if (galaxy.reduce((sum, bucket) => sum + bucket.length, 0) !== nextGalaxyCount) {
        galaxy = makeGalaxy(nextGalaxyCount);
        stars = makeStars(narrow ? STARS_MOBILE : STARS);
      }
      if (isStatic) draw(0, galaxyOpacity());
    }

    function drawHaze() {
      // blue nebula + dark dust lane + warm core, in the galaxy's tilted plane
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ROLL);
      ctx.scale(1, Math.cos(TILT));

      const haze = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 1.15);
      haze.addColorStop(0, "rgba(120,160,235,0.30)");
      haze.addColorStop(0.35, "rgba(60,100,190,0.16)");
      haze.addColorStop(1, "rgba(1,4,9,0)");
      ctx.fillStyle = haze;
      ctx.beginPath();
      ctx.arc(0, 0, R * 1.15, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // dust lane: thin dark ellipse across the core
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ROLL + 0.04);
      ctx.scale(1, 0.1);
      const dust = ctx.createRadialGradient(0, 0, R * 0.05, 0, 0, R * 0.8);
      dust.addColorStop(0, "rgba(1,4,9,0.55)");
      dust.addColorStop(1, "rgba(1,4,9,0)");
      ctx.fillStyle = dust;
      ctx.beginPath();
      ctx.arc(0, 0, R * 0.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawCore() {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(ROLL);
      ctx.scale(1, Math.cos(TILT) * 1.4);
      const core = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.42);
      core.addColorStop(0, "rgba(255,246,222,0.95)");
      core.addColorStop(0.12, "rgba(255,222,150,0.55)");
      core.addColorStop(0.4, "rgba(255,190,110,0.14)");
      core.addColorStop(1, "rgba(255,190,110,0)");
      ctx.globalCompositeOperation = "lighter";
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(0, 0, R * 0.42, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawStars(t) {
      for (const s of stars) {
        const tw = isStatic ? 1 : 0.75 + 0.25 * Math.sin(t * 0.0012 + s.tw);
        ctx.globalAlpha = s.alpha * tw;
        ctx.fillStyle = s.green ? "#3fb950" : s.blue ? "#9ec5ff" : "#ffffff";
        ctx.fillRect(s.x * w, s.y * h, s.size, s.size);
      }
      ctx.globalAlpha = 1;
    }

    function drawParticles(opacity = 1) {
      const cosT = Math.cos(TILT);
      const sinR = Math.sin(ROLL);
      const cosR = Math.cos(ROLL);
      ctx.globalCompositeOperation = "lighter";
      // group by colour to keep fillStyle changes low
      for (let c = 0; c < COLORS.length; c++) {
        ctx.fillStyle = COLORS[c];
        for (const p of galaxy[c]) {
          const ang = p.a + rot * (1.2 - Math.min(p.r, 1) * 0.7); // inner spins faster
          const x = Math.cos(ang) * p.r;
          const y = Math.sin(ang) * p.r * cosT + p.z * Math.sin(TILT);
          const sx = cx + (x * cosR - y * sinR) * R;
          const sy = cy + (x * sinR + y * cosR) * R;
          ctx.globalAlpha = p.alpha * opacity;
          ctx.fillRect(sx, sy, p.size, p.size);
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    function galaxyOpacity() {
      const loop = window.__gccLoop; // set on the endless-scroll home page
      const progress = Math.min((loop ? loop.distanceFromHero() : window.scrollY) / Math.max(window.innerHeight, 1), 1);
      return 1 - progress * 0.65;
    }

    function draw(t, opacity = 1) {
      ctx.clearRect(0, 0, w, h);
      drawStars(t);
      ctx.save();
      ctx.globalAlpha = opacity;
      drawHaze();
      ctx.restore();
      drawParticles(opacity);
      ctx.save();
      ctx.globalAlpha = opacity;
      drawCore();
      ctx.restore();
    }

    function frame(now) {
      rafId = 0;
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      // scroll velocity (px/sec), smoothed
      const y = window.__gccLoop ? window.__gccLoop.unwrappedY() : window.scrollY;
      const deltaY = y - lastY;
      if (deltaY !== 0) scrollDirection = Math.sign(deltaY);
      const vel = Math.abs(deltaY) / Math.max(dt, 0.001);
      lastY = y;
      const boost = Math.min(vel / FULL_BOOST_VELOCITY, 1);

      // fast attack, slow release so it eases back to idle after scrolling stops
      const k = boost > boostSmooth ? 9 : 1.6;
      boostSmooth = lerp(boostSmooth, boost, 1 - Math.exp(-k * dt));

      const target = IDLE_SPEED + BOOST_SPEED * boostSmooth * scrollDirection;
      speed = lerp(speed, target, 1 - Math.exp(-6 * dt));
      rot += speed * dt;

      draw(now, galaxyOpacity());
      rafId = requestAnimationFrame(frame);
    }

    resize();
    window.addEventListener("resize", resize);
    const handlePreferenceChange = () => {
      resize();
      if (isStatic) {
        cancelAnimationFrame(rafId);
        rafId = 0;
        draw(0, galaxyOpacity());
      } else if (!rafId) {
        lastT = performance.now();
        rafId = requestAnimationFrame(frame);
      }
    };
    narrowQuery.addEventListener("change", resize);
    motionQuery.addEventListener("change", handlePreferenceChange);
    function redrawStatic() {
      if (isStatic) draw(0, galaxyOpacity());
    }
    if (isStatic) window.addEventListener("scroll", redrawStatic, { passive: true });
    if (!isStatic) rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      narrowQuery.removeEventListener("change", resize);
      motionQuery.removeEventListener("change", handlePreferenceChange);
      window.removeEventListener("scroll", redrawStatic);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="galaxy-canvas"
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
