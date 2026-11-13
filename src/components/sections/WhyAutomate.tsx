"use client";
import React, { useRef, useEffect } from "react";
import { SectionBar, SectionColumn, StickyTag } from "@/components/ui/shared";
import SectionFrame from "@/components/ui/SectionFrame";
import { useBooking } from "@/components/ui/BookingProvider";
import AsciiHalftoneCanvas from "@/components/ui/AsciiHalftoneCanvas";
import StarShape from "@/components/ui/StarShape";
import { siteContent, type WhyAutomateStat } from "@/content/site";

function getAriaLabel(value: string, suffix?: string): string {
  if (!suffix) return value;
  const s = suffix.trim();
  if (s === "%") return `${value} percent`;
  return `${value} ${s}`;
}

const STATS: WhyAutomateStat[] = siteContent.whyAutomate?.stats || [];
const STAT1 = STATS[0];
const STAIRCASE_STATS = STATS.slice(1);

export default function WhyAutomate() {
  const { openBooking, preloadBooking, bookingUrl } = useBooking();
  const sectionRef = useRef<HTMLElement>(null);
  const bigNumberRef = useRef<HTMLSpanElement>(null);
  const stairNumberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const whyData = siteContent.whyAutomate;
  const stats = STATS;
  const stat1 = STAT1;
  const staircaseStats = STAIRCASE_STATS;

  // Dynamic footnote sources calculation (unique sources with proper URL and forecast flags)
  const seenSources = new Set<string>();
  const footnoteSources: Array<{ name: string; url: string; hasForecast?: boolean }> = [];
  let forecastNote = "";

  stats.forEach((s) => {
    const isForecast = s.label.toLowerCase().includes("prediction") || !!s.note;
    if (s.note && !forecastNote) {
      forecastNote = s.note;
    } else if (isForecast && !forecastNote) {
      forecastNote = "Gartner figure is a forecast.";
    }

    if (!seenSources.has(s.source)) {
      seenSources.add(s.source);
      footnoteSources.push({
        name: s.source,
        url: s.sourceUrl,
        hasForecast: isForecast,
      });
    }
  });

  useEffect(() => {
    if (!STATS || STATS.length === 0) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    if (prefersReduced || isMobile) return;

    const el = sectionRef.current;
    if (!el) return;

    let ctx: { revert: () => void } | undefined;
    let observer: IntersectionObserver | null = null;
    let cancelled = false;

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer?.disconnect();
          observer = null;

          Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
            ([{ gsap }, { ScrollTrigger }]) => {
              if (cancelled) return;
              gsap.registerPlugin(ScrollTrigger);

              ctx = gsap.context(() => {
                gsap.set(".why-stair-col-inner", { y: 40, opacity: 0 });
                gsap.set(".why-stair-line", { scaleY: 0, transformOrigin: "top" });
                if (bigNumberRef.current) bigNumberRef.current.textContent = "0";
                stairNumberRefs.current.forEach((item) => {
                  if (item) item.textContent = "0";
                });

                ScrollTrigger.create({
                  trigger: sectionRef.current,
                  start: "top 70%",
                  once: true,
                  onEnter: () => {
                    // 1. Big Stat (#1) count-up: counts up first
                    const s1Target = parseInt(STAT1.value, 10);
                    if (!isNaN(s1Target)) {
                      const s1Obj = { val: 0 };
                      gsap.to(s1Obj, {
                        val: s1Target,
                        duration: 1.2,
                        ease: "power3.out",
                        onUpdate: () => {
                          if (bigNumberRef.current) {
                            bigNumberRef.current.textContent = Math.round(s1Obj.val).toString();
                          }
                        },
                      });
                    }

                    // 2. Staircase columns rise from +40px with opacity 0 -> 1, staggered 0.12s
                    gsap.fromTo(
                      ".why-stair-col-inner",
                      { y: 40, opacity: 0 },
                      {
                        y: 0,
                        opacity: 1,
                        duration: 0.9,
                        ease: "power3.out",
                        stagger: 0.12,
                        delay: 0.1,
                      }
                    );

                    // 3. Vertical lines draw downward (scaleY 0 -> 1, origin top, 0.8s)
                    gsap.fromTo(
                      ".why-stair-line",
                      { scaleY: 0 },
                      {
                        scaleY: 1,
                        transformOrigin: "top",
                        duration: 0.8,
                        ease: "power3.out",
                        stagger: 0.12,
                        delay: 0.1,
                      }
                    );

                    // 4. Staircase numbers count up (staggered with column entrance)
                    STAIRCASE_STATS.forEach((st, idx) => {
                      const targetVal = parseInt(st.value, 10);
                      if (!isNaN(targetVal)) {
                        const numObj = { val: 0 };
                        const itemEl = stairNumberRefs.current[idx];
                        gsap.to(numObj, {
                          val: targetVal,
                          duration: 1.2,
                          ease: "power3.out",
                          delay: 0.15 + idx * 0.12,
                          onUpdate: () => {
                            if (itemEl) {
                              itemEl.textContent = Math.round(numObj.val).toString();
                            }
                          },
                        });
                      }
                    });
                  },
                });
              }, sectionRef);
            }
          );
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);

    return () => {
      cancelled = true;
      observer?.disconnect();
      ctx?.revert();
    };
  }, []);

  if (!stats || stats.length === 0) {
    return null;
  }

  return (
    <SectionFrame
      id="why"
      ariaLabelledby="why-title"
      ref={sectionRef}
      theme="dark"
      paddingTop="48px"
      paddingBottom="var(--section-py, 96px)"
      style={{
        background: "var(--ink-2, #0E1020)",
        overflow: "hidden",
      }}
    >
      {/* ─── FULL-BLEED ASCII HALFTONE CANVAS (RECOLOURED TO --accent-on-dark AT 8-12%) ─── */}
      <AsciiHalftoneCanvas
        theme="dark"
        density="normal"
        interactive={true}
        fontSize={11}
        color="rgba(125, 147, 255, 0.09)"
        accentColor="rgba(125, 147, 255, 0.12)"
        wrapperStyle={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          pointerEvents: "none",
          WebkitMaskImage: `linear-gradient(to bottom, #000 0px, #000 120px, transparent 180px, transparent calc(100% - 180px), #000 calc(100% - 120px), #000 100%), linear-gradient(to right, #000 0px, #000 calc(50% - 660px), rgba(0,0,0,0.3) calc(50% - 580px), rgba(0,0,0,0.3) calc(50% + 580px), #000 calc(50% + 660px), #000 100%)`,
          maskImage: `linear-gradient(to bottom, #000 0px, #000 120px, transparent 180px, transparent calc(100% - 180px), #000 calc(100% - 120px), #000 100%), linear-gradient(to right, #000 0px, #000 calc(50% - 660px), rgba(0,0,0,0.3) calc(50% - 580px), rgba(0,0,0,0.3) calc(50% + 580px), #000 calc(50% + 660px), #000 100%)`,
          WebkitMaskComposite: "source-over, destination-over",
          maskComposite: "add",
        }}
      />

      <SectionColumn
        style={{
          position: "relative",
          zIndex: 1,
          padding: "0 var(--col-pad, 24px)",
        }}
      >
        {/* Same black/cream header bar */}
        <SectionBar label="WHY AUTOMATE" sectionId="why-automate" theme="dark" />

        <div className="why-content-wrap">
          {/* Main 2-column staircase grid */}
          <div className="why-main-grid">
            {/* ─── LEFT COLUMN: Headline + CTA + Big Stat (#1) ─── */}
            <div className="why-left-col">
              {/* Section Headline */}
              <h2 id="why-title" className="why-headline">
                {whyData.headline || "Businesses replacing repetitive workflows with AI — and the fastest teams are already ahead."}
              </h2>

              {/* Sticky-tag CTA + text link */}
              <div className="why-cta-group">
                <StickyTag
                  href={bookingUrl || "#contact"}
                  onClick={(e) => {
                    if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                      e.preventDefault();
                      openBooking();
                    }
                  }}
                  onPointerEnter={preloadBooking}
                  onFocus={preloadBooking}
                />
                <a href="#process" className="why-see-how-link">
                  <span>See how it works</span>
                  <span aria-hidden="true">&rarr;</span>
                </a>
              </div>

              {/* Big Stat (#1): clamp(120px, 14vw, 240px) with gradient text */}
              <div className="why-big-stat">
                <div
                  className="why-stat-value-container"
                  aria-label={getAriaLabel(stat1.value, stat1.suffix)}
                >
                  <span className="sr-only">
                    {stat1.value}{stat1.suffix}
                  </span>
                  <div aria-hidden="true" className="why-big-number-visual">
                    <span ref={bigNumberRef} className="why-big-number-text">
                      {stat1.value}
                    </span>
                    {stat1.suffix && (
                      <span className="why-big-number-suffix">
                        {stat1.suffix}
                      </span>
                    )}
                  </div>
                </div>
                <p className="why-big-stat-label">
                  {stat1.label}
                </p>
              </div>
            </div>

            {/* ─── RIGHT SIDE: Stats #2, #3, #4 RISING STAIRCASE (3 columns) ─── */}
            <div className="why-staircase-wrap">
              {staircaseStats.map((stat, idx) => {
                // Column tops step UP left-to-right by ~80px each (the right-most column #4 is the highest)
                // idx = 0 (Stat #2): 160px
                // idx = 1 (Stat #3): 80px
                // idx = 2 (Stat #4): 0px (highest)
                const stepOffset = (2 - idx) * 80;

                return (
                  <div
                    key={idx}
                    className={`why-stair-col why-stair-col-${idx + 1}`}
                    style={{
                      "--step-offset": `${stepOffset}px`,
                    } as React.CSSProperties}
                  >
                    {/* Thin vertical line from column top to bottom of block */}
                    <div className="why-stair-line">
                      {/* 8px star marker at top of vertical line */}
                      <div className="why-stair-marker">
                        <StarShape size={8} variant="fill" color="rgba(244, 239, 230, 0.85)" />
                      </div>
                    </div>

                    {/* Column Content */}
                    <div className="why-stair-col-inner">
                      <div
                        className="why-stat-value-container"
                        aria-label={getAriaLabel(stat.value, stat.suffix)}
                      >
                        <span className="sr-only">
                          {stat.value}{stat.suffix}
                        </span>
                        <div aria-hidden="true" className="why-stair-num-visual">
                          <span
                            ref={(el) => {
                              stairNumberRefs.current[idx] = el;
                            }}
                            className="why-stair-num-text"
                          >
                            {stat.value}
                          </span>
                          {stat.suffix && (
                            <span className="why-stair-num-suffix">
                              {stat.suffix}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="why-stair-label">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── FOOTNOTE ROW: Generated dynamically from stats array ─── */}
          <div className="why-footnote">
            <p className="why-footnote-text">
              <span className="why-footnote-prefix">Sources:</span>
              {footnoteSources.map((src, i) => (
                <span key={src.name} className="why-footnote-item">
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="why-source-link"
                  >
                    {src.name}
                    {src.hasForecast ? " (forecast)" : ""}
                  </a>
                  {i < footnoteSources.length - 1 ? "; " : "."}
                </span>
              ))}
              {forecastNote && (
                <span className="why-footnote-note">
                  {forecastNote}
                </span>
              )}
            </p>
          </div>
        </div>
      </SectionColumn>

      <style>{`
        .why-content-wrap {
          padding-top: var(--heading-content-gap, 40px);
        }

        .why-main-grid {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
          gap: 48px;
          align-items: stretch;
        }

        .why-left-col {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-width: 0;
        }

        .why-headline {
          font-family: var(--ff-display, 'Inter Tight', sans-serif);
          font-size: clamp(34px, 3.8vw, 54px);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1.05;
          color: #ffffff;
          max-width: 640px;
          margin: 0;
          order: 1;
        }

        .why-cta-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          margin: 36px 0 28px 0;
          order: 2;
        }

        .why-see-how-link {
          font-family: var(--ff-body, 'DM Sans', sans-serif);
          font-size: 14px;
          color: rgba(244, 239, 230, 0.85);
          display: inline-flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .why-see-how-link:hover {
          color: #ffffff;
          text-decoration: underline;
          text-underline-offset: 3px;
        }
        .why-see-how-link:hover span[aria-hidden="true"] {
          transform: translateX(3px);
        }

        .why-big-stat {
          order: 3;
          min-width: 0;
        }

        .why-stat-value-container {
          display: inline-block;
          min-width: 0;
        }

        .why-big-number-visual {
          display: flex;
          align-items: flex-start;
          line-height: 0.88;
        }

        /* The only gradient text on the page: starts at --accent to ensure >= 4.5:1 contrast across all stops */
        .why-big-number-text {
          font-family: var(--ff-display, 'Inter Tight', sans-serif);
          font-size: clamp(120px, 14vw, 240px);
          font-weight: 500;
          letter-spacing: -0.04em;
          line-height: 0.88;
          background: linear-gradient(135deg, var(--accent, #5170FF) 0%, var(--accent-on-dark, #7D93FF) 55%, var(--accent-violet, #B368DF) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-variant-numeric: tabular-nums;
          display: inline-block;
        }

        .why-big-number-suffix {
          font-family: var(--ff-display, 'Inter Tight', sans-serif);
          font-size: clamp(40px, 5vw, 84px);
          font-weight: 500;
          letter-spacing: -0.02em;
          line-height: 1;
          color: var(--accent-on-dark, #7D93FF);
          margin-top: 0.08em;
          margin-left: 2px;
          display: inline-block;
        }

        .why-big-stat-label {
          font-family: var(--ff-body, 'DM Sans', sans-serif);
          font-size: 16px;
          line-height: 1.5;
          color: rgba(244, 239, 230, 0.80);
          max-width: 440px;
          margin: 16px 0 0 0;
        }

        /* ─── RISING STAIRCASE ─── */
        .why-staircase-wrap {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px;
          align-items: stretch;
          min-height: 480px;
        }

        .why-stair-col {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: flex-start;
          padding-top: var(--step-offset, 0px);
          min-width: 0;
        }

        .why-stair-line {
          position: absolute;
          top: var(--step-offset, 0px);
          bottom: 0;
          left: 0;
          width: 1px;
          background: rgba(244, 239, 230, 0.35);
          pointer-events: none;
        }

        .why-stair-marker {
          position: absolute;
          top: -4px;
          left: -3.5px;
          line-height: 1;
        }

        .why-stair-col-inner {
          padding-left: 20px;
          padding-top: 14px;
          padding-bottom: 24px;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .why-stair-num-visual {
          display: flex;
          align-items: baseline;
          line-height: 1;
        }

        .why-stair-num-text {
          font-family: var(--ff-display, 'Inter Tight', sans-serif);
          font-size: clamp(60px, 5.2vw, 84px);
          font-weight: 500;
          letter-spacing: -0.03em;
          color: #ffffff;
          line-height: 1;
          font-variant-numeric: tabular-nums;
        }

        .why-stair-num-suffix {
          font-family: var(--ff-display, 'Inter Tight', sans-serif);
          font-size: clamp(20px, 1.8vw, 28px);
          font-weight: 500;
          letter-spacing: -0.02em;
          color: rgba(244, 239, 230, 0.85);
          margin-left: 3px;
        }

        .why-stair-label {
          font-family: var(--ff-body, 'DM Sans', sans-serif);
          font-size: 14.5px;
          line-height: 1.48;
          color: rgba(244, 239, 230, 0.80);
          max-width: 200px;
          margin: 12px 0 0 0;
        }

        /* ─── FOOTNOTE ─── */
        .why-footnote {
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          padding-top: 24px;
          margin-top: 56px;
        }

        .why-footnote-text {
          font-family: var(--ff-mono, 'IBM Plex Mono', monospace);
          font-size: 12px;
          color: rgba(244, 239, 230, 0.70);
          line-height: 1.6;
          margin: 0;
        }

        .why-footnote-prefix {
          text-transform: uppercase;
          letter-spacing: 0.04em;
          margin-right: 6px;
          color: rgba(244, 239, 230, 0.85);
        }

        .why-source-link {
          color: rgba(244, 239, 230, 0.85);
          text-decoration: underline;
          text-underline-offset: 3px;
          text-decoration-color: rgba(244, 239, 230, 0.40);
          transition: color 0.2s ease, text-decoration-color 0.2s ease;
        }
        .why-source-link:hover {
          color: #ffffff;
          text-decoration-color: #ffffff;
        }

        .why-footnote-note {
          margin-left: 14px;
          color: rgba(244, 239, 230, 0.60);
        }

        /* ─── TABLET (768px - 1023px) ─── */
        @media (max-width: 1023px) and (min-width: 768px) {
          .why-main-grid {
            grid-template-columns: 1fr;
            gap: 40px;
          }
          .why-staircase-wrap {
            min-height: auto;
            gap: 20px;
          }
          .why-stair-col {
            padding-top: calc(var(--step-offset, 0px) * 0.6);
          }
          .why-stair-line {
            top: calc(var(--step-offset, 0px) * 0.6);
          }
        }

        /* ─── MOBILE (<768px) ─── */
        @media (max-width: 767px) {
          .why-content-wrap {
            padding-top: var(--heading-content-gap, 24px);
          }

          .why-main-grid {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          .why-headline {
            font-size: clamp(28px, 6.8vw, 36px);
            line-height: 1.08;
            order: 1;
          }

          .why-big-stat {
            order: 2;
            margin-top: 12px;
          }

          .why-big-number-text {
            font-size: clamp(96px, 28vw, 140px);
          }

          .why-big-number-suffix {
            font-size: clamp(34px, 10vw, 48px);
          }

          .why-big-stat-label {
            font-size: 15px;
            margin-top: 12px;
          }

          .why-cta-group {
            order: 3;
            margin: 16px 0 24px 0;
            width: 100%;
          }

          .why-cta-group .chamfer-tag,
          .why-cta-group a {
            width: 100%;
            justify-content: center;
          }

          .why-staircase-wrap {
            display: flex;
            flex-direction: column;
            gap: 28px;
            min-height: auto;
          }

          /* Remove staircase step on mobile: stats stack vertically with left line and star marker */
          .why-stair-col {
            padding-top: 0 !important;
            width: 100%;
          }

          .why-stair-line {
            top: 0 !important;
          }

          .why-stair-col-inner {
            padding-left: 18px !important;
            padding-top: 4px !important;
            padding-bottom: 8px !important;
          }

          .why-stair-num-text {
            font-size: 54px !important;
          }

          .why-stair-num-suffix {
            font-size: 20px !important;
          }

          .why-stair-label {
            font-size: 14px !important;
            max-width: 100% !important;
            margin-top: 8px !important;
          }

          .why-footnote {
            margin-top: 36px;
            padding-top: 18px;
          }

          .why-footnote-note {
            display: block;
            margin-left: 0;
            margin-top: 6px;
          }
        }
      `}</style>
    </SectionFrame>
  );
}
