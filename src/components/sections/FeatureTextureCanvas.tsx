"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

// ─── GLYPH SET & CONFIG ──────────────────────────────────────────────────────
const GLYPHS = ["·", ":", "+", "%", "¦", "?", "@", "/"] as const;

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
    84 - 11.33 * m,
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

// Target star center offsets per feature index
// Star 1 is top-left, Star 2 is bottom-right (directly behind the cards' overlap area)
const STAR_OFFSETS = [
  // Feature 0: Customer Support Agent
  {
    s1: { cx: 0.36, cy: 0.36, size: 0.60, rot: 0.0 },
    s2: { cx: 0.60, cy: 0.60, size: 0.58, rot: 0.05 },
  },
  // Feature 1: Sales Pipeline Workflow
  {
    s1: { cx: 0.42, cy: 0.30, size: 0.64, rot: -0.06 },
    s2: { cx: 0.58, cy: 0.62, size: 0.56, rot: 0.08 },
  },
  // Feature 2: Data Sync Integration
  {
    s1: { cx: 0.32, cy: 0.40, size: 0.58, rot: 0.04 },
    s2: { cx: 0.62, cy: 0.58, size: 0.57, rot: -0.05 },
  },
];

interface FeatureTextureCanvasProps {
  activeIndex: number;
  cellSize?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function FeatureTextureCanvas({
  activeIndex,
  cellSize,
  className = "",
  style,
}: FeatureTextureCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animated star coordinate state (smoothed across feature transitions via GSAP)
  const animStateRef = useRef({
    cx1: STAR_OFFSETS[0].s1.cx,
    cy1: STAR_OFFSETS[0].s1.cy,
    size1: STAR_OFFSETS[0].s1.size,
    rot1: STAR_OFFSETS[0].s1.rot,
    cx2: STAR_OFFSETS[0].s2.cx,
    cy2: STAR_OFFSETS[0].s2.cy,
    size2: STAR_OFFSETS[0].s2.size,
    rot2: STAR_OFFSETS[0].s2.rot,
  });

  // When activeIndex changes, smoothly ease the star offsets to new targets (0.8s)
  useEffect(() => {
    const target = STAR_OFFSETS[activeIndex] || STAR_OFFSETS[0];
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      animStateRef.current = {
        cx1: target.s1.cx,
        cy1: target.s1.cy,
        size1: target.s1.size,
        rot1: target.s1.rot,
        cx2: target.s2.cx,
        cy2: target.s2.cy,
        size2: target.s2.size,
        rot2: target.s2.rot,
      };
      return;
    }

    gsap.to(animStateRef.current, {
      cx1: target.s1.cx,
      cy1: target.s1.cy,
      size1: target.s1.size,
      rot1: target.s1.rot,
      cx2: target.s2.cx,
      cy2: target.s2.cy,
      size2: target.s2.size,
      rot2: target.s2.rot,
      duration: 0.8,
      ease: "power2.out",
      overwrite: "auto",
    });
  }, [activeIndex]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let isDestroyed = false;
    let isVisible = false;
    let isTabActive = !document.hidden;
    let rafId = 0;
    let lastRenderTime = 0;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Cell size: default 13 on desktop, 15 on mobile
    const baseCellSize = cellSize ?? (window.innerWidth < 768 ? 15 : 13);
    const currentCellSize = baseCellSize;

    let width = container.clientWidth || 600;
    let height = container.clientHeight || 480;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let cols = Math.ceil(width / currentCellSize);
    let rows = Math.ceil(height / currentCellSize);
    let totalCells = cols * rows;

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

      // Tone "ink" 12-24%
      const tones = [
        "rgba(20, 20, 20, 0.12)", // Tone 0: 12% ink
        "rgba(20, 20, 20, 0.18)", // Tone 1: 18% ink
        "rgba(20, 20, 20, 0.24)", // Tone 2: 24% ink
        "rgba(81, 112, 255, 0.35)", // Tone 3: subtle accent highlight
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
      width = container?.clientWidth || 600;
      height = container?.clientHeight || 480;
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

      const now = performance.now();
      for (let i = 0; i < totalCells; i++) {
        nextFlickerTime[i] = now + Math.random() * 800;
        glyphIndices[i] = 0;
        glyphTones[i] = 0;
      }

      buildAtlas(currentCellSize);
    }

    function render(now: number) {
      if (isDestroyed || !canvas) return;
      const ctx = canvas.getContext("2d", { alpha: true });
      if (!ctx || !maskCtx || !atlasCtx) return;

      const timeSec = now * 0.001;

      // 1. Clear offscreen mask
      maskCtx.clearRect(0, 0, cols, rows);
      maskCtx.fillStyle = "#ffffff";

      const cur = animStateRef.current;

      // Subtle continuous sine drift
      const driftX1 = Math.sin(timeSec * 0.3) * (cols * 0.03);
      const driftY1 = Math.cos(timeSec * 0.25) * (rows * 0.02);
      const rotDrift1 = Math.sin(timeSec * 0.22) * 0.04;

      const driftX2 = Math.sin(timeSec * 0.24 + 1.8) * (cols * 0.03);
      const driftY2 = Math.cos(timeSec * 0.28 + 1.2) * (rows * 0.02);
      const rotDrift2 = Math.sin(timeSec * 0.2 + 1.5) * 0.04;

      // Draw Star 1 (Top-Left / Center)
      const star1Size = rows * cur.size1;
      const s1Scale = star1Size / 100;
      maskCtx.save();
      maskCtx.translate(cols * cur.cx1 + driftX1, rows * cur.cy1 + driftY1);
      maskCtx.rotate(cur.rot1 + rotDrift1);
      maskCtx.scale(s1Scale, s1Scale);
      maskCtx.translate(-50, -50);
      drawMorphedStar(maskCtx, 0);
      maskCtx.restore();

      // Draw Star 2 (Bottom-Right / Overlap Area)
      const star2Size = rows * cur.size2;
      const s2Scale = star2Size / 100;
      maskCtx.save();
      maskCtx.translate(cols * cur.cx2 + driftX2, rows * cur.cy2 + driftY2);
      maskCtx.rotate(cur.rot2 + rotDrift2);
      maskCtx.scale(s2Scale, s2Scale);
      maskCtx.translate(-50, -50);
      drawMorphedStar(maskCtx, 0);
      maskCtx.restore();

      // 2. Read mask alpha
      const maskImageData = maskCtx.getImageData(0, 0, cols, rows);
      const maskPixels = maskImageData.data;

      // 3. Clear output canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const tileW = Math.round(currentCellSize * dpr);
      const tileH = Math.round(currentCellSize * dpr);

      // 4. Draw glyphs based on mask
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cellIdx = r * cols + c;
          const maskAlpha = maskPixels[cellIdx * 4 + 3];

          if (maskAlpha < 14) continue;
          const maskCoverage = maskAlpha / 255;

          const noise = fastNoise2D(c * 0.09, r * 0.09, timeSec * 0.2);
          const combined = noise * 0.45 + maskCoverage * 0.55;

          if (now >= nextFlickerTime[cellIdx]) {
            nextFlickerTime[cellIdx] = now + 400 + Math.random() * 800;

            if (combined > 0.8) {
              glyphIndices[cellIdx] = 3 + Math.floor(Math.random() * 5); // %, ?, @, /
              glyphTones[cellIdx] = Math.random() < 0.25 ? 3 : 2; // subtle accent or 24% ink
            } else if (combined > 0.45) {
              glyphIndices[cellIdx] = 1 + Math.floor(Math.random() * 3); // :, +, ¦
              glyphTones[cellIdx] = 1; // 18% ink
            } else {
              glyphIndices[cellIdx] = 0; // ·
              glyphTones[cellIdx] = 0; // 12% ink
            }
          }

          const gIdx = glyphIndices[cellIdx];
          const toneIdx = glyphTones[cellIdx];

          const sx = gIdx * tileW;
          const sy = toneIdx * tileH;
          const dx = c * tileW;
          const dy = r * tileH;

          ctx.drawImage(atlasCanvas, sx, sy, tileW, tileH, dx, dy, tileW, tileH);
        }
      }
    }

    function animate(time: number) {
      if (isDestroyed) return;
      if (time - lastRenderTime >= 32) {
        lastRenderTime = time;
        render(time);
      }
      if (isVisible && isTabActive && !prefersReducedMotion) {
        rafId = requestAnimationFrame(animate);
      }
    }

    // IO-gating: only render when container is intersecting viewport
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        isVisible = entry ? entry.isIntersecting : false;
        if (isVisible && isTabActive && !prefersReducedMotion) {
          if (!rafId) {
            rafId = requestAnimationFrame(animate);
          }
        } else {
          if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = 0;
          }
        }
      },
      { threshold: 0.05 }
    );
    io.observe(container);

    const onVisibilityChange = () => {
      isTabActive = !document.hidden;
      if (isVisible && isTabActive && !prefersReducedMotion) {
        if (!rafId) {
          rafId = requestAnimationFrame(animate);
        }
      } else {
        if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = 0;
        }
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const onResize = () => {
      initGrid();
      if (prefersReducedMotion) {
        render(performance.now());
      }
    };
    window.addEventListener("resize", onResize, { passive: true });

    initGrid();
    if (prefersReducedMotion) {
      render(performance.now());
    } else if (isVisible && isTabActive) {
      rafId = requestAnimationFrame(animate);
    }

    return () => {
      isDestroyed = true;
      if (rafId) cancelAnimationFrame(rafId);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("resize", onResize);
    };
  }, [cellSize]);

  return (
    <div
      ref={containerRef}
      className={`feature-texture-container ${className}`}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        ...style,
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
  );
}
