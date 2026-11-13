"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionBar, StickyTag } from "@/components/ui/shared";
import SectionFrame from "@/components/ui/SectionFrame";
import StarShape from "@/components/ui/StarShape";
import { useBooking } from "@/components/ui/BookingProvider";
import { siteContent } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const { openBooking, preloadBooking, bookingUrl } = useBooking();
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLAnchorElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const graySpanRef = useRef<HTMLSpanElement>(null);
  const col1LineRef = useRef<HTMLDivElement>(null);
  const col1TextRef = useRef<HTMLDivElement>(null);
  const col2LineRef = useRef<HTMLDivElement>(null);
  const col2TextRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const ctx = gsap.context(() => {
      // 1. Accent Tag entrance
      if (tagRef.current) {
        gsap.fromTo(
          tagRef.current,
          { x: -24, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.7,
            ease: "back.out(1.4)",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: () => (window.innerWidth < 768 ? "top 95%" : "top 80%"),
              toggleActions: "play none none none",
            },
          }
        );

        // Chevrons stagger in
        const chevrons = tagRef.current.querySelectorAll(".chevron-arrow");
        if (chevrons.length > 0) {
          gsap.fromTo(
            chevrons,
            { x: -8, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.4,
              stagger: 0.08,
              ease: "power2.out",
              delay: 0.3,
              scrollTrigger: {
                trigger: sectionRef.current,
                start: () => (window.innerWidth < 768 ? "top 95%" : "top 80%"),
                toggleActions: "play none none none",
              },
            }
          );
        }
      }

      // 2. Headline line-by-line reveal & gray span color transition
      if (headlineRef.current) {
        const lines = headlineRef.current.querySelectorAll(".headline-reveal-line");
        if (lines.length > 0) {
          gsap.fromTo(
            lines,
            { y: "110%" },
            {
              y: "0%",
              duration: 0.8,
              stagger: 0.08,
              ease: "power3.out",
              scrollTrigger: {
                trigger: headlineRef.current,
                start: () => (window.innerWidth < 768 ? "top 95%" : "top 82%"),
                toggleActions: "play none none none",
              },
              onComplete: () => {
                if (graySpanRef.current) {
                  gsap.fromTo(
                    graySpanRef.current,
                    { color: "#8f8c83" },
                    { color: "#757269", duration: 0.6, ease: "power2.out" }
                  );
                }
              },
            }
          );
        }
      }

      // 3. Text Columns: lines scaleY from top, text fades up (no square handles)
      const dividerLines = [col1LineRef.current, col2LineRef.current].filter(Boolean);
      const textBlocks = [col1TextRef.current, col2TextRef.current].filter(Boolean);

      if (dividerLines.length > 0) {
        gsap.fromTo(
          dividerLines,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top",
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: () => (window.innerWidth < 768 ? "top 95%" : "top 75%"),
              toggleActions: "play none none none",
            },
          }
        );
      }

      if (textBlocks.length > 0) {
        gsap.fromTo(
          textBlocks,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.35,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: () => (window.innerWidth < 768 ? "top 95%" : "top 75%"),
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionFrame
      id="about"
      ariaLabelledby="about-title"
      ref={sectionRef}
      theme="cream"
      style={{
        background: "var(--bg, #F4EFE6)",
      }}
    >
      {/* ─── TOP LOGO STRIP (rendered ONLY if logos array has items) ─── */}
      {siteContent.logos && siteContent.logos.length > 0 && (
        <div
          style={{
            height: "77px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "48px",
            opacity: 0.4,
            filter: "grayscale(100%)",
            borderBottom: "2px solid rgba(20,20,20,0.25)",
            padding: "0 24px",
            marginBottom: "64px",
          }}
        >
          {siteContent.logos.map((logo, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={logo.url}
              alt={logo.name || ""}
              width={120}
              height={24}
              style={{ maxHeight: "24px", width: "auto", objectFit: "contain" }}
            />
          ))}
        </div>
      )}

      {/* ─── MAIN COLUMN WRAPPER (Frame with standard page container/margins --col-pad) ─── */}
      <div
        className="about-container"
        style={{
          maxWidth: "1320px",
          width: "100%",
          margin: "0 auto",
          position: "relative",
          padding: "0 var(--col-pad, 24px)",
        }}
      >
        {/* ─── SECTION BAR: black "ABOUT US / 001" bar, no square handles ─── */}
        <SectionBar
          label="ABOUT US"
          sectionId="about"
          showNodes={false}
          height={34}
          padding="0 12px"
          marginBottom={28}
        />

        {/* ─── CONTENT GRID: Left ~25% (Accent Tag), Right ~75% (Headline + Two Columns) ─── */}
        <div className="about-grid">
          {/* Left Column: Accent Tag CTA ("Book a free audit" - single CTA in section) */}
          <div className="about-accent-tag-wrap" style={{ position: "relative", overflow: "hidden" }}>
            {/* Stage 3: Large decorative outline star bleeding off left */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: "40px",
                left: "-110px",
                width: "360px",
                height: "360px",
                pointerEvents: "none",
                zIndex: 0,
              }}
            >
              <StarShape
                size="100%"
                variant="outline"
                color="var(--ink)"
                opacity={0.06}
                strokeWidth={1}
              />
            </div>
            <StickyTag
              tagRef={tagRef}
              href={bookingUrl || "#contact"}
              label={siteContent.about.ctaLabel}
              onClick={(e) => {
                if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
                  e.preventDefault();
                  openBooking();
                }
              }}
              onPointerEnter={preloadBooking}
              onFocus={preloadBooking}
            />
          </div>

          {/* Right Column: Two-Tone Headline + Two Text Columns */}
          <div className="about-main-content">
            {/* Headline: 3-4 lines on desktop */}
            <div ref={headlineRef} className="about-headline-wrap">
              <h2
                id="about-title"
                style={{
                  fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                  fontWeight: 500,
                  fontSize: "clamp(28px, 3.6vw, 46px)",
                  lineHeight: 1.04,
                  letterSpacing: "-0.03em",
                  margin: 0,
                }}
              >
                <span className="headline-reveal-mask">
                  <span className="headline-reveal-line" style={{ color: "var(--ink, #141414)" }}>
                    {siteContent.about.headlineLeadLine1}
                  </span>
                </span>
                <span className="headline-reveal-mask">
                  <span className="headline-reveal-line" style={{ color: "var(--ink, #141414)" }}>
                    {siteContent.about.headlineLeadLine2}
                  </span>
                </span>
                <span className="headline-reveal-mask">
                  <span
                    ref={graySpanRef}
                    className="headline-reveal-line"
                    style={{ color: "#757269", transition: "color 0.4s ease" }}
                  >
                    {siteContent.about.headlineMuted}
                  </span>
                </span>
              </h2>
            </div>

            {/* Two Columns: aligned to the same grid as headline, min 24px right padding from frame */}
            <div className="about-cols-wrap">
              {/* Column 1: What we build */}
              <div className="about-col">
                <div
                  ref={col1LineRef}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "1px",
                    background: "var(--hairline)",
                  }}
                />
                <div ref={col1TextRef} className="about-col-text">
                  <h3
                    style={{
                      fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                      fontWeight: 600,
                      fontSize: "17px",
                      color: "var(--ink, #141414)",
                      marginBottom: "8px",
                      lineHeight: 1.25,
                    }}
                  >
                    {siteContent.about.whatWeBuildTitle}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                      fontSize: "16px",
                      lineHeight: 1.55,
                      color: "rgba(20, 20, 20, 0.72)",
                      margin: 0,
                    }}
                  >
                    {siteContent.about.whatWeBuildBody}
                  </p>
                </div>
              </div>

              {/* Column 2: How we work */}
              <div className="about-col">
                <div
                  ref={col2LineRef}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: "1px",
                    background: "var(--hairline)",
                  }}
                />
                <div ref={col2TextRef} className="about-col-text">
                  <h3
                    style={{
                      fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                      fontWeight: 600,
                      fontSize: "17px",
                      color: "var(--ink, #141414)",
                      marginBottom: "8px",
                      lineHeight: 1.25,
                    }}
                  >
                    {siteContent.about.howWeWorkTitle}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                      fontSize: "16px",
                      lineHeight: 1.55,
                      color: "rgba(20, 20, 20, 0.72)",
                      margin: 0,
                    }}
                  >
                    {siteContent.about.howWeWorkBody}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── BOTTOM 1px LINE (Closes the section frame) ─── */}
        <div
          style={{
            width: "100%",
            height: "1px",
            background: "var(--hairline)",
            marginTop: "56px",
          }}
        />
      </div>

      {/* ─── SCOPED RESPONSIVE CSS ─── */}
      <style>{`
        .about-grid {
          display: grid;
          grid-template-columns: minmax(130px, 25%) 1fr;
          column-gap: 40px;
          align-items: start;
          width: 100%;
        }

        .about-accent-tag-wrap {
          display: flex;
          justify-content: flex-start;
          padding-top: 4px;
        }

        .about-accent-tag {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .about-accent-tag:hover {
          transform: translateX(4px);
        }
        .about-accent-tag:hover .about-chevrons {
          transform: translateX(4px);
        }
        .about-chevrons {
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .about-main-content {
          display: flex;
          flex-direction: column;
          gap: 48px;
          width: 100%;
        }

        .about-headline-wrap {
          width: 100%;
        }

        .headline-reveal-mask {
          display: block;
          overflow: hidden;
          padding-bottom: 0.14em;
          margin-bottom: -0.14em;
        }

        .headline-reveal-line {
          display: inline-block;
          will-change: transform;
        }

        .about-cols-wrap {
          display: grid;
          grid-template-columns: 1fr 1fr;
          column-gap: 40px;
          width: 100%;
        }

        .about-col {
          position: relative;
          min-width: 0;
        }

        .about-col-text {
          padding-left: 24px;
          padding-top: 4px;
        }

        /* Tablet & Mobile Breakpoints */
        @media (max-width: 1023px) and (min-width: 768px) {
          .about-grid {
            grid-template-columns: 140px 1fr;
            column-gap: 28px;
          }
          .about-cols-wrap {
            column-gap: 28px;
          }
        }

        @media (max-width: 767px) {
          .about-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 28px !important;
          }
          .about-main-content {
            display: contents !important;
          }
          .about-headline-wrap {
            order: 1 !important;
          }
          .about-headline-wrap h2 {
            font-size: 28px !important;
            line-height: 1.05 !important;
          }
          .about-cols-wrap {
            order: 2 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 24px !important;
          }
          .about-accent-tag-wrap {
            order: 3 !important;
            padding-top: 8px !important;
          }
          .about-col-text {
            padding-left: 18px !important;
          }
        }
      `}</style>
    </SectionFrame>
  );
}
