"use client";
import { useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionBar, SectionColumn } from "@/components/ui/shared";
import SectionFrame from "@/components/ui/SectionFrame";
import Marquee from "@/components/ui/Marquee";
import { siteContent } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  {
    name: "AI STRATEGY",
    tags: ["DISCOVERY", "CONSULTING"],
    desc: "We analyze your bottlenecks, evaluate automation feasibility, and design a strategic blueprint for enterprise AI adoption.",
  },
  {
    name: "CUSTOM AI AGENTS",
    tags: ["AUTONOMOUS", "DECISIONING"],
    desc: "Custom AI agents that work autonomously — handling triage, customer queries, and multi-step logic 24/7.",
  },
  {
    name: "WORKFLOW AUTOMATION",
    tags: ["END-TO-END", "MULTI-STEP"],
    desc: "End-to-end automation of complex business processes across your existing operations stack.",
  },
  {
    name: "INTEGRATIONS",
    tags: ["CRM SYNC", "CUSTOM API"],
    desc: "Seamless connections between your operational platforms with zero manual data entry.",
  },
  {
    name: "PROCESS DESIGN",
    tags: ["AUDIT", "SYSTEMS"],
    desc: "We map existing friction, identify automation ROI, and design resilient operational architecture.",
  },
];

export default function Services() {
  const [activeIdx, setActiveIdx] = useState<number | null>(0);
  const sectionRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (prefersReduced) return;

      const validRows = rowsRef.current.filter(Boolean) as HTMLDivElement[];
      if (validRows.length === 0) return;

      gsap.fromTo(
        validRows,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <SectionFrame
      id="services"
      ariaLabelledby="services-title"
      ref={sectionRef}
      theme="cream"
      style={{
        background: "var(--bg)",
      }}
    >
      <SectionColumn style={{ padding: "0 var(--col-pad, 24px)" }}>
        <SectionBar label="SERVICES" sectionId="services" headingId="services-title" />

        {/* One-line intro under the bar (16px #5f5b52, max-width 56ch) */}
        <p
          className="services-intro"
          style={{
            fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
            fontSize: "16px",
            lineHeight: 1.6,
            color: "#5f5b52",
            maxWidth: "56ch",
            marginTop: "16px",
            marginBottom: "0px",
          }}
        >
          Custom AI agents, workflow automation, and deep tool integrations built to eliminate bottlenecks and scale operations.
        </p>

        {/* Service rows (straight 1px bottom borders, 0 radius, accordion behavior with hover activation) */}
        <div className="services-list" style={{ borderTop: "1px solid var(--line)", marginTop: "var(--heading-content-gap, 40px)" }}>
          {SERVICES.map((service, i) => {
            const isActive = activeIdx === i;

            return (
              <div
                key={i}
                ref={(el) => {
                  rowsRef.current[i] = el;
                }}
                onClick={() => setActiveIdx(isActive ? null : i)}
                onMouseEnter={() => {
                  if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
                    setActiveIdx(i);
                  }
                }}
                className={`service-row ${isActive ? "is-active" : ""}`}
                style={{
                  position: "relative",
                  borderBottom: "1px solid var(--line)",
                  borderRadius: "var(--r-0, 0px)",
                  background: isActive ? "var(--ink)" : "transparent",
                  color: isActive ? "#ffffff" : "var(--ink)",
                  cursor: "pointer",
                  minHeight: "56px",
                  transition:
                    "background-color 0.35s cubic-bezier(0.16, 1, 0.3, 1), color 0.35s cubic-bezier(0.16, 1, 0.3, 1), padding 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                  padding: isActive ? "24px 20px" : "20px 16px",
                  overflow: "hidden",
                }}
              >
                {/* Main Row Content */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "16px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "20px", minWidth: 0 }}>
                    {/* Arrow icon (ink at 60% when inactive, accent rotated 45deg when active) */}
                    <span
                      className="service-row-arrow"
                      style={{
                        fontFamily: "sans-serif",
                        fontSize: "20px",
                        color: isActive ? "var(--accent-on-dark)" : "rgba(20,20,20,0.6)",
                        transform: isActive ? "rotate(45deg)" : "rotate(0deg)",
                        transition:
                          "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), color 0.35s ease",
                        display: "inline-block",
                        flexShrink: 0,
                      }}
                    >
                      →
                    </span>

                    {/* Service Name: 28-32px on mobile, up to 56px desktop */}
                    <span
                      className="service-name"
                      style={{
                        fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                        fontSize: "clamp(28px, 4vw, 56px)",
                        fontWeight: 500,
                        letterSpacing: "-0.02em",
                        lineHeight: 1.04,
                        textTransform: "uppercase",
                        color: isActive ? "#ffffff" : "var(--ink)",
                        transition: "color 0.35s ease",
                      }}
                    >
                      {service.name}
                    </span>
                  </div>

                  {/* Desktop Active row right-aligned Learn more link */}
                  {isActive && (
                    <a
                      href="#contact"
                      onClick={(e) => e.stopPropagation()}
                      className="service-learn-more hidden md:inline-flex"
                      style={{
                        fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                        fontSize: "13px",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        color: "var(--accent-on-dark)",
                        textDecoration: "none",
                        alignItems: "center",
                        gap: "6px",
                        flexShrink: 0,
                        transition: "color 0.2s ease",
                      }}
                    >
                      <span>Learn more</span>
                      <span className="learn-arrow">→</span>
                    </a>
                  )}
                </div>

                {/* Accordion description line visible on active row */}
                <div
                  style={{
                    maxHeight: isActive ? "200px" : "0px",
                    opacity: isActive ? 1 : 0,
                    overflow: "hidden",
                    transition:
                      "max-height 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.35s ease, margin 0.35s ease",
                    marginTop: isActive ? "16px" : "0px",
                    paddingLeft: "40px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                      fontSize: "15px",
                      fontWeight: 400,
                      lineHeight: 1.6,
                      color: "rgba(255,255,255,0.78)",
                      maxWidth: "56ch",
                      marginBottom: "12px",
                    }}
                  >
                    {service.desc}
                  </p>

                  {/* Mobile Learn More inside accordion */}
                  <div className="block md:hidden" style={{ marginTop: "8px" }}>
                    <a
                      href="#contact"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                        fontSize: "13px",
                        fontWeight: 500,
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                        color: "var(--accent-on-dark)",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span>Learn more</span>
                      <span>→</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Client Logos Marquee - only shown if real logos exist */}
        {siteContent.clientLogos.length > 0 && (
          <div style={{ marginTop: "60px", textAlign: "center" }}>
            <span
              style={{
                fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#5f5b52",
                display: "block",
                marginBottom: "20px",
              }}
            >
              OUR CLIENTS
            </span>

            <Marquee fadeEdges gap={20} speed={0.8}>
              {siteContent.clientLogos.map((client, i) => (
                <div
                  key={i}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    padding: "10px 24px",
                    borderRadius: "var(--r-0, 0px)",
                    background: "var(--surface)",
                    border: "1px solid var(--line)",
                    color: "var(--muted)",
                    minWidth: "140px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                      fontSize: "12px",
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--ink)",
                    }}
                  >
                    {client.name}
                  </span>
                </div>
              ))}
            </Marquee>
          </div>
        )}
      </SectionColumn>

      <style>{`
        @media (max-width: 767px) {
          .services-intro {
            font-size: 15px !important;
            margin-top: 12px !important;
          }
          .services-list {
            margin-top: var(--heading-content-gap, 24px) !important;
          }
          .service-name {
            font-size: 26px !important;
          }
        }
      `}</style>
    </SectionFrame>
  );
}
