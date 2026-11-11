"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import HeroWorkflowCard from "./HeroWorkflowCard";
import GlyphField from "@/components/hero/GlyphField";
import { Button } from "@/components/ui/shared";
import { useBooking } from "@/components/ui/BookingProvider";
import Marquee from "@/components/ui/Marquee";
import StarShape from "@/components/ui/StarShape";
import { siteContent } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_ITEMS = [
  "WORKFLOWS",
  "AI AGENTS",
  "INTEGRATIONS",
  "PROCESS DESIGN",
  "WORKFLOWS",
  "AI AGENTS",
  "INTEGRATIONS",
  "PROCESS DESIGN",
];

export default function Hero() {
  const { openBooking, preloadBooking, bookingUrl } = useBooking();
  const sectionRef = useRef<HTMLElement>(null);
  const headlineLine1Ref = useRef<HTMLDivElement>(null);
  const headlineLine2Ref = useRef<HTMLDivElement>(null);
  const highlightBoxRef = useRef<HTMLSpanElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaWrapRef = useRef<HTMLDivElement>(null);

  // Dashed connector SVG refs
  const connectorPathRef = useRef<SVGPathElement>(null);
  const maskPathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (prefersReduced) {
        if (highlightBoxRef.current) highlightBoxRef.current.style.clipPath = "inset(0 0% 0 0)";
        if (maskPathRef.current) maskPathRef.current.style.strokeDashoffset = "0";
        return;
      }

      // 1. Text entrance & Highlight box clip-path reveal
      const isMobile = window.innerWidth < 768;
      const tl = gsap.timeline({ delay: isMobile ? 0 : 0.08 });

      tl.fromTo(
        headlineLine1Ref.current,
        { y: "110%", opacity: 0 },
        { y: "0%", opacity: 1, duration: isMobile ? 0.45 : 0.85, ease: "power4.out", clearProps: "transform" }
      )
        .fromTo(
          headlineLine2Ref.current,
          { y: "110%", opacity: 0 },
          { y: "0%", opacity: 1, duration: isMobile ? 0.45 : 0.85, ease: "power4.out", clearProps: "transform" },
          isMobile ? "-=0.35" : "-=0.65"
        )
        .to(
          highlightBoxRef.current,
          {
            clipPath: "inset(0 0% 0 0)",
            duration: isMobile ? 0.45 : 0.75,
            ease: "power3.out",
          },
          isMobile ? "-=0.25" : "-=0.35"
        )
        .fromTo(
          subRef.current,
          { opacity: 0, y: isMobile ? 8 : 16 },
          { opacity: 1, y: 0, duration: isMobile ? 0.35 : 0.55, ease: "power3.out" },
          isMobile ? "-=0.25" : "-=0.35"
        )
        .fromTo(
          ctaWrapRef.current,
          { opacity: 0, y: isMobile ? 10 : 18 },
          { opacity: 1, y: 0, duration: isMobile ? 0.4 : 0.65, ease: "power3.out" },
          isMobile ? "-=0.2" : "-=0.35"
        );

      // 2. Dashed connector line progressive reveal using mask
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
    },
    { scope: sectionRef }
  );

  // 6. Connector accent dot traveling along the path (gsap.ticker, paused when offscreen)
  useEffect(() => {
    const path = connectorPathRef.current;
    const dot = dotRef.current;
    const hero = sectionRef.current;
    if (!path || !dot || !hero) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    let totalLength = 0;
    try {
      totalLength = path.getTotalLength();
    } catch {
      return;
    }
    if (totalLength <= 0) return;

    let isVisible = false;
    let loopProgress = 0;
    const loopDuration = 12; // 12-second full traversal loop

    const tickHandler = (_time: number, deltaTime: number) => {
      if (!isVisible) return;
      loopProgress += deltaTime / 1000 / loopDuration;
      if (loopProgress > 1) loopProgress -= 1;

      const currentDistance = loopProgress * totalLength;
      const pt = path.getPointAtLength(currentDistance);
      dot.setAttribute("cx", pt.x.toString());
      dot.setAttribute("cy", pt.y.toString());
    };

    gsap.ticker.add(tickHandler);

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { rootMargin: "100px" }
    );
    observer.observe(hero);

    return () => {
      gsap.ticker.remove(tickHandler);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      ref={sectionRef}
      style={{
        display: "block",
        minHeight: "100svh",
        paddingTop: "calc(var(--header-h, 92px) + var(--hero-pt-gap, 72px))",
        paddingBottom: 0,
        background: "var(--bg, #F4EFE6)",
        position: "relative",
        overflow: "hidden",
        width: "100%",
      }}
    >
      {/* ─── STAGE 3: BACKGROUND STAR MOTIF (DECORATIVE) ─── */}
      {/* 1. Large rotating outline star centred behind headline + card */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "440px",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(90vw, 900px)",
          height: "min(90vw, 900px)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <StarShape
          size="100%"
          strokeWidth={1}
          variant="outline"
          color="var(--ink)"
          opacity={0.09}
          className="spin-hero-star"
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* 2. Smaller offset outline star (~340px) at 6% opacity to upper-right */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "80px",
          right: "5%",
          width: "min(340px, 35vw)",
          height: "min(340px, 35vw)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <StarShape
          size="100%"
          strokeWidth={1}
          variant="outline"
          color="var(--ink)"
          opacity={0.06}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* ─── FULL-WIDTH HERO WRAPPER (No column vertical lines) ─── */}
      <div
        style={{
          width: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "0 var(--col-pad, 24px)",
        }}
      >
        {/* ─── 3. DASHED CONNECTOR SVG (Wraps subtitle + CTA, does NOT cross headline/highlight box) ─── */}
        <div
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

            {/* Dashed connector path revealed through mask */}
            <path
              ref={connectorPathRef}
              d="M 40 10 L 280 10 C 360 10, 380 190, 460 190 L 740 190 C 820 190, 840 10, 920 10 L 1160 10"
              fill="none"
              stroke="rgba(20, 20, 20, 0.35)"
              strokeWidth="1"
              strokeDasharray="6 8"
              mask="url(#hero-connector-mask)"
            />

            {/* Traveling 6px accent dot */}
            <circle
              ref={dotRef}
              cx="40"
              cy="10"
              r="3"
              fill="var(--accent)"
            />
          </svg>
        </div>

        {/* ─── 1. HEADLINE (Single H1, 2 lines, Inter Tight 500, tight gradient box on AUTOMATED.) ─── */}
        <h1
          id="hero-title"
          className="hero-headline-h1"
          style={{
            fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
            fontSize: "clamp(40px, 12.5vw, 88px)",
            fontWeight: 500,
            letterSpacing: "-0.04em",
            lineHeight: 0.92,
            textTransform: "uppercase",
            color: "var(--ink)",
            margin: 0,
            position: "relative",
            zIndex: 10,
          }}
        >
          <span style={{ display: "block", overflow: "hidden", marginBottom: "4px" }}>
            <span
              ref={headlineLine1Ref}
              style={{ display: "block" }}
            >
              EVERY TASK.
            </span>
          </span>

          <span style={{ display: "block", overflow: "hidden" }}>
            <span
              ref={headlineLine2Ref}
              style={{ display: "block" }}
            >
              {/* Tight gradient box with 4 tiny 6px ink squares on corners */}
              <span
                ref={highlightBoxRef}
                style={{
                  background: "var(--accent-grad)",
                  color: "#ffffff",
                  padding: "0 0.12em",
                  display: "inline-block",
                  position: "relative",
                  whiteSpace: "nowrap",
                  clipPath: "inset(0 100% 0 0)",
                  willChange: "clip-path",
                  boxShadow: "0 4px 20px color-mix(in srgb, var(--accent) 35%, transparent)",
                }}
              >
                AUTOMATED.
                {/* 4 tiny 6px ink squares on box corners */}
                <span
                  style={{
                    position: "absolute",
                    top: "-3px",
                    left: "-3px",
                    width: "6px",
                    height: "6px",
                    background: "var(--ink)",
                  }}
                  aria-hidden="true"
                />
                <span
                  style={{
                    position: "absolute",
                    top: "-3px",
                    right: "-3px",
                    width: "6px",
                    height: "6px",
                    background: "var(--ink)",
                  }}
                  aria-hidden="true"
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: "-3px",
                    left: "-3px",
                    width: "6px",
                    height: "6px",
                    background: "var(--ink)",
                  }}
                  aria-hidden="true"
                />
                <span
                  style={{
                    position: "absolute",
                    bottom: "-3px",
                    right: "-3px",
                    width: "6px",
                    height: "6px",
                    background: "var(--ink)",
                  }}
                  aria-hidden="true"
                />
              </span>
            </span>
          </span>
        </h1>

        {/* ─── 2. THIN INK DASH & SUBTITLE (Gap: 24px -> dash -> 20px -> sub -> 36px -> CTA) ─── */}
        <p
          ref={subRef}
          style={{
            fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
            fontSize: "clamp(18px, 1.6vw, 22px)",
            color: "rgba(20, 20, 20, 0.72)",
            maxWidth: "560px",
            margin: "20px auto 32px",
            lineHeight: 1.5,
            opacity: 0,
          }}
        >
          {siteContent.hero.subtitle}
        </p>

        {/* ─── 3. CTA WITH CORNER BRACKETS ─── */}
        <div
          ref={ctaWrapRef}
          className="hero-cta-wrapper"
          style={{
            position: "relative",
            zIndex: 10,
            marginBottom: "64px",
            opacity: 0,
            overflow: "hidden",
            display: "inline-block",
            padding: "4px",
            width: "100%",
            maxWidth: "320px",
          }}
        >
          <Button
            href={bookingUrl || "#contact"}
            variant="primary"
            brackets={true}
            style={{ width: "100%", justifyContent: "center" }}
            onClick={(e) => {
              if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                e.preventDefault();
                openBooking();
              }
            }}
            onPointerEnter={preloadBooking}
            onFocus={preloadBooking}
          >
            Book a free audit
          </Button>
        </div>

        {/* ─── 5. TWO THIN HORIZONTAL LINES WITH MONO LABELS ─── */}
        <div style={{ width: "100%", position: "relative", zIndex: 3 }}>
          {/* Top Line 1 (1px ink at 25%) */}
          {/* Top Line 1 (1px grid-line) */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "1px",
              background: "var(--grid-line)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                top: "-3.5px",
                width: "var(--grid-square-size, 8px)",
                height: "var(--grid-square-size, 8px)",
                background: "var(--grid-square)",
                pointerEvents: "none",
              }}
            />
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                right: 0,
                top: "-3.5px",
                width: "var(--grid-square-size, 8px)",
                height: "var(--grid-square-size, 8px)",
                background: "var(--grid-square)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Strip between lines */}
          <div
            className="hero-strip-bar"
            style={{
              height: "44px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 16px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.08em",
                color: "rgba(20, 20, 20, 0.7)",
                textTransform: "uppercase",
              }}
            >
              LEAD ROUTING — REPORTING — OUTREACH
            </span>
            <span
              className="hero-strip-item-2"
              style={{
                fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.08em",
                color: "rgba(20, 20, 20, 0.7)",
                textTransform: "uppercase",
              }}
            >
              BUILT FOR OPERATORS
            </span>
          </div>

          {/* Bottom Line 2 (1px grid-line) */}
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "1px",
              background: "var(--grid-line)",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                left: 0,
                top: "-3.5px",
                width: "var(--grid-square-size, 8px)",
                height: "var(--grid-square-size, 8px)",
                background: "var(--grid-square)",
                pointerEvents: "none",
              }}
            />
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                right: 0,
                top: "-3.5px",
                width: "var(--grid-square-size, 8px)",
                height: "var(--grid-square-size, 8px)",
                background: "var(--grid-square)",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>

        {/* ─── 6. LIVE WORKFLOW DASHBOARD CARD ─── */}
        <HeroWorkflowCard />
      </div>

      {/* ─── 7. ANIMATED GLYPH FIELD BAND (ASCII/dot-matrix with floating chips & crosshair) ─── */}
      <GlyphField />

      {/* ─── 6. MARQUEE STRIP UNDER HERO (11px mono, 40% opacity) ─── */}
      <div
        style={{
          borderTop: "1px solid var(--line)",
          borderBottom: "1px solid var(--line)",
          padding: "16px 0",
          overflow: "hidden",
          background: "var(--bg)",
          position: "relative",
          zIndex: 4,
        }}
      >
        <Marquee speed={0.8} gap={36}>
          {MARQUEE_ITEMS.map((item, i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "36px",
                fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "var(--ink)",
                opacity: 0.7,
              }}
            >
              <span>{item}</span>
              <StarShape size={6} variant="fill" color="var(--ink)" opacity={0.6} />
            </span>
          ))}
        </Marquee>
      </div>

      <style>{`
        @media (max-width: 899px) {
          .hero-headline-h1 {
            font-size: clamp(40px, 12.5vw, 56px) !important;
          }
        }
        @media (max-width: 767px) {
          .hero-strip-bar {
            flex-direction: column !important;
            height: auto !important;
            padding: 8px 12px !important;
            gap: 4px !important;
            text-align: center !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </section>
  );
}
