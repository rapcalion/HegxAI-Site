"use client";
import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionBar, SectionColumn, Button } from "@/components/ui/shared";
import SectionFrame from "@/components/ui/SectionFrame";
import StarShape from "@/components/ui/StarShape";
import { useBooking } from "@/components/ui/BookingProvider";
import { siteContent } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

// HARD RULE: NO invented dollar amounts, NO fake discounts

export default function Pricing() {
  const { openBooking, preloadBooking, bookingUrl } = useBooking();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [mobilePlan, setMobilePlan] = useState<"starter" | "growth">("growth");
  const [starterShowAll, setStarterShowAll] = useState(false);
  const [growthShowAll, setGrowthShowAll] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const priceRollStarterRef = useRef<HTMLDivElement>(null);
  const priceRollGrowthRef = useRef<HTMLDivElement>(null);

  // Render toggle only if any plan has a numeric price
  const hasNumericPrices = siteContent.pricingTiers.some((p) => /\d/.test(p.price));

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

  const handleToggle = (cycle: "monthly" | "yearly") => {
    if (cycle === billingCycle) return;
    setBillingCycle(cycle);

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    [priceRollStarterRef.current, priceRollGrowthRef.current].forEach((el) => {
      if (!el) return;
      gsap.fromTo(
        el,
        { y: -16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    });
  };

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
      <SectionColumn style={{ padding: "0 var(--col-pad, 24px)" }}>
        <SectionBar label="FLEXIBLE ENGAGEMENT" sectionId="pricing" />

        {/* Section Title & Optional Toggle */}
        <div
          className="pricing-title-wrap"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginTop: "var(--heading-content-gap, 40px)",
            marginBottom: "var(--heading-content-gap, 40px)",
          }}
        >
          <h2
            id="pricing-title"
            style={{
              fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
              fontSize: "clamp(30px, 8.4vw, 56px)",
              fontWeight: 500,
              lineHeight: 1.04,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              maxWidth: "56ch",
              margin: "0 0 24px",
            }}
          >
            <span className="reveal-mask" style={{ padding: "4px 0", overflow: "visible" }}>
              <span className="reveal-line" data-reveal-line style={{ lineHeight: 1.15 }}>
                Flexible AI solutions for every stage of growth
              </span>
            </span>
          </h2>

          {/* Toggle only rendered if numeric prices exist */}
          {hasNumericPrices && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                position: "relative",
                background: "var(--surface)",
                border: "1px solid var(--line)",
                borderRadius: "var(--r-0, 0px)",
                padding: "4px",
                boxShadow: "0 2px 10px rgba(20,20,20,0.03)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "4px",
                  bottom: "4px",
                  left: billingCycle === "monthly" ? "4px" : "calc(50%)",
                  width: "calc(50% - 4px)",
                  background: "var(--ink)",
                  borderRadius: "var(--r-0, 0px)",
                  transition: "left 0.3s cubic-bezier(0.16,1,0.3,1)",
                  zIndex: 1,
                }}
              />
              <button
                onClick={() => handleToggle("monthly")}
                style={{
                  position: "relative",
                  zIndex: 2,
                  padding: "8px 20px",
                  border: "none",
                  background: "transparent",
                  color: billingCycle === "monthly" ? "#ffffff" : "var(--muted)",
                  fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                  fontSize: "12px",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Monthly
              </button>
              <button
                onClick={() => handleToggle("yearly")}
                style={{
                  position: "relative",
                  zIndex: 2,
                  padding: "8px 20px",
                  border: "none",
                  background: "transparent",
                  color: billingCycle === "yearly" ? "#ffffff" : "var(--muted)",
                  fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                  fontSize: "12px",
                  fontWeight: 500,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                Annual
              </button>
            </div>
          )}
        </div>

        {/* Mobile 2-Tab Switcher (<768px): 48px tall, square, active = ink bg / white text */}
        <div
          className="flex md:hidden w-full mb-4"
          style={{
            height: "48px",
            background: "rgba(20,20,20,0.06)",
            border: "1px solid var(--line)",
            borderRadius: "var(--r-0, 0px)",
            padding: "2px",
            gap: "2px",
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
              transition: "all 0.25s ease",
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
              transition: "all 0.25s ease",
            }}
          >
            Growth
          </button>
        </div>

        {/* Pricing Cards Grid (Card radius 12px, aligned top) */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch"
        >
          {/* Card 1: Starter */}
          <div
            className={`card pricing-card-mobile p-5 md:p-10 ${mobilePlan === "starter" ? "flex" : "hidden"} md:flex`}
            style={{
              background: "var(--surface)",
              border: "1px solid rgba(20,20,20,0.12)",
              borderRadius: "var(--r-card, 12px)",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "none",
              position: "relative",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            <div>
              {/* Top Bar with Reserved Height to perfectly align with Card 2 */}
              <div
                className="pricing-top-bar"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: "28px",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "var(--muted)",
                  }}
                >
                  FOUNDATIONAL
                </span>
                {/* Empty placeholder spacer maintaining exact top alignment */}
                <span style={{ minHeight: "24px", display: "inline-block" }} />
              </div>

              <h3
                className="pricing-card-title"
                style={{
                  fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                  fontSize: "clamp(22px, 2vw, 30px)",
                  lineHeight: 1.04,
                  letterSpacing: "-0.02em",
                  color: "var(--ink)",
                  marginBottom: "12px",
                  fontWeight: 500,
                }}
              >
                Starter Automation
              </h3>

              <p
                className="pricing-card-desc"
                style={{
                  fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "#5f5b52",
                  maxWidth: "56ch",
                  marginBottom: "32px",
                }}
              >
                For emerging teams seeking to automate core recurring workflows and eliminate manual administrative overhead.
              </p>

              {/* Price Slot */}
              <div
                ref={priceRollStarterRef}
                className="pricing-price-slot"
                style={{
                  marginBottom: "36px",
                  paddingBottom: "28px",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span
                    style={{
                      fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                      fontSize: "44px",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      fontWeight: 500,
                      color: "var(--ink)",
                    }}
                  >
                    Custom
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                      fontSize: "13px",
                      color: "var(--muted)",
                    }}
                  >
                    / scoped to your needs
                  </span>
                </div>
              </div>

              {/* Features List */}
              <ul className="pricing-feat-list" style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  "Workflow friction audit & process mapping",
                  "Custom AI agent development for primary tasks",
                  "Seamless integration with core CRM & messaging tools",
                  "Continuous reliability monitoring & error handling",
                  "Complete architectural documentation & team onboarding",
                ].map((feat, i) => {
                  const hideOnMobile = !starterShowAll && i >= 3;
                  return (
                    <li
                      key={i}
                      className={hideOnMobile ? "hidden md:flex" : "flex"}
                      style={{
                        alignItems: "flex-start",
                        gap: "12px",
                        fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                        fontSize: "15px",
                        lineHeight: 1.5,
                        color: "var(--ink)",
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
                        <StarShape size={8} variant="fill" color="var(--accent-text)" />
                      </span>
                      <span>{feat}</span>
                    </li>
                  );
                })}
              </ul>

              {/* Mobile "Show all" toggle */}
              <button
                type="button"
                onClick={() => setStarterShowAll(!starterShowAll)}
                className="pricing-show-all-btn flex md:hidden items-center gap-1.5 text-xs uppercase tracking-wider font-semibold mb-6"
                style={{
                  background: "none",
                  border: "none",
                  padding: "4px 0",
                  color: "var(--ink)",
                  cursor: "pointer",
                  fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                }}
              >
                <span>{starterShowAll ? "Show fewer" : "Show all (5)"}</span>
                <span>{starterShowAll ? "↑" : "↓"}</span>
              </button>
            </div>

            {/* CTA Button: Secondary */}
            <Button
              href="#process"
              variant="secondary"
              className="btn-mobile-full"
              style={{ width: "100%", minHeight: "52px", color: "var(--ink)", borderColor: "var(--ink)" }}
            >
              See how it works
            </Button>
          </div>

          {/* Card 2: Growth (Dark Theme with RECOMMENDED Badge) */}
          <div
            className={`card-dark pricing-card-mobile p-5 md:p-10 ${mobilePlan === "growth" ? "flex" : "hidden"} md:flex`}
            style={{
              background: "var(--ink-2)",
              border: "1px solid var(--hairline-dark)",
              borderRadius: "var(--r-card, 12px)",
              flexDirection: "column",
              justifyContent: "space-between",
              boxShadow: "none",
              position: "relative",
              overflow: "hidden",
              transition: "opacity 0.3s ease, transform 0.3s ease",
            }}
          >
            {/* Background subtle dot texture */}
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

            <div style={{ position: "relative", zIndex: 1 }}>
              {/* Top Bar with RECOMMENDED Badge */}
              <div
                className="pricing-top-bar"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: "28px",
                  marginBottom: "20px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    color: "rgba(244,239,230,0.6)",
                  }}
                >
                  ENTERPRISE
                </span>

                {/* RECOMMENDED Badge */}
                <span
                  style={{
                    background: "var(--accent-strong)",
                    color: "#ffffff",
                    fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    padding: "4px 12px",
                    borderRadius: "var(--r-0, 0px)",
                  }}
                >
                  RECOMMENDED
                </span>
              </div>

              <h3
                className="pricing-card-title"
                style={{
                  fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                  fontSize: "clamp(22px, 2vw, 30px)",
                  lineHeight: 1.04,
                  letterSpacing: "-0.02em",
                  color: "#ffffff",
                  marginBottom: "12px",
                  fontWeight: 500,
                }}
              >
                Growth Automation
              </h3>

              <p
                className="pricing-card-desc"
                style={{
                  fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.65)",
                  maxWidth: "56ch",
                  marginBottom: "32px",
                }}
              >
                Comprehensive automation infrastructure for organizations demanding high-volume operations and autonomous agent networks.
              </p>

              {/* Price Slot */}
              <div
                ref={priceRollGrowthRef}
                className="pricing-price-slot"
                style={{
                  marginBottom: "36px",
                  paddingBottom: "28px",
                  borderBottom: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
                  <span
                    style={{
                      fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                      fontSize: "44px",
                      lineHeight: 1,
                      letterSpacing: "-0.02em",
                      fontWeight: 500,
                      color: "#ffffff",
                    }}
                  >
                    Enterprise
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                      fontSize: "13px",
                      color: "rgba(255,255,255,0.5)",
                    }}
                  >
                    / tailored scope
                  </span>
                </div>
              </div>

              {/* Features List */}
              <ul className="pricing-feat-list" style={{ listStyle: "none", padding: 0, margin: "0 0 20px", display: "flex", flexDirection: "column", gap: "14px" }}>
                {[
                  "Full operational audit & systems architecture blueprint",
                  "Multi-agent autonomous systems with human-in-the-loop controls",
                  "Custom API integrations & legacy database synchronizations",
                  "Priority operational SLA & dedicated monitoring engineer",
                  "Quarterly automation reviews & roadmap expansion",
                ].map((feat, i) => {
                  const hideOnMobile = !growthShowAll && i >= 3;
                  return (
                    <li
                      key={i}
                      className={hideOnMobile ? "hidden md:flex" : "flex"}
                      style={{
                        alignItems: "flex-start",
                        gap: "12px",
                        fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                        fontSize: "15px",
                        lineHeight: 1.5,
                        color: "rgba(255,255,255,0.85)",
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
                        <StarShape size={8} variant="fill" color="var(--accent-on-dark)" />
                      </span>
                      <span>{feat}</span>
                    </li>
                  );
                })}
              </ul>

              {/* Mobile "Show all" toggle */}
              <button
                type="button"
                onClick={() => setGrowthShowAll(!growthShowAll)}
                className="pricing-show-all-btn flex md:hidden items-center gap-1.5 text-xs uppercase tracking-wider font-semibold mb-6"
                style={{
                  background: "none",
                  border: "none",
                  padding: "4px 0",
                  color: "var(--accent-on-dark)",
                  cursor: "pointer",
                  fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                }}
              >
                <span>{growthShowAll ? "Show fewer" : "Show all (5)"}</span>
                <span>{growthShowAll ? "↑" : "↓"}</span>
              </button>
            </div>

            {/* CTA Button: Accent */}
            <Button
              href={bookingUrl || "#contact"}
              variant="accent"
              className="btn-mobile-full"
              style={{ width: "100%", minHeight: "52px" }}
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
        </div>
      </SectionColumn>

      <style>{`
        @media (max-width: 767px) {
          .pricing-title-wrap {
            margin-top: 0px !important;
            margin-bottom: 12px !important;
          }
          #pricing-title {
            font-size: 26px !important;
            margin-bottom: 0px !important;
          }
          .pricing-card-mobile {
            padding: 20px !important;
          }
          .pricing-top-bar {
            margin-bottom: 10px !important;
          }
          .pricing-card-title {
            margin-bottom: 8px !important;
            font-size: 22px !important;
          }
          .pricing-card-desc {
            margin-bottom: 12px !important;
            font-size: 14px !important;
            line-height: 1.4 !important;
          }
          .pricing-price-slot {
            margin-bottom: 14px !important;
            padding-bottom: 12px !important;
          }
          .pricing-feat-list {
            margin-bottom: 6px !important;
            gap: 10px !important;
          }
          .pricing-show-all-btn {
            margin-bottom: 12px !important;
            min-height: 38px !important;
          }
        }
      `}</style>
    </SectionFrame>
  );
}
