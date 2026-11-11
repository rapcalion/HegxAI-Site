"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionBar, SectionColumn } from "@/components/ui/shared";
import SectionFrame from "@/components/ui/SectionFrame";
import StarShape from "@/components/ui/StarShape";
import { useBooking } from "@/components/ui/BookingProvider";
import { siteContent } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

export default function Pricing() {
  const { openBooking, preloadBooking, bookingUrl } = useBooking();
  const [mobilePlan, setMobilePlan] = useState<"starter" | "growth">("starter");
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  const tiers = siteContent.pricingTiers;

  return (
    <SectionFrame
      id="pricing"
      ariaLabelledby="pricing-title"
      ref={sectionRef}
      theme="cream"
      style={{
        background: "var(--bg)",
        opacity: 0,
      }}
    >
      <SectionColumn style={{ padding: "0 var(--col-pad, 24px)", width: "100%" }}>
        {/* Section Bar: FLEXIBLE ENGAGEMENT / 006 */}
        <SectionBar label="FLEXIBLE ENGAGEMENT" sectionId="pricing" />

        {/* Section Headline (left-aligned, same container/--col-pad as other sections) */}
        <div
          className="pricing-heading-block"
          style={{
            marginTop: "0px",
            marginBottom: "var(--heading-content-gap, 32px)",
            textAlign: "left",
          }}
        >
          <h2
            id="pricing-title"
            style={{
              fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
              fontSize: "clamp(24px, 5.5vw, 48px)",
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              maxWidth: "640px",
              margin: 0,
            }}
          >
            Flexible AI solutions for every stage of growth
          </h2>
        </div>

        {/* Mobile 2-Tab Switcher (<768px): 48px tall, square, active = ink bg / white text */}
        <div
          className="flex md:hidden w-full mb-6"
          style={{
            height: "48px",
            background: "rgba(20,20,20,0.06)",
            border: "1px solid var(--line)",
            borderRadius: "var(--r-0, 0px)",
            padding: "3px",
            gap: "3px",
          }}
        >
          <button
            type="button"
            onClick={() => setMobilePlan("starter")}
            style={{
              flex: 1,
              height: "100%",
              borderRadius: "var(--r-0, 0px)",
              border: "none",
              background: mobilePlan === "starter" ? "var(--ink)" : "transparent",
              color: mobilePlan === "starter" ? "#ffffff" : "var(--muted)",
              fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Starter
          </button>
          <button
            type="button"
            onClick={() => setMobilePlan("growth")}
            style={{
              flex: 1,
              height: "100%",
              borderRadius: "var(--r-0, 0px)",
              border: "none",
              background: mobilePlan === "growth" ? "var(--ink)" : "transparent",
              color: mobilePlan === "growth" ? "#ffffff" : "var(--muted)",
              fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            Growth
          </button>
        </div>

        {/* Pricing Cards Grid (Card radius 12px, aligned top) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {tiers.map((tier) => {
            const isDark = tier.id === "growth";
            const ctaHref = tier.id === "growth" ? (bookingUrl || tier.ctaHref) : tier.ctaHref;

            return (
              <div
                key={tier.id}
                className={`pricing-card ${isDark ? "pricing-card-dark" : "pricing-card-cream"} ${
                  mobilePlan === tier.id ? "flex" : "hidden"
                } md:flex`}
                style={{
                  background: isDark ? "var(--ink-2)" : "var(--surface)",
                  border: isDark ? "1px solid var(--hairline-dark)" : "1px solid rgba(20,20,20,0.12)",
                  borderRadius: "var(--r-card, 12px)",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: "none",
                  position: "relative",
                  overflow: "hidden",
                  width: "100%",
                  boxSizing: "border-box",
                }}
              >
                {/* Background subtle dot texture on dark card */}
                {isDark && (
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)`,
                      backgroundSize: "24px 24px",
                      pointerEvents: "none",
                    }}
                  />
                )}

                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", flex: 1 }}>
                  {/* Top Section with inner padding */}
                  <div className="pricing-card-top">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        gap: "12px",
                        minHeight: "24px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                          fontSize: "11px",
                          fontWeight: 600,
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: isDark ? "rgba(244, 239, 230, 0.65)" : "var(--muted)",
                        }}
                      >
                        {tier.descriptor}
                      </span>

                      {/* Recommended badge sits inside padded area (top-right, not flush to corner) */}
                      {tier.recommended && (
                        <span
                          style={{
                            background: "var(--accent-strong)",
                            color: "#ffffff",
                            fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                            fontSize: "11px",
                            fontWeight: 600,
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            padding: "4px 10px",
                            borderRadius: "4px",
                            flexShrink: 0,
                          }}
                        >
                          RECOMMENDED
                        </span>
                      )}
                    </div>

                    <h3
                      className="pricing-card-title"
                      style={{
                        fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                        fontSize: "clamp(26px, 2.4vw, 34px)",
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                        color: isDark ? "#ffffff" : "var(--ink)",
                        margin: "14px 0 8px",
                        fontWeight: 500,
                      }}
                    >
                      {tier.name}
                    </h3>

                    <p
                      className="pricing-card-desc"
                      style={{
                        fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                        fontSize: "15px",
                        lineHeight: 1.55,
                        color: isDark ? "rgba(255, 255, 255, 0.7)" : "#5f5b52",
                        margin: 0,
                        maxWidth: "48ch",
                      }}
                    >
                      {tier.description}
                    </p>
                  </div>

                  {/* Divider line spanning FULL card width, with inset text */}
                  <div
                    className="pricing-price-bar"
                    style={{
                      width: "100%",
                      borderTop: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(20,20,20,0.12)",
                      borderBottom: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(20,20,20,0.12)",
                      background: isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(20, 20, 20, 0.02)",
                    }}
                  >
                    <div className="pricing-price-inner">
                      <span
                        style={{
                          fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                          fontSize: "12px",
                          fontWeight: 500,
                          letterSpacing: "0.04em",
                          color: isDark ? "rgba(244, 239, 230, 0.75)" : "var(--muted)",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <span style={{ color: isDark ? "var(--accent-on-dark)" : "var(--accent-text)", fontWeight: 700 }}>{"//"}</span>
                        {tier.priceNote}
                      </span>
                    </div>
                  </div>

                  {/* Features checklist with inner padding */}
                  <div className="pricing-card-features">
                    <ul
                      style={{
                        listStyle: "none",
                        padding: 0,
                        margin: 0,
                        display: "flex",
                        flexDirection: "column",
                        gap: "14px",
                      }}
                    >
                      {tier.features.map((feat, i) => (
                        <li
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px",
                            fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                            fontSize: "15px",
                            lineHeight: 1.5,
                            color: isDark ? "rgba(255, 255, 255, 0.88)" : "var(--ink)",
                          }}
                        >
                          <span
                            style={{
                              width: "16px",
                              height: "16px",
                              display: "inline-flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                              marginTop: "3px",
                            }}
                            aria-hidden="true"
                          >
                            <StarShape
                              size={8}
                              variant="fill"
                              color={isDark ? "var(--accent-on-dark)" : "var(--accent-text)"}
                            />
                          </span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer CTA Bar (flush full-width) */}
                <a
                  href={ctaHref}
                  className={`pricing-cta-bar ${isDark ? "pricing-cta-growth" : "pricing-cta-starter"}`}
                  onClick={
                    tier.id === "growth"
                      ? (e) => {
                          if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                            e.preventDefault();
                            openBooking();
                          }
                        }
                      : undefined
                  }
                  onPointerEnter={tier.id === "growth" ? preloadBooking : undefined}
                  onFocus={tier.id === "growth" ? preloadBooking : undefined}
                >
                  <span>{tier.ctaLabel}</span>
                  <span className="pricing-cta-arrow" aria-hidden="true">→</span>
                </a>
              </div>
            );
          })}
        </div>
      </SectionColumn>

      <style>{`
        /* Card Inner Paddings: 32px (Desktop >= 1024px), 24px (Tablet 768-1023px), 20px (Mobile < 768px) */
        .pricing-card-top {
          padding: 32px 32px 24px 32px;
          box-sizing: border-box;
        }
        .pricing-price-inner {
          padding: 14px 32px;
          box-sizing: border-box;
        }
        .pricing-card-features {
          padding: 28px 32px 36px 32px;
          box-sizing: border-box;
          flex: 1;
        }

        /* Flush full-width Footer CTA Bar */
        .pricing-cta-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          min-height: 54px;
          font-family: var(--ff-display, 'Inter Tight', sans-serif);
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.02em;
          text-decoration: none;
          cursor: pointer;
          transition: background-color 0.2s ease, color 0.2s ease;
          position: relative;
          z-index: 2;
          margin-top: auto;
          box-sizing: border-box;
        }
        .pricing-cta-starter {
          background: rgba(20, 20, 20, 0.04);
          color: var(--ink);
          border-top: 1px solid rgba(20, 20, 20, 0.12);
        }
        .pricing-cta-starter:hover {
          background: var(--ink);
          color: #ffffff;
        }
        .pricing-cta-growth {
          background: var(--accent-strong);
          color: #ffffff;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
        }
        .pricing-cta-growth:hover {
          background: var(--accent);
          color: #ffffff;
        }
        .pricing-cta-arrow {
          display: inline-block;
          transition: transform 0.2s ease;
        }
        .pricing-cta-bar:hover .pricing-cta-arrow {
          transform: translateX(3px);
        }

        /* Tablet Responsive (768px - 1023px) */
        @media (min-width: 768px) and (max-width: 1023px) {
          .pricing-card-top {
            padding: 24px 24px 20px 24px !important;
          }
          .pricing-price-inner {
            padding: 12px 24px !important;
          }
          .pricing-card-features {
            padding: 22px 24px 28px 24px !important;
          }
        }

        /* Mobile Responsive (< 768px) */
        @media (max-width: 767px) {
          .pricing-heading-block {
            margin-bottom: 20px !important;
          }
          #pricing-title {
            font-size: 26px !important;
          }
          .pricing-card-top {
            padding: 20px 20px 16px 20px !important;
          }
          .pricing-card-title {
            margin: 10px 0 6px !important;
            font-size: 24px !important;
          }
          .pricing-card-desc {
            font-size: 14px !important;
            line-height: 1.5 !important;
          }
          .pricing-price-inner {
            padding: 12px 20px !important;
          }
          .pricing-card-features {
            padding: 18px 20px 24px 20px !important;
          }
          .pricing-cta-bar {
            min-height: 50px !important;
            font-size: 14px !important;
          }
        }
      `}</style>
    </SectionFrame>
  );
}
