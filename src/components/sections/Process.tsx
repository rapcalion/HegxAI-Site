"use client";
import { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionBar, SectionColumn } from "@/components/ui/shared";
import SectionFrame from "@/components/ui/SectionFrame";

gsap.registerPlugin(ScrollTrigger);

// TODO: real testimonials - skip section as instructed

const STEPS = [
  {
    num: "01",
    title: "Discovery",
    tag: "(strategy)",
    body: "We start with a deep-dive into your current operations — workflows, tools, bottlenecks, and team structure. No assumption, no generic templates.",
    deliverables: ["Operations deep-dive", "Bottleneck audit", "Toolstack review"],
  },
  {
    num: "02",
    title: "Strategy",
    tag: "(planning)",
    body: "We design the automation blueprint: which processes to automate first, which tools to connect, and what the rollout sequence should look like.",
    deliverables: ["Automation blueprint", "Tool connections", "Rollout sequence"],
  },
  {
    num: "03",
    title: "Build",
    tag: "(development)",
    body: "We build, test, and iterate in tight loops — deploying agents, triggers, and integrations with full documentation and team walkthroughs.",
    deliverables: ["Agent deployment", "Integration triggers", "Team walkthroughs"],
  },
  {
    num: "04",
    title: "Run",
    tag: "(deployment)",
    body: "We go live with monitoring, handoff your team, and stay available for support. Your automation runs — and keeps running — reliably.",
    deliverables: ["Live monitoring", "Team handoff", "Ongoing support"],
  },
];

