"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { SectionBar, StickyTag } from "@/components/ui/shared";
import SectionFrame from "@/components/ui/SectionFrame";
import StarShape from "@/components/ui/StarShape";
import { useBooking } from "@/components/ui/BookingProvider";
import { siteContent } from "@/content/site";

const FOUNDER_BLUR_URL =
  "data:image/jpeg;base64,/9j/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAAQABADASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAwIE/8QAJBAAAgEEAQIHAAAAAAAAAAAAAQIDABESIQQFQRMiMVFhccH/xAAUAQEAAAAAAAAAAAAAAAAAAAAC/8QAFxEBAQEBAAAAAAAAAAAAAAAAAQBBEf/aAAwDAQACEQMRAD8Ayuw0EuxY28m7D3pRmAfEjYJYFZCLBr/tXByJeMSyZoSN4qGVt+hH1RcvqbSI4lMpfG0asAqqbnePfXf5ogOyemX/2Q==";

export default function About() {
  const { openBooking, preloadBooking, bookingUrl } = useBooking();
  const sectionRef = useRef<HTMLElement>(null);
  const tagRef = useRef<HTMLAnchorElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const graySpanRef = useRef<HTMLSpanElement>(null);
  const founderRef = useRef<HTMLDivElement>(null);
  const col1LineRef = useRef<HTMLDivElement>(null);
  const col1TextRef = useRef<HTMLDivElement>(null);
  const col2LineRef = useRef<HTMLDivElement>(null);
  const col2TextRef = useRef<HTMLDivElement>(null);

  const founder = siteContent.founder;
  const hasFounder = Boolean(founder && founder.name && (founder.image || founder.photo));
  const founderImage = founder?.image || founder?.photo || "";
  const founderAlt =
    founder?.alt ||
    (founder?.name && founder?.role ? `${founder.name}, ${founder.role} of HEGXAI` : founder?.name || "Founder portrait");

  useEffect(() => {
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

                // 2b. Founder portrait entrance (fade/slide up with scale-in)
                if (founderRef.current) {
                  gsap.fromTo(
                    founderRef.current,
                    { opacity: 0, y: 16, scale: 0.96 },
                    {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      duration: 0.75,
                      ease: "power3.out",
                      delay: 0.2,
                      scrollTrigger: {
                        trigger: sectionRef.current,
                        start: () => (window.innerWidth < 768 ? "top 95%" : "top 80%"),
                        toggleActions: "play none none none",
                      },
                    }
                  );
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
            {/* Header: Headline + Founder portrait (top-right of block on desktop) */}
            <div className="about-header-wrap">
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

              {hasFounder && (
                <aside
                  ref={founderRef}
                  className="about-founder-block"
                  aria-label="Founder"
                >
                  <div className="about-founder-avatar-wrap">
                    <Image
                      src={founderImage}
                      alt={founderAlt}
                      width={86}
                      height={86}
                      quality={85}
                      priority={false}
                      placeholder="blur"
                      blurDataURL={FOUNDER_BLUR_URL}
                      sizes="(max-width: 1023px) 72px, 86px"
                      className="about-founder-avatar-img"
                    />
                  </div>
                  <div className="about-founder-info">
                    <span className="about-founder-name">{founder.name}</span>
                    {founder.role && (
                      <span className="about-founder-role">{founder.role}</span>
                    )}
                  </div>
                </aside>
              )}
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

        .about-header-wrap {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 36px;
          width: 100%;
        }

        .about-headline-wrap {
          flex: 1 1 auto;
          min-width: 0;
        }

        .about-founder-block {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
          gap: 10px;
          flex-shrink: 0;
          padding-top: 4px;
        }

        .about-founder-avatar-wrap {
          width: 86px;
          height: 86px;
          border-radius: 50%;
          overflow: hidden;
          position: relative;
          background: var(--surface, #FBF8F2);
          border: 1px solid var(--line, rgba(20, 20, 20, 0.16));
          box-shadow: 0 0 0 1px rgba(20, 20, 20, 0.04);
          transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease;
        }

        .about-founder-avatar-wrap:hover {
          transform: scale(1.03);
          box-shadow: 0 4px 16px rgba(20, 20, 20, 0.08);
        }

        .about-founder-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 20%;
          display: block;
        }

        .about-founder-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          text-align: right;
          gap: 2px;
        }

        .about-founder-name {
          font-family: var(--ff-display, 'Inter Tight', sans-serif);
          font-weight: 700;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
          color: var(--ink, #141414);
          line-height: 1.2;
        }

        .about-founder-role {
          font-family: var(--ff-body, 'DM Sans', sans-serif);
          font-size: 12px;
          color: var(--muted, #757269);
          line-height: 1.25;
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
          .about-header-wrap {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }
          .about-founder-block {
            order: -1;
            flex-direction: row;
            align-items: center;
            text-align: left;
            gap: 14px;
            padding-top: 0;
          }
          .about-founder-avatar-wrap {
            width: 72px;
            height: 72px;
          }
          .about-founder-info {
            align-items: flex-start;
            text-align: left;
            gap: 2px;
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
          .about-header-wrap {
            order: 1 !important;
            display: flex !important;
            flex-direction: column !important;
            gap: 18px !important;
            align-items: flex-start !important;
            width: 100% !important;
          }
          .about-founder-block {
            order: -1 !important;
            flex-direction: row !important;
            align-items: center !important;
            text-align: left !important;
            gap: 14px !important;
            padding-top: 0 !important;
          }
          .about-founder-avatar-wrap {
            width: 72px !important;
            height: 72px !important;
          }
          .about-founder-info {
            align-items: flex-start !important;
            text-align: left !important;
            gap: 2px !important;
          }
          .about-headline-wrap {
            width: 100% !important;
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
