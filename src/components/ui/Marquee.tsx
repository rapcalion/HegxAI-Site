"use client";
import React, { useRef, useEffect } from "react";

interface MarqueeProps {
  children: React.ReactNode;
  speed?: number;
  gap?: number;
  className?: string;
  style?: React.CSSProperties;
  fadeEdges?: boolean;
}

export default function Marquee({
  children,
  speed = 1,
  gap = 48,
  className = "",
  style,
  fadeEdges = false,
}: MarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track1 = track1Ref.current;
    const track2 = track2Ref.current;
    if (!container || !track1 || !track2) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let x = 0;
    let trackWidth = 0;
    let direction = -1; // -1 moves left, 1 moves right
    let rafId: number | null = null;
    let isTicking = false;

    const updateWidth = () => {
      trackWidth = track1.offsetWidth + gap;
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const effectiveSpeed = isMobile ? Math.min(speed, 0.5) : speed;

    const onTick = () => {
      if (trackWidth <= 0) {
        if (isTicking) rafId = requestAnimationFrame(onTick);
        return;
      }

      // Access Lenis velocity if available
      const lenis = (window as unknown as { __lenis?: { velocity?: number; direction?: number } }).__lenis;
      let boost = 0;

      if (lenis && typeof lenis.velocity === "number") {
        const vel = lenis.velocity;
        if (Math.abs(vel) > 0.05) {
          // Direction flips on scroll up (negative velocity in Lenis usually means scrolling up)
          if (vel < 0) {
            direction = 1;
          } else {
            direction = -1;
          }
          boost = Math.min(Math.abs(vel) * 0.12, 6);
        }
      }

      x += direction * (effectiveSpeed + boost);

      // Seamless infinite wrapping
      if (x <= -trackWidth) {
        x += trackWidth;
      } else if (x >= 0) {
        x -= trackWidth;
      }

      track1.style.transform = `translate3d(${x}px, 0, 0)`;
      track2.style.transform = `translate3d(${x}px, 0, 0)`;

      if (isTicking) {
        rafId = requestAnimationFrame(onTick);
      }
    };

    const startTicker = () => {
      if (!isTicking) {
        isTicking = true;
        updateWidth();
        rafId = requestAnimationFrame(onTick);
      }
    };

    const stopTicker = () => {
      if (isTicking) {
        isTicking = false;
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      }
    };

    // IntersectionObserver gating: run ticker ONLY while marquee is in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          startTicker();
        } else {
          stopTicker();
        }
      },
      { rootMargin: "60px" }
    );

    observer.observe(container);

    // Pause when document is hidden
    const handleVisibility = () => {
      if (document.hidden) {
        stopTicker();
      } else {
        startTicker();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stopTicker();
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [speed, gap]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        overflow: "hidden",
        position: "relative",
        width: "100%",
        display: "flex",
        userSelect: "none",
        ...(fadeEdges
          ? {
              maskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
              WebkitMaskImage: "linear-gradient(to right, transparent, black 12%, black 88%, transparent)",
            }
          : {}),
        ...style,
      }}
    >
      <div
        ref={track1Ref}
        style={{
          display: "flex",
          alignItems: "center",
          gap: `${gap}px`,
          whiteSpace: "nowrap",
          flexShrink: 0,
          willChange: "transform",
        }}
      >
        {children}
      </div>

      <div
        ref={track2Ref}
        aria-hidden="true"
        style={{
          display: "flex",
          alignItems: "center",
          gap: `${gap}px`,
          whiteSpace: "nowrap",
          flexShrink: 0,
          marginLeft: `${gap}px`,
          willChange: "transform",
        }}
      >
        {children}
      </div>
    </div>
  );
}