export default function Process() {
  const [activeStep, setActiveStep] = useState(0);
  const [mobileStep, setMobileStep] = useState(0);
  const activeStepRef = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const isMobile = window.innerWidth < 768;
    const section = sectionRef.current;
    if (!section) return;

    let st: ScrollTrigger | null = null;

    const ctx = gsap.context(() => {
      if (isMobile) {
        // Mobile does not pin
      } else {
        // Desktop: Pin the section and drive step changes on scroll
        const totalSteps = STEPS.length;
        st = ScrollTrigger.create({
          trigger: section,
          start: "top top",
          end: "+=700",
          pin: true,
          pinSpacing: true,
          scrub: 0.5,
          onUpdate: (self) => {
            const newStep = Math.min(
              totalSteps - 1,
              Math.floor(self.progress * totalSteps)
            );
            if (newStep !== activeStepRef.current) {
              activeStepRef.current = newStep;
              setActiveStep(newStep);
              // Crossfade detail card
              if (detailRef.current) {
                gsap.fromTo(
                  detailRef.current,
                  { opacity: 0, y: 16 },
                  { opacity: 1, y: 0, duration: 0.35, ease: "power3.out", overwrite: "auto" }
                );
              }
            }
          },
        });
      }
    }, sectionRef);

    return () => {
      if (st) st.kill();
      ctx.revert();
    };
  }, []);

  const step = STEPS[activeStep];

  return (
    <SectionFrame
      id="process"
      ariaLabelledby="process-title"
      ref={sectionRef}
      theme="cream"
      style={{
        background: "var(--bg)",
      }}
    >
      <SectionColumn style={{ padding: "0 var(--col-pad, 24px)", flex: 1, width: "100%" }}>
        <SectionBar label="THE PROCESS" sectionId="process" />

        {/* Headline & Intro */}
        <div
          className="process-heading-block"
          style={{
            marginTop: "0px",
            marginBottom: "var(--heading-content-gap, 24px)",
          }}
        >
          <h2
            id="process-title"
            style={{
              fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
              fontSize: "clamp(24px, 5.5vw, 48px)",
              fontWeight: 500,
              lineHeight: 1.08,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              maxWidth: "640px",
              marginBottom: "8px",
            }}
          >
            Automation built around your business
          </h2>
          <p
            style={{
              fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
              fontSize: "14px",
              lineHeight: 1.45,
              color: "#5f5b52",
              maxWidth: "56ch",
              margin: 0,
            }}
          >
            Automation that grows with you — designed to scale alongside your team with no rework and no surprises.
          </p>
        </div>

        {/* Mobile Accordion (<768px): 4-step accordion, 56px tall rows */}
        <div
          className="flex md:hidden flex-col relative"
          style={{
            position: "relative",
            paddingLeft: "24px",
            marginTop: "0px",
          }}
        >
          {/* 2px background line running full height */}
          <div
            style={{
              position: "absolute",
              top: "14px",
              bottom: "14px",
              left: "6px",
              width: "2px",
              background: "rgba(20,20,20,0.15)",
            }}
          />

          {STEPS.map((s, i) => {
            const isOpen = mobileStep === i;
            return (
              <div
                key={i}
                style={{
                  position: "relative",
                  borderBottom: "1px solid var(--line)",
                }}
              >
                {/* 2px progress dot on the open row */}
                {isOpen && (
                  <div
                    style={{
                      position: "absolute",
                      left: "-24px",
                      top: "21px",
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: "var(--bg)",
                      border: "2px solid var(--ink)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background: "var(--accent)",
                      }}
                    />
                  </div>
                )}

                {/* 56px Step title row */}
                <button
                  type="button"
                  onClick={() => setMobileStep(isOpen ? -1 : i)}
                  style={{
                    width: "100%",
                    minHeight: "56px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "none",
                    border: "none",
                    padding: "10px 0",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span
                      style={{
                        fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: isOpen ? "var(--accent-text)" : "var(--muted)",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {s.num}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                        fontSize: "18px",
                        fontWeight: 500,
                        color: "var(--ink)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {s.title}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                      fontSize: "16px",
                      color: isOpen ? "var(--ink)" : "var(--muted)",
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease",
                      lineHeight: 1,
                    }}
                  >
                    +
                  </span>
                </button>

                {/* Open details: paragraph + deliverables in ONE line */}
                {isOpen && (
                  <div style={{ paddingBottom: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <p
                      style={{
                        fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                        fontSize: "13.5px",
                        lineHeight: 1.45,
                        color: "#5f5b52",
                        margin: 0,
                      }}
                    >
                      {s.body}
                    </p>
                    <div
                      style={{
                        fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                        fontSize: "11px",
                        fontWeight: 500,
                        color: "var(--ink)",
                        letterSpacing: "0.02em",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        lineHeight: 1.3,
                        paddingTop: "4px",
                      }}
                    >
                      {s.deliverables.join(" · ")}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop pinned view (visible >=768px) */}
        <div
          className="hidden md:grid"
          style={{
            gridTemplateColumns: "1fr 1fr",
            gap: "80px",
            alignItems: "start",
          }}
        >
          {/* Left: step list + progress */}
          <div style={{ display: "flex", gap: "24px" }}>
            {/* Progress line */}
            <div style={{
              width: "2px",
              background: "rgba(20,20,20,0.12)",
              position: "relative",
              flexShrink: 0,
              borderRadius: "var(--r-0, 0px)",
            }}>
              <div
                ref={progressRef}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${((activeStep + 1) / STEPS.length) * 100}%`,
                  background: "var(--accent)",
                  borderRadius: "var(--r-0, 0px)",
                  transition: "height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />
            </div>

            <div style={{ flex: 1 }}>
              {STEPS.map((s, i) => (
                <div
                  key={i}
                  onClick={() => setActiveStep(i)}
                  style={{
                    padding: "20px 0",
                    borderBottom: i < STEPS.length - 1 ? "1px solid var(--line)" : "none",
                    cursor: "pointer",
                    transition: "opacity 0.2s ease",
                    opacity: activeStep === i ? 1 : 0.72,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                    {activeStep === i && (
                      <div style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "var(--accent)",
                        flexShrink: 0,
                        animation: "pulse-dot 1.6s ease-in-out infinite",
                      }} />
                    )}
                    <span style={{
                      fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                      fontSize: "10px",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      color: activeStep === i ? "var(--accent-text)" : "var(--ink)",
                    }}>
                      {s.num}
                    </span>
                    <span style={{
                      fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                      fontSize: "20px",
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                      color: "var(--ink)",
                    }}>
                      {s.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: detail card */}
          <div
            ref={detailRef}
            style={{
              background: "var(--surface)",
              border: "1px solid rgba(20,20,20,0.12)",
              borderRadius: "var(--r-card, 12px)",
              padding: "36px",
              boxShadow: "none",
            }}
          >
            <div
              style={{
                fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.08em",
                color: "var(--accent-text)",
                textTransform: "uppercase",
                marginBottom: "16px",
              }}
            >
              {step.tag} · STEP {step.num}
            </div>

            <div style={{
              fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
              fontSize: "clamp(24px, 2.5vw, 36px)",
              fontWeight: 500,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              lineHeight: 1.04,
              marginBottom: "20px",
            }}>
              {step.title}
            </div>

            <p style={{
              fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
              fontSize: "15px",
              fontWeight: 400,
              lineHeight: 1.7,
              color: "#5f5b52",
              maxWidth: "56ch",
              marginBottom: "28px",
            }}>
              {step.body}
            </p>

            {/* Dark card (radius 12) showing that step's 3 deliverables as checklist rows */}
            <div
              style={{
                background: "var(--ink-2)",
                borderRadius: "var(--r-card, 12px)",
                padding: "24px 28px",
                border: "1px solid var(--hairline-dark)",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                  fontSize: "10px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--muted-dark, rgba(255,255,255,0.7))",
                  marginBottom: "4px",
                }}
              >
                KEY DELIVERABLES
              </span>
              {step.deliverables.map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    paddingBottom: idx < step.deliverables.length - 1 ? "12px" : "0",
                    borderBottom:
                      idx < step.deliverables.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none",
                  }}
                >
                  <span
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "var(--r-0, 0px)",
                      background: "var(--accent-strong)",
                      color: "#ffffff",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "10px",
                      fontWeight: 800,
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                      fontSize: "14px",
                      color: "#ffffff",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionColumn>

      <style>{`
        @media (max-width: 767px) {
          .process-heading-block {
            margin-top: 0px !important;
            margin-bottom: 12px !important;
          }
          .process-heading-block h2 {
            font-size: 24px !important;
            margin-bottom: 6px !important;
          }
          .process-heading-block p {
            font-size: 13.5px !important;
            line-height: 1.4 !important;
          }
        }
      `}</style>
    </SectionFrame>
  );
}
