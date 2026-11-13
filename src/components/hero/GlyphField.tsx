"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── GLYPH SET & CONFIG ──────────────────────────────────────────────────────
const GLYPHS = ["·", ":", "+", "%", "¦", "?", "@", "/"] as const;
const GLYPH_LOW = [0];
const GLYPH_MID = [1, 2, 4];
const GLYPH_HIGH = [3, 5, 6, 7];

// Fast pseudo-random permutation table for 2D smooth noise
const NOISE_PERM = new Uint8Array(512);
for (let i = 0; i < 256; i++) NOISE_PERM[i] = i;
for (let i = 255; i > 0; i--) {
  const j = Math.floor(Math.sin(i * 99.123 + 45.67) * 10000) >>> 0;
  const swapIdx = j % (i + 1);
  const t = NOISE_PERM[i];
  NOISE_PERM[i] = NOISE_PERM[swapIdx];
  NOISE_PERM[swapIdx] = t;
}
for (let i = 0; i < 256; i++) NOISE_PERM[256 + i] = NOISE_PERM[i];

const P_VALS = new Float32Array(512);
for (let i = 0; i < 512; i++) {
  const v = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  P_VALS[i] = v - Math.floor(v);
}

function fastNoise2D(x: number, y: number, t: number): number {
  const xi = Math.floor(x) & 255;
  const yi = Math.floor(y) & 255;
  const ti = Math.floor(t) & 255;
  const xf = x - Math.floor(x);
  const yf = y - Math.floor(y);
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);

  const idx00 = (xi + yi * 7 + ti * 13) & 255;
  const idx10 = (xi + 1 + yi * 7 + ti * 13) & 255;
  const idx01 = (xi + (yi + 1) * 7 + ti * 13) & 255;
  const idx11 = (xi + 1 + (yi + 1) * 7 + ti * 13) & 255;

  const a = P_VALS[idx00] + u * (P_VALS[idx10] - P_VALS[idx00]);
  const b = P_VALS[idx01] + u * (P_VALS[idx11] - P_VALS[idx01]);
  return a + v * (b - a);
}

/**
 * Draws the logo's four-point concave star path with smooth morphing toward a diamond.
 * viewBox reference: 0 0 100 100
 * Base: M50 0 C50 28 72 50 100 50 C72 50 50 72 50 100 C50 72 28 50 0 50 C28 50 50 28 50 0 Z
 * When morphFactor = 1, it interpolates into a flat diamond.
 */
function drawMorphedStar(ctx: CanvasRenderingContext2D, morph: number) {
  const m = Math.max(0, Math.min(1, morph));
  ctx.beginPath();
  ctx.moveTo(50, 0);

  // Quadrant 1: Top to Right (50, 0) -> (100, 50)
  ctx.bezierCurveTo(
    50 + 16.67 * m,
    28 - 11.33 * m,
    72 + 11.33 * m,
    50 - 16.67 * m,
    100,
    50
  );
  // Quadrant 2: Right to Bottom (100, 50) -> (50, 100)
  ctx.bezierCurveTo(
    72 + 11.33 * m,
    50 + 16.67 * m,
    50 + 16.67 * m,
    72 + 11.33 * m,
    50,
    100
  );
  // Quadrant 3: Bottom to Left (50, 100) -> (0, 50)
  ctx.bezierCurveTo(
    50 - 16.67 * m,
    72 + 11.33 * m,
    28 - 11.33 * m,
    50 + 16.67 * m,
    0,
    50
  );
  // Quadrant 4: Left to Top (0, 50) -> (50, 0)
  ctx.bezierCurveTo(
    28 - 11.33 * m,
    50 - 16.67 * m,
    50 - 16.67 * m,
    28 - 11.33 * m,
    50,
    0
  );
  ctx.closePath();
  ctx.fill();
}

