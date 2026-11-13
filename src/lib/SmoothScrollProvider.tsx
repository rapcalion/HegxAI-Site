"use client";
import { useEffect, useRef } from "react";

export default function SmoothScrollProvider({
  children,
}: {
  children?: React.ReactNode;
}) {
  const lenisRef = useRef<unknown>(null);

  useEffect(() => {
    // Respect reduced motion and mobile devices
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile =
      window.innerWidth < 768 ||
      window.matchMedia("(pointer: coarse)").matches;

    if (prefersReduced || isMobile) return;

    let lenisInstance: { raf: (time: number) => void; on: (event: "scroll", cb: () => void) => void; destroy: () => void } | null = null;
    let tickerRaf: ((time: number) => void) | null = null;
    let cancelled = false;

    const init = async () => {
      const [{ default: Lenis }, { gsap }, { ScrollTrigger }] = await Promise.all([
        import("lenis"),
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);

      if (cancelled) return;

      gsap.registerPlugin(ScrollTrigger);

      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: "vertical",
        smoothWheel: true,
        syncTouch: false,
      });

      lenisInstance = lenis;
      lenisRef.current = lenis;
      (window as unknown as { __lenis?: unknown }).__lenis = lenis;

      lenis.on("scroll", ScrollTrigger.update);

      tickerRaf = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickerRaf);
      gsap.ticker.lagSmoothing(0);

      // Line reveal for [data-reveal-line]
      const lines = document.querySelectorAll<HTMLElement>("[data-reveal-line]");
      if (lines.length > 0) {
        lines.forEach((line) => {
          gsap.fromTo(
            line,
            { y: "110%", opacity: 0 },
            {
              y: "0%",
              opacity: 1,
              duration: 1,
              ease: "power3.out",
              stagger: 0.08,
              scrollTrigger: {
                trigger: line,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      }

      if (typeof document !== "undefined" && document.fonts) {
        document.fonts.ready.then(() => {
          ScrollTrigger.refresh();
        });
      }
    };

    const idleId =
      "requestIdleCallback" in window
        ? (window as Window).requestIdleCallback(() => { void init(); })
        : setTimeout(() => { void init(); }, 1);

    return () => {
      cancelled = true;
      if ("cancelIdleCallback" in window && typeof idleId === "number") {
        (window as Window).cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId as unknown as NodeJS.Timeout);
      }
      if (tickerRaf) {
        import("gsap").then(({ gsap }) => {
          if (tickerRaf) gsap.ticker.remove(tickerRaf);
        });
      }
      if (lenisInstance) {
        delete (window as unknown as { __lenis?: unknown }).__lenis;
        lenisInstance.destroy();
      }
    };
  }, []);

  return <>{children}</>;
}
