"use client";
import { useEffect, useRef } from "react";

export default function HeroDesktopConnector() {
  const connectorPathRef = useRef<SVGPathElement>(null);
  const maskPathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 900;
    if (prefersReduced || isMobile) return;

    let rafId: number | null = null;
    let observer: IntersectionObserver | null = null;
    let cancelled = false;

    // Desktop: smooth entrance without hiding content from SSR
    import("gsap").then(({ gsap }) => {
      if (cancelled) return;

      const tl = gsap.timeline({ delay: 0.08 });
      tl.fromTo(
        ".hero-headline-line-1",
        { y: "110%", opacity: 0 },
        { y: "0%", opacity: 1, duration: 0.85, ease: "power4.out", clearProps: "transform" }
      )
        .fromTo(
          ".hero-headline-line-2",
          { y: "110%", opacity: 0 },
          { y: "0%", opacity: 1, duration: 0.85, ease: "power4.out", clearProps: "transform" },
          "-=0.65"
        )
        .fromTo(
          ".hero-subtitle",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" },
          "-=0.35"
        )
        .fromTo(
          ".hero-cta-wrapper",
          { opacity: 0, y: 18 },
          { opacity: 1, y: 0, duration: 0.65, ease: "power3.out" },
          "-=0.35"
        );

      if (maskPathRef.current) {
        gsap.fromTo(
          maskPathRef.current,
          { strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.8,
            delay: 0.4,
            ease: "power2.inOut",
          }
        );
      }

      // Dot traveling along path
      const path = connectorPathRef.current;
      const dot = dotRef.current;
      const container = containerRef.current;
      if (!path || !dot || !container) return;

      let totalLength = 0;
      try {
        totalLength = path.getTotalLength();
      } catch {
        return;
      }
      if (totalLength <= 0) return;

      let isVisible = false;
      let loopProgress = 0;
      const loopDuration = 12000; // 12s in ms
      let lastTime = performance.now();

      const tick = (now: number) => {
        const delta = now - lastTime;
        lastTime = now;

        if (isVisible && totalLength > 0) {
          loopProgress += delta / loopDuration;
          if (loopProgress > 1) loopProgress -= 1;

          const currentDistance = loopProgress * totalLength;
          const pt = path.getPointAtLength(currentDistance);
          dot.setAttribute("cx", pt.x.toString());
          dot.setAttribute("cy", pt.y.toString());
        }

        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);

      observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
        },
        { rootMargin: "100px" }
      );
      observer.observe(container);
    });

    return () => {
      cancelled = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        top: "188px",
        left: 0,
        width: "100%",
        height: "220px",
        pointerEvents: "none",
        zIndex: 2,
      }}
      className="hidden min-[900px]:block"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 1200 220"
        width="100%"
        height="100%"
        fill="none"
        preserveAspectRatio="none"
      >
        <defs>
          <mask id="hero-connector-mask" maskUnits="userSpaceOnUse">
            <path
              ref={maskPathRef}
              d="M 40 10 L 280 10 C 360 10, 380 190, 460 190 L 740 190 C 820 190, 840 10, 920 10 L 1160 10"
              fill="none"
              stroke="#ffffff"
              strokeWidth="8"
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1 1"
              strokeDashoffset={1}
            />
          </mask>
        </defs>

        <path
          ref={connectorPathRef}
          d="M 40 10 L 280 10 C 360 10, 380 190, 460 190 L 740 190 C 820 190, 840 10, 920 10 L 1160 10"
          fill="none"
          stroke="rgba(20, 20, 20, 0.35)"
          strokeWidth="1"
          strokeDasharray="6 8"
          mask="url(#hero-connector-mask)"
        />

        <circle
          ref={dotRef}
          cx="40"
          cy="10"
          r="3"
          fill="var(--accent)"
        />
      </svg>
    </div>
  );
}
