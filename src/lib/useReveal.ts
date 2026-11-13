"use client";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function useReveal(scopeRef?: React.RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const isMobile = window.innerWidth < 768;
      if (prefersReduced || isMobile) return;

      const schedule = (cb: () => void) => {
        if ("requestIdleCallback" in window) {
          (window as Window).requestIdleCallback(cb);
        } else {
          setTimeout(cb, 1);
        }
      };

      schedule(() => {
        const container = scopeRef?.current || (typeof document !== "undefined" ? document.body : null);
        if (!container) return;

        const lines = container.querySelectorAll<HTMLElement>("[data-reveal-line]");
        if (!lines.length) return;

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
                start: () => window.innerWidth < 768 ? "top 95%" : "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });

        if (typeof document !== "undefined" && document.fonts) {
          document.fonts.ready.then(() => {
            ScrollTrigger.refresh();
          });
        }
      });
    },
    { scope: scopeRef || undefined }
  );
}
