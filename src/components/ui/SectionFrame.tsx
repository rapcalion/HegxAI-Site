"use client";

import React, { useRef, useImperativeHandle } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export interface SectionFrameProps {
  children: React.ReactNode;
  id?: string;
  ariaLabelledby?: string;
  theme?: "cream" | "dark";
  paddingTop?: string | number;
  paddingBottom?: string | number;
  showTopLine?: boolean;
  showBottomLine?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const SectionFrame = React.forwardRef<HTMLElement, SectionFrameProps>(
  function SectionFrame(
    {
      children,
      id,
      ariaLabelledby,
      theme = "cream",
      paddingTop = "var(--section-py, 96px)",
      paddingBottom = "var(--section-py, 96px)",
      showTopLine = true,
      showBottomLine = true,
      className = "",
      style,
    },
    forwardedRef
  ) {
    const internalRef = useRef<HTMLElement>(null);
    useImperativeHandle(forwardedRef, () => internalRef.current as HTMLElement);

    const isDark = theme === "dark";
    const lineColor = isDark
      ? "var(--grid-line-dark, rgba(255, 255, 255, 0.12))"
      : "var(--grid-line, var(--hairline, #D9D4C9))";
    const squareColor = isDark
      ? "rgba(244, 239, 230, 0.70)" // cream at 70% on dark
      : "rgba(20, 20, 20, 0.85)"; // ink at 85% on cream

    useGSAP(
      () => {
        const prefersReduced =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;

        if (prefersReduced) return;

        const el = internalRef.current;
        if (!el) return;

        const hLines = el.querySelectorAll(".section-h-line");
        const vLines = el.querySelectorAll(".section-v-line");
        const squares = el.querySelectorAll(".section-end-square");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        });

        // 1. Horizontal lines draw outward from center to page edges (0.9s, power2.out)
        if (hLines.length > 0) {
          tl.fromTo(
            hLines,
            { scaleX: 0 },
            {
              scaleX: 1,
              transformOrigin: "center",
              duration: 0.9,
              ease: "power2.out",
            },
            0
          );
        }

        // 2. Vertical lines draw downward (scaleY from top, 1.1s, power2.out)
        if (vLines.length > 0) {
          tl.fromTo(
            vLines,
            { scaleY: 0 },
            {
              scaleY: 1,
              transformOrigin: "top",
              duration: 1.1,
              ease: "power2.out",
            },
            0
          );
        }

        // 3. End squares fade and scale in (0.25s) when the line reaches them
        if (squares.length > 0) {
          tl.fromTo(
            squares,
            { scale: 0, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.25,
              ease: "power2.out",
            },
            0.7
          );
        }
      },
      { scope: internalRef }
    );

    return (
      <section
        id={id}
        aria-labelledby={ariaLabelledby}
        ref={internalRef}
        className={`section-frame-outer ${className}`}
        style={{
          position: "relative",
          width: "100%",
          overflowX: "clip",
          paddingTop,
          paddingBottom,
          ...style,
        }}
      >
        {/* Continuous vertical frame lines (Full height through section, connecting adjacent sections with 0 gap) */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            maxWidth: "1320px",
            width: "100%",
            margin: "0 auto",
            pointerEvents: "none",
            zIndex: 0,
          }}
        >
          {/* Left vertical line */}
          <div
            className="section-v-line"
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: "1px",
              background: lineColor,
              pointerEvents: "none",
            }}
          />
          {/* Right vertical line */}
          <div
            className="section-v-line"
            style={{
              position: "absolute",
              right: 0,
              top: 0,
              bottom: 0,
              width: "1px",
              background: lineColor,
              pointerEvents: "none",
            }}
          />
        </div>

        {/* Top outgoing horizontal line with 8px end squares */}
        {showTopLine && (
          <div
            className="section-h-line-wrap"
            aria-hidden="true"
            style={{
              position: "absolute",
              top: paddingTop,
              left: 0,
              right: 0,
              width: "100%",
              height: "1px",
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <div
              className="section-h-line"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: "1px",
                background: lineColor,
              }}
            />
            {/* Left square marker at var(--col-pad) */}
            <span
              className="section-end-square"
              style={{
                position: "absolute",
                left: "var(--col-pad, 24px)",
                top: "-3.5px",
                width: "var(--grid-square-size, 8px)",
                height: "var(--grid-square-size, 8px)",
                background: squareColor,
              }}
            />
            {/* Right square marker at var(--col-pad) */}
            <span
              className="section-end-square"
              style={{
                position: "absolute",
                right: "var(--col-pad, 24px)",
                top: "-3.5px",
                width: "var(--grid-square-size, 8px)",
                height: "var(--grid-square-size, 8px)",
                background: squareColor,
              }}
            />
          </div>
        )}

        {/* Bottom outgoing horizontal line with 8px end squares */}
        {showBottomLine && (
          <div
            className="section-h-line-wrap"
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: paddingBottom,
              left: 0,
              right: 0,
              width: "100%",
              height: "1px",
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <div
              className="section-h-line"
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                height: "1px",
                background: lineColor,
              }}
            />
            {/* Left square marker at var(--col-pad) */}
            <span
              className="section-end-square"
              style={{
                position: "absolute",
                left: "var(--col-pad, 24px)",
                top: "-3.5px",
                width: "var(--grid-square-size, 8px)",
                height: "var(--grid-square-size, 8px)",
                background: squareColor,
              }}
            />
            {/* Right square marker at var(--col-pad) */}
            <span
              className="section-end-square"
              style={{
                position: "absolute",
                right: "var(--col-pad, 24px)",
                top: "-3.5px",
                width: "var(--grid-square-size, 8px)",
                height: "var(--grid-square-size, 8px)",
                background: squareColor,
              }}
            />
          </div>
        )}

        {/* Inner Content (z-index 1 so it stays strictly above background decorative lines) */}
        {children}
      </section>
    );
  }
);

export default SectionFrame;