export interface GlyphFieldProps {
  chipCount?: number;
  desktopHeight?: number;
  tabletHeight?: number;
  mobileHeight?: number;
  marginTop?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export default function GlyphField({
  chipCount = 4,
  desktopHeight = 380,
  tabletHeight = 300,
  mobileHeight = 220,
  marginTop = "-60px",
  className = "",
  style: propStyle,
}: GlyphFieldProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const crosshairRef = useRef<HTMLDivElement>(null);
  const chipsRef = useRef<(HTMLDivElement | null)[]>([]);

  const [hasCanvasError, setHasCanvasError] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const canvasWrap = canvasWrapRef.current;
    const canvas = canvasRef.current;
    const crosshair = crosshairRef.current;
    if (!container || !canvasWrap || !canvas) return;

    let isDestroyed = false;
    let isVisible = false;
    let isTabActive = !document.hidden;
    let rafId = 0;
    let lastRenderTime = 0;

    // Pointer state
    let mouseX = -9999;
    let mouseY = -9999;
    let isPointerInBand = false;
    let crossX = 0;
    let crossY = 0;
    let targetCrossX = 0;
    let targetCrossY = 0;
    let pointerDecay = 0;

    // Check media - skip completely on mobile, coarse pointer, or reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0;
    const isMobile = window.innerWidth < 768;

    if (prefersReducedMotion || isTouch || isMobile) {
      return;
    }

    // Cell size calculation: desktop 12px, tablet 12px, mobile 14px
    let baseCellSize = window.innerWidth < 768 ? 14 : 12;
    let currentCellSize = baseCellSize;
    let consecutiveSlowFrames = 0;

    // Dimensions
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 380;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let cols = Math.ceil(width / currentCellSize);
    let rows = Math.ceil(height / currentCellSize);
    let totalCells = cols * rows;

    // Buffers & Typed Arrays (reused, zero per-frame garbage)
    let glyphIndices = new Uint8Array(totalCells);
    let glyphTones = new Uint8Array(totalCells);
    let nextFlickerTime = new Float32Array(totalCells);

    // Offscreen Sprite Atlas: 8 glyphs x 4 tones
    const atlasCanvas = document.createElement("canvas");
    const atlasCtx = atlasCanvas.getContext("2d", { willReadFrequently: false });

    // Offscreen 1-pixel-per-cell Mask Canvas
    const maskCanvas = document.createElement("canvas");
    const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });

    function buildAtlas(cSize: number) {
      if (!atlasCtx) return;
      const tileW = Math.round(cSize * dpr);
      const tileH = Math.round(cSize * dpr);
      atlasCanvas.width = GLYPHS.length * tileW;
      atlasCanvas.height = 4 * tileH;
      atlasCtx.clearRect(0, 0, atlasCanvas.width, atlasCanvas.height);

      const fontSize = Math.max(8, Math.round(tileH * 0.72));
      atlasCtx.font = `600 ${fontSize}px "IBM Plex Mono", monospace`;
      atlasCtx.textAlign = "center";
      atlasCtx.textBaseline = "middle";

      const tones = [
        "rgba(20, 20, 20, 0.16)", // Tone 0: Muted ink 16%
        "rgba(20, 20, 20, 0.28)", // Tone 1: Normal ink 28%
        "rgba(81, 112, 255, 0.70)", // Tone 2: Accent (#5170FF at 70%)
        "rgba(179, 104, 223, 0.60)", // Tone 3: Accent-violet (#B368DF at 60%)
      ];

      for (let t = 0; t < tones.length; t++) {
        atlasCtx.fillStyle = tones[t];
        for (let g = 0; g < GLYPHS.length; g++) {
          const cx = g * tileW + tileW / 2;
          const cy = t * tileH + tileH / 2;
          atlasCtx.fillText(GLYPHS[g], cx, cy);
        }
      }
    }

    function initGrid() {
      width = container?.clientWidth || window.innerWidth;
      height = container?.clientHeight || (window.innerWidth < 768 ? mobileHeight : window.innerWidth < 1024 ? tabletHeight : desktopHeight);
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);

      if (!canvas) return;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      cols = Math.ceil(width / currentCellSize);
      rows = Math.ceil(height / currentCellSize);
      totalCells = cols * rows;

      maskCanvas.width = cols;
      maskCanvas.height = rows;

      glyphIndices = new Uint8Array(totalCells);
      glyphTones = new Uint8Array(totalCells);
      nextFlickerTime = new Float32Array(totalCells);

      // Stagger initial flicker
      const now = performance.now();
      for (let i = 0; i < totalCells; i++) {
        nextFlickerTime[i] = now + Math.random() * 800;
        glyphIndices[i] = 0;
        glyphTones[i] = 0;
      }

      buildAtlas(currentCellSize);

      targetCrossX = width / 2;
      targetCrossY = height / 2;
      crossX = targetCrossX;
      crossY = targetCrossY;
    }

    // Scroll parallax via GSAP / ScrollTrigger sync (0.85x speed)
    let parallaxTween: gsap.core.Tween | null = null;
    if (!prefersReducedMotion) {
      parallaxTween = gsap.fromTo(
        canvasWrap,
        { y: -16 },
        {
          y: 16,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }

    // Floating Chips Drift (GSAP sine paths, amplitude 10-18px, 5-9s, tiny +-3deg rotation)
    const chipTweens: gsap.core.Tween[] = [];
    if (!prefersReducedMotion) {
      chipsRef.current.forEach((chip, i) => {
        if (!chip) return;
        const amp = 10 + (i % 3) * 4;
        const dur = 5.5 + i * 1.1;
        const rot = i % 2 === 0 ? 2.5 : -2.5;

        const tween = gsap.to(chip, {
          y: amp,
          rotation: rot,
          duration: dur,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.6,
        });
        chipTweens.push(tween);
      });
    }

    // Pointer events on the container (passive)
    const handlePointerMove = (e: PointerEvent) => {
      if (isTouch || prefersReducedMotion) return;
      const rect = container.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      targetCrossX = mouseX;
      targetCrossY = mouseY;
      isPointerInBand = true;
      pointerDecay = 1.0;

      // Easing chips towards cursor (<140px proximity, max 10px)
      chipsRef.current.forEach((chip) => {
        if (!chip) return;
        const cr = chip.getBoundingClientRect();
        const cx = cr.left + cr.width / 2 - rect.left;
        const cy = cr.top + cr.height / 2 - rect.top;
        const dist = Math.hypot(mouseX - cx, mouseY - cy);
        if (dist < 140) {
          const factor = (1 - dist / 140) * 10;
          const nx = ((mouseX - cx) / dist) * factor;
          gsap.to(chip, { x: nx, duration: 0.4, ease: "power2.out", overwrite: "auto" });
        } else {
          gsap.to(chip, { x: 0, duration: 0.6, ease: "power2.out", overwrite: "auto" });
        }
      });
    };

    const handlePointerLeave = () => {
      isPointerInBand = false;
      targetCrossX = width / 2;
      targetCrossY = height / 2;
      mouseX = -9999;
      mouseY = -9999;

      chipsRef.current.forEach((chip) => {
        if (!chip) return;
        gsap.to(chip, { x: 0, duration: 0.6, ease: "power2.out", overwrite: "auto" });
      });
    };

    container.addEventListener("pointermove", handlePointerMove, { passive: true });
    container.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    // Render frame
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx || !maskCtx) {
      setHasCanvasError(true);
      return;
    }
    const activeCtx: CanvasRenderingContext2D = ctx;
    const activeMaskCtx: CanvasRenderingContext2D = maskCtx;
    const activeCanvas: HTMLCanvasElement = canvas;

    function render(timestamp: number) {
      if (isDestroyed) return;

      // If tab not active or element offscreen, pause rAF
      if (!isVisible || !isTabActive) {
        rafId = 0;
        return;
      }

      // Mobile: cap at 30fps (skip frames < 32ms)
      const now = timestamp || performance.now();
      const isMobile = window.innerWidth < 768;
      if (isMobile && now - lastRenderTime < 32) {
        rafId = requestAnimationFrame(render);
        return;
      }
      lastRenderTime = now;

      const t0 = performance.now();
      const timeSec = now * 0.001;

      // Crosshair lerp towards target (~0.18 factor)
      if (crosshair && !isTouch && !prefersReducedMotion) {
        crossX += (targetCrossX - crossX) * 0.18;
        crossY += (targetCrossY - crossY) * 0.18;
        crosshair.style.transform = `translate3d(${crossX - 18}px, ${crossY - 18}px, 0)`;
      }

      if (pointerDecay > 0) {
        pointerDecay = Math.max(0, pointerDecay - 0.025);
      }

      // ─── 1. DRAW SHAPE MASK INTO OFFSCREEN MASK CANVAS (1px = 1 cell) ───
      activeMaskCtx.clearRect(0, 0, cols, rows);
      activeMaskCtx.fillStyle = "#ffffff";

      // 3 Large stars parameters:
      // Centre star: ~70% band height, drift +-6% width (18-24s), rotate +-8deg, breathe 0.94-1.06
      const centerStarSize = rows * 0.7;
      const centerDriftX = Math.sin(timeSec * (Math.PI * 2 / 20)) * (cols * 0.06);
      const centerRot = Math.sin(timeSec * (Math.PI * 2 / 18)) * (8 * Math.PI / 180);
      const centerBreathe = 1.0 + Math.sin(timeSec * (Math.PI * 2 / 12)) * 0.06;

      // Morph cycle: every ~8s, morph toward diamond and back over ~2s
      const morphCycle = (timeSec % 8) / 2.0;
      const morphM = morphCycle < 1.0 ? Math.sin(morphCycle * Math.PI) : 0;

      // Draw Centre Star
      const cScale = (centerStarSize * centerBreathe) / 100;
      activeMaskCtx.save();
      activeMaskCtx.translate(cols * 0.5 + centerDriftX, rows * 0.5);
      activeMaskCtx.rotate(centerRot);
      activeMaskCtx.scale(cScale, cScale);
      activeMaskCtx.translate(-50, -50);
      drawMorphedStar(activeMaskCtx, morphM);
      activeMaskCtx.restore();

      // Left Flanking Star: ~50% band height, drift +-5% width, rotate +-8deg, breathe 0.94-1.06
      const leftStarSize = rows * 0.5;
      const leftDriftX = Math.sin(timeSec * (Math.PI * 2 / 24) + 1.2) * (cols * 0.05);
      const leftRot = Math.sin(timeSec * (Math.PI * 2 / 22) + 0.8) * (8 * Math.PI / 180);
      const leftBreathe = 1.0 + Math.sin(timeSec * (Math.PI * 2 / 15) + 2.0) * 0.06;
      const lScale = (leftStarSize * leftBreathe) / 100;

      activeMaskCtx.save();
      activeMaskCtx.translate(cols * 0.18 + leftDriftX, rows * 0.52);
      activeMaskCtx.rotate(leftRot);
      activeMaskCtx.scale(lScale, lScale);
      activeMaskCtx.translate(-50, -50);
      drawMorphedStar(activeMaskCtx, 0);
      activeMaskCtx.restore();

      // Right Flanking Star: ~50% band height, drift +-5% width, rotate +-8deg, breathe 0.94-1.06
      const rightStarSize = rows * 0.5;
      const rightDriftX = Math.sin(timeSec * (Math.PI * 2 / 19) + 3.5) * (cols * 0.05);
      const rightRot = Math.sin(timeSec * (Math.PI * 2 / 21) + 2.4) * (8 * Math.PI / 180);
      const rightBreathe = 1.0 + Math.sin(timeSec * (Math.PI * 2 / 14) + 4.1) * 0.06;
      const rScale = (rightStarSize * rightBreathe) / 100;

      activeMaskCtx.save();
      activeMaskCtx.translate(cols * 0.82 + rightDriftX, rows * 0.48);
      activeMaskCtx.rotate(rightRot);
      activeMaskCtx.scale(rScale, rScale);
      activeMaskCtx.translate(-50, -50);
      drawMorphedStar(activeMaskCtx, 0);
      activeMaskCtx.restore();

      // Read mask alpha buffer
      const maskImageData = activeMaskCtx.getImageData(0, 0, cols, rows);
      const maskPixels = maskImageData.data;

      // ─── 2. CLEAR MAIN CANVAS & RENDER ACTIVE CELLS ───
      activeCtx.clearRect(0, 0, activeCanvas.width, activeCanvas.height);

      const tileW = Math.round(currentCellSize * dpr);
      const tileH = Math.round(currentCellSize * dpr);

      // Touch Scan Ripple (every ~6s, soft vertical band moving across field over ~2s)
      const touchScanCycle = (timeSec % 6) / 2.0;
      const isTouchScanActive = isTouch && touchScanCycle < 1.0;
      const touchScanX = isTouchScanActive
        ? -80 + touchScanCycle * (width + 160)
        : -9999;

      let cellIdx = 0;
      for (let r = 0; r < rows; r++) {
        const rowOffset = r * cols;
        for (let c = 0; c < cols; c++) {
          cellIdx = rowOffset + c;
          const maskAlpha = maskPixels[cellIdx * 4 + 3];

          // Skip cells outside the star shapes early
          if (maskAlpha < 14) continue;
          const maskCoverage = maskAlpha / 255;

          // Smooth value-noise calculation
          const noise = fastNoise2D(c * 0.08, r * 0.08, timeSec * 0.25);
          let intensity = maskCoverage * (0.55 + 0.45 * noise);

          // Pointer interaction / ripple
          const cellPixelX = c * currentCellSize + currentCellSize * 0.5;
          const cellPixelY = r * currentCellSize + currentCellSize * 0.5;

          let isNearPointer = false;
          if (isPointerInBand) {
            const dx = cellPixelX - mouseX;
            const dy = cellPixelY - mouseY;
            const dist = Math.hypot(dx, dy);
            if (dist < 110) {
              const boost = 0.35 * (1 - dist / 110);
              const ripple =
                Math.sin((dist / 110) * Math.PI * 3 - timeSec * 8) *
                (pointerDecay * 0.18);
              intensity = Math.min(1.0, intensity + boost + Math.max(0, ripple));
              isNearPointer = true;
            }
          }

          // Touch scan ripple boost
          if (isTouchScanActive) {
            const scanDist = Math.abs(cellPixelX - touchScanX);
            if (scanDist < 80) {
              const scanBoost = 0.32 * (1 - scanDist / 80);
              intensity = Math.min(1.0, intensity + scanBoost);
              if (scanDist < 40) isNearPointer = true;
            }
          }

          // If intensity < 0.08: draw nothing
          if (intensity < 0.08) continue;

          // Staggered character flicker (400-900ms)
          if (now >= nextFlickerTime[cellIdx]) {
            nextFlickerTime[cellIdx] = now + 400 + Math.random() * 500;

            if (intensity < 0.35) {
              glyphIndices[cellIdx] = GLYPH_LOW[0];
            } else if (intensity < 0.65) {
              glyphIndices[cellIdx] =
                GLYPH_MID[Math.floor(Math.random() * GLYPH_MID.length)];
            } else {
              glyphIndices[cellIdx] =
                GLYPH_HIGH[Math.floor(Math.random() * GLYPH_HIGH.length)];
            }

            // Tone selection:
            // - Near pointer/ripple: Accent (#5170FF)
            // - Brightest 4% (>0.82): Accent Tone 2
            // - Very few (<1%) (>0.94): Accent-violet Tone 3
            // - Normal (>0.35): Tone 1 (ink 28%)
            // - Muted: Tone 0 (ink 16%)
            if (isNearPointer) {
              glyphTones[cellIdx] = 2; // Accent
            } else if (intensity > 0.94 && (cellIdx * 17) % 100 < 22) {
              glyphTones[cellIdx] = 3; // Accent violet (~1%)
            } else if (intensity > 0.82) {
              glyphTones[cellIdx] = 2; // Accent (~4%)
            } else if (intensity > 0.35) {
              glyphTones[cellIdx] = 1; // Normal ink
            } else {
              glyphTones[cellIdx] = 0; // Muted ink
            }
          }

          // Draw glyph from sprite atlas
          const gIdx = glyphIndices[cellIdx];
          const tIdx = glyphTones[cellIdx];
          const destX = c * currentCellSize * dpr;
          const destY = r * currentCellSize * dpr;

          activeCtx.drawImage(
            atlasCanvas,
            gIdx * tileW,
            tIdx * tileH,
            tileW,
            tileH,
            destX,
            destY,
            tileW,
            tileH
          );
        }
      }

      // Adaptive degradation: if frame time > 14ms for 30 consecutive frames, step cell size up by 2px
      const frameDuration = performance.now() - t0;
      if (frameDuration > 14) {
        consecutiveSlowFrames++;
        if (consecutiveSlowFrames >= 30) {
          currentCellSize = Math.min(20, currentCellSize + 2);
          initGrid();
          consecutiveSlowFrames = 0;
        }
      } else {
        consecutiveSlowFrames = 0;
      }

      // Under reduced motion: stop after 1 frame
      if (prefersReducedMotion) {
        return;
      }

      rafId = requestAnimationFrame(render);
    }

    // IntersectionObserver: animate only while in view (rootMargin 100px)
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && isTabActive && !rafId && !prefersReducedMotion) {
          rafId = requestAnimationFrame(render);
          chipTweens.forEach((t) => t.resume());
        } else if (!isVisible && rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
          chipTweens.forEach((t) => t.pause());
        }
      },
      { rootMargin: "100px" }
    );
    observer.observe(container);

    const handleVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isTabActive && isVisible && !rafId && !prefersReducedMotion) {
        rafId = requestAnimationFrame(render);
        chipTweens.forEach((t) => t.resume());
      } else if (!isTabActive && rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
        chipTweens.forEach((t) => t.pause());
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const handleResize = () => {
      baseCellSize = window.innerWidth < 768 ? 14 : 12;
      currentCellSize = baseCellSize;
      initGrid();
      if (prefersReducedMotion) {
        render(performance.now());
      }
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Idle start: create and start canvas only after window load via requestIdleCallback
    const startCanvas = () => {
      if (isDestroyed) return;
      initGrid();
      if (prefersReducedMotion) {
        render(performance.now());
      } else if (isVisible && isTabActive) {
        rafId = requestAnimationFrame(render);
      }
    };

    const scheduleStart = () => {
      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        (window as Window & { requestIdleCallback: (cb: () => void, opts: { timeout: number }) => number }).requestIdleCallback(
          startCanvas,
          { timeout: 500 }
        );
      } else {
        setTimeout(startCanvas, 200);
      }
    };

    if (document.readyState === "complete") {
      scheduleStart();
    } else {
      window.addEventListener("load", scheduleStart, { once: true });
    }

    return () => {
      isDestroyed = true;
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerleave", handlePointerLeave);
      chipTweens.forEach((t) => t.kill());
      if (parallaxTween) parallaxTween.kill();
    };
  }, [desktopHeight, mobileHeight, tabletHeight]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`glyph-field-band ${className}`}
      style={{
        position: "relative",
        width: "100%",
        marginTop: typeof marginTop === "number" ? `${marginTop}px` : marginTop,
        overflow: "hidden",
        userSelect: "none",
        zIndex: 2,
        background: "var(--bg, #F4EFE6)",
        ...propStyle,
      }}
    >
      <style>{`
        .glyph-field-band {
          height: ${desktopHeight}px;
          min-height: ${desktopHeight}px;
          contain: layout paint;
        }
        @media (max-width: 1023px) {
          .glyph-field-band {
            height: ${tabletHeight}px;
            min-height: ${tabletHeight}px;
          }
        }
        @media (max-width: 767px) {
          .glyph-field-band {
            height: ${mobileHeight}px;
            min-height: ${mobileHeight}px;
          }
          .glyph-chip-1 {
            left: 8% !important;
            top: 56% !important;
          }
          .glyph-chip-3 {
            left: auto !important;
            right: 8% !important;
            top: 56% !important;
          }
        }
        @media (pointer: coarse) {
          .glyph-crosshair {
            display: none !important;
          }
        }
      `}</style>

      {/* Top 1px --hairline border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "var(--hairline, #D9D4C9)",
          zIndex: 10,
        }}
      />

      {/* Bottom 1px --hairline border */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: "var(--hairline, #D9D4C9)",
          zIndex: 10,
        }}
      />

      {/* Technical Corner Brackets (no square handles) */}
      <span
        style={{
          position: "absolute",
          top: 0,
          left: "var(--col-pad, 24px)",
          width: "12px",
          height: "12px",
          borderTop: "1.5px solid var(--ink, #141414)",
          borderLeft: "1.5px solid var(--ink, #141414)",
          opacity: 0.45,
          pointerEvents: "none",
          zIndex: 11,
        }}
      />
      <span
        style={{
          position: "absolute",
          top: 0,
          right: "var(--col-pad, 24px)",
          width: "12px",
          height: "12px",
          borderTop: "1.5px solid var(--ink, #141414)",
          borderRight: "1.5px solid var(--ink, #141414)",
          opacity: 0.45,
          pointerEvents: "none",
          zIndex: 11,
        }}
      />
      <span
        style={{
          position: "absolute",
          bottom: 0,
          left: "var(--col-pad, 24px)",
          width: "12px",
          height: "12px",
          borderBottom: "1.5px solid var(--ink, #141414)",
          borderLeft: "1.5px solid var(--ink, #141414)",
          opacity: 0.45,
          pointerEvents: "none",
          zIndex: 11,
        }}
      />
      <span
        style={{
          position: "absolute",
          bottom: 0,
          right: "var(--col-pad, 24px)",
          width: "12px",
          height: "12px",
          borderBottom: "1.5px solid var(--ink, #141414)",
          borderRight: "1.5px solid var(--ink, #141414)",
          opacity: 0.45,
          pointerEvents: "none",
          zIndex: 11,
        }}
      />

      {/* Parallax Canvas Wrapper */}
      <div
        ref={canvasWrapRef}
        style={{
          position: "absolute",
          inset: "-20px 0",
          width: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Fallback Static Halftone Background if canvas fails */}
      {hasCanvasError && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            zIndex: 1,
            maskImage: "linear-gradient(to top, rgba(0,0,0,1) 40%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 40%, transparent 100%)",
          }}
        >
          <svg width="100%" height="100%" viewBox="0 0 1440 240" preserveAspectRatio="none">
            <defs>
              <pattern id="glyph-fallback-pattern" width="9" height="9" patternUnits="userSpaceOnUse">
                <circle cx="4.5" cy="4.5" r="1.5" fill="#141414" opacity="0.25" />
              </pattern>
            </defs>
            <path d="M -40 240 L -40 70 C 80 50, 240 40, 360 90 C 470 130, 500 180, 520 240 Z" fill="url(#glyph-fallback-pattern)" />
            <path d="M 920 240 C 940 180, 970 130, 1080 90 C 1200 40, 1360 50, 1480 70 L 1480 240 Z" fill="url(#glyph-fallback-pattern)" />
          </svg>
        </div>
      )}

      {/* ─── FLOATING ICON CHIPS (4) ─── */}
      {/* Chip 1: Workflow / Branch (Visible on Mobile & Desktop) */}
      <div
        ref={(el) => { chipsRef.current[0] = el; }}
        className="glyph-chip glyph-chip-1"
        style={{
          position: "absolute",
          left: "20%",
          top: "24%",
          width: "52px",
          height: "52px",
          borderRadius: "var(--r-card, 12px)",
          background: "var(--ink-2, #0E1020)",
          border: "1px solid var(--hairline-dark, rgba(255,255,255,0.12))",
          boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--accent-on-dark, #7D93FF)",
          pointerEvents: "none",
          zIndex: 4,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="6" r="3" />
          <circle cx="6" cy="12" r="3" />
          <circle cx="18" cy="18" r="3" />
          <path d="M9 12h3a3 3 0 0 0 3-3V6m-3 6a3 3 0 0 1 3 3v3" />
        </svg>
      </div>

      {/* Chip 2: Mail (Hidden on Mobile, hidden if chipCount < 4) */}
      {chipCount >= 4 && (
        <div
          ref={(el) => { chipsRef.current[1] = el; }}
          className="glyph-chip hidden md:flex"
          style={{
            position: "absolute",
            left: "38%",
            top: "60%",
            width: "52px",
            height: "52px",
            borderRadius: "var(--r-card, 12px)",
            background: "var(--ink-2, #0E1020)",
            border: "1px solid var(--hairline-dark, rgba(255,255,255,0.12))",
            boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-on-dark, #7D93FF)",
            pointerEvents: "none",
            zIndex: 4,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </div>
      )}

      {/* Chip 3: Spreadsheet (Visible on Mobile & Desktop) */}
      <div
        ref={(el) => { chipsRef.current[2] = el; }}
        className="glyph-chip glyph-chip-3"
        style={{
          position: "absolute",
          left: "62%",
          top: "28%",
          width: "52px",
          height: "52px",
          borderRadius: "var(--r-card, 12px)",
          background: "var(--ink-2, #0E1020)",
          border: "1px solid var(--hairline-dark, rgba(255,255,255,0.12))",
          boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--accent-on-dark, #7D93FF)",
          pointerEvents: "none",
          zIndex: 4,
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect width="18" height="18" x="3" y="3" rx="2" />
          <path d="M3 9h18M3 15h18M9 3v18M15 3v18" />
        </svg>
      </div>

      {/* Chip 4: Bolt (Hidden on Mobile, hidden if chipCount < 4) */}
      {chipCount >= 4 && (
        <div
          ref={(el) => { chipsRef.current[3] = el; }}
          className="glyph-chip hidden md:flex"
          style={{
            position: "absolute",
            left: "80%",
            top: "64%",
            width: "52px",
            height: "52px",
            borderRadius: "var(--r-card, 12px)",
            background: "var(--ink-2, #0E1020)",
            border: "1px solid var(--hairline-dark, rgba(255,255,255,0.12))",
            boxShadow: "0 8px 24px rgba(0,0,0,0.22)",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--accent-on-dark, #7D93FF)",
            pointerEvents: "none",
            zIndex: 4,
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
      )}

      {/* ─── CURSOR-FOLLOWING CROSSHAIR (Desktop pointer: fine only) ─── */}
      <div
        ref={crosshairRef}
        className="glyph-crosshair"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "36px",
          height: "36px",
          pointerEvents: "none",
          zIndex: 5,
          willChange: "transform",
        }}
      >
        {/* Horizontal line (36px x 1px) */}
        <div
          style={{
            position: "absolute",
            top: "17.5px",
            left: 0,
            width: "36px",
            height: "1px",
            background: "rgba(20, 20, 20, 0.7)",
          }}
        />
        {/* Vertical line (1px x 36px) */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "17.5px",
            width: "1px",
            height: "36px",
            background: "rgba(20, 20, 20, 0.7)",
          }}
        />
        {/* Centre dot (4px) */}
        <div
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            width: "4px",
            height: "4px",
            borderRadius: "50%",
            background: "rgba(20, 20, 20, 0.7)",
          }}
        />
      </div>
    </div>
  );
}

