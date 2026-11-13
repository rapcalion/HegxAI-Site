import dynamic from "next/dynamic";
import Marquee from "@/components/ui/Marquee";
import StarShape from "@/components/ui/StarShape";
import { siteContent } from "@/content/site";

const HeroWorkflowCard = dynamic(() => import("./HeroWorkflowCard"));
const HeroCta = dynamic(() => import("@/components/hero/HeroCta"));
const HeroDesktopConnector = dynamic(() => import("@/components/hero/HeroDesktopConnector"));
const HeroDesktopGlyphField = dynamic(() => import("@/components/hero/HeroDesktopGlyphField"));

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
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
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
        {/* ─── 3. DASHED CONNECTOR SVG (Desktop only) ─── */}
        <HeroDesktopConnector />

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
              className="hero-headline-line-1"
              style={{ display: "block" }}
            >
              EVERY TASK.
            </span>
          </span>

          <span style={{ display: "block", overflow: "hidden" }}>
            <span
              className="hero-headline-line-2"
              style={{ display: "block" }}
            >
              {/* Tight gradient box with 4 tiny 6px ink squares on corners */}
              <span
                className="hero-highlight-box"
                style={{
                  background: "var(--accent-grad)",
                  color: "#ffffff",
                  padding: "0 0.12em",
                  display: "inline-block",
                  position: "relative",
                  whiteSpace: "nowrap",
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
          className="hero-subtitle"
          style={{
            fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
            fontSize: "clamp(18px, 1.6vw, 22px)",
            color: "rgba(20, 20, 20, 0.72)",
            maxWidth: "560px",
            margin: "20px auto 32px",
            lineHeight: 1.5,
          }}
        >
          {siteContent.hero.subtitle}
        </p>

        {/* ─── 3. CTA WITH CORNER BRACKETS ─── */}
        <HeroCta />

        {/* ─── 5. TWO THIN HORIZONTAL LINES WITH MONO LABELS ─── */}
        <div style={{ width: "100%", position: "relative", zIndex: 3 }}>
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

      {/* ─── 7. ANIMATED GLYPH FIELD BAND (Desktop only, skipped on mobile) ─── */}
      <HeroDesktopGlyphField />

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
