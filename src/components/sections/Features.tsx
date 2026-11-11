"use client";

import { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { SectionBar, SectionColumn } from "@/components/ui/shared";
import SectionFrame from "@/components/ui/SectionFrame";
import StarShape from "@/components/ui/StarShape";
import FeatureVisualLayered from "./FeatureVisualLayered";
import { siteContent } from "@/content/site";

export default function Features() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [mobileActive, setMobileActive] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const rightPanelsRef = useRef<(HTMLDivElement | null)[]>([]);
  const digitsRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const isTransitioningRef = useRef(false);

  // Mobile horizontal scroll tracking
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onScroll = () => {
      const children = Array.from(el.children);
      const scrollCenter = el.scrollLeft + el.clientWidth / 2;
      let closestIdx = 0;
      let minDiff = Infinity;
      children.forEach((child, i) => {
        const c = child as HTMLElement;
        const center = c.offsetLeft + c.offsetWidth / 2;
        const diff = Math.abs(scrollCenter - center);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = i;
        }
      });
      setMobileActive(closestIdx);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  const scrollCarouselTo = (idx: number) => {
    const el = carouselRef.current;
    if (!el) return;
    const children = Array.from(el.children);
    const target = children[idx] as HTMLElement;
    if (target) {
      el.scrollTo({ left: target.offsetLeft - el.offsetLeft, behavior: "smooth" });
    }
    setMobileActive(idx);
  };

  // Desktop feature switching with strict transition sequencing (out ~0.2s, in ~0.35s)
  const goTo = (targetIdx: number) => {
    if (targetIdx < 0 || targetIdx >= siteContent.features.length) return;
    if (targetIdx === activeIdx || isTransitioningRef.current) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const fromIdx = activeIdx;
    setActiveIdx(targetIdx);

    if (prefersReduced) {
      // Instant swap: respect prefers-reduced-motion
      rightPanelsRef.current.forEach((panel, i) => {
        if (!panel) return;
        panel.style.opacity = i === targetIdx ? "1" : "0";
        panel.style.visibility = i === targetIdx ? "visible" : "hidden";
        panel.style.pointerEvents = i === targetIdx ? "auto" : "none";
      });
      if (digitsRef.current) {
        digitsRef.current.style.transform = `translateY(-${targetIdx * 16}px)`;
      }
      return;
    }

    isTransitioningRef.current = true;

    const outgoingRight = rightPanelsRef.current[fromIdx];
    const incomingRight = rightPanelsRef.current[targetIdx];

    // Ensure incoming panel is hidden before starting
    if (incomingRight) {
      gsap.set(incomingRight, { opacity: 0, visibility: "hidden", pointerEvents: "none" });
    }

    // Step 1: Outgoing elements fully fade out (~0.2s)
    if (outgoingRight) {
      gsap.to(outgoingRight, {
        opacity: 0,
        y: -6,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          outgoingRight.style.visibility = "hidden";
          outgoingRight.style.pointerEvents = "none";

          // Rolling digits pager transition
          if (digitsRef.current) {
            gsap.to(digitsRef.current, {
              y: -targetIdx * 16,
              duration: 0.35,
              ease: "power2.out",
            });
          }

          // Step 2: Incoming elements fade in (~0.35s)
          if (incomingRight) {
            incomingRight.style.visibility = "visible";
            incomingRight.style.pointerEvents = "auto";

            gsap.fromTo(
              incomingRight,
              { opacity: 0, y: 6 },
              {
                opacity: 1,
                y: 0,
                duration: 0.35,
                ease: "power2.out",
                onComplete: () => {
                  isTransitioningRef.current = false;
                },
              }
            );
          } else {
            isTransitioningRef.current = false;
          }
        },
      });
    } else {
      isTransitioningRef.current = false;
    }
  };

  return (
    <SectionFrame
      id="features"
      ariaLabelledby="features-title"
      ref={sectionRef}
      theme="cream"
      paddingTop="var(--section-py, 96px)"
      paddingBottom="40px"
      style={{
        background: "var(--bg)",
      }}
    >
      <SectionColumn style={{ padding: "0 var(--col-pad, 24px)", width: "100%" }}>
        {/* Section Bar: "THE FEATURES / 002" */}
        <SectionBar
          label="THE FEATURES"
          sectionId="features"
          showNodes={false}
          marginBottom="var(--heading-content-gap, 40px)"
        />

        {/* ─── MOBILE CAROUSEL (< 768px): Horizontal swipe carousel ─── */}
        <div className="flex flex-col md:hidden">
          <div
            ref={carouselRef}
            className="features-carousel-container"
            style={{
              display: "flex",
              overflowX: "auto",
              scrollSnapType: "x mandatory",
              gap: "16px",
              paddingBottom: "8px",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              width: "100%",
            }}
          >
            {siteContent.features.map((item, i) => (
              <div
                key={i}
                className="features-slide"
                style={{
                  flex: "0 0 88%",
                  width: "88%",
                  scrollSnapAlign: "start",
                  display: "flex",
                  flexDirection: "column",
                  gap: "14px",
                }}
              >
                {/* Visual Panel on top (panel height ~340px, right/bottom padding accommodates breakout without horizontal scroll) */}
                <div
                  style={{
                    paddingRight: "12px",
                    paddingBottom: "12px",
                    boxSizing: "border-box",
                    width: "100%",
                  }}
                >
                  <FeatureVisualLayered
                    activeIndex={i}
                    isMobile={true}
                    slideFeature={item}
                  />
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                    fontSize: "18px",
                    fontWeight: 500,
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                    color: "var(--ink)",
                    margin: 0,
                  }}
                >
                  {item.title}
                </h3>

                {/* 2-line paragraph */}
                <p
                  style={{
                    fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                    fontSize: "14px",
                    fontWeight: 400,
                    lineHeight: 1.45,
                    color: "var(--muted)",
                    margin: 0,
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {item.body}
                </p>

                {/* Tasks row */}
                <div
                  style={{
                    fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                    fontSize: "11.5px",
                    color: "var(--ink)",
                    paddingTop: "8px",
                    borderTop: "1px solid var(--line)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: 1.3,
                  }}
                >
                  {item.tasks.join(" · ")}
                </div>
              </div>
            ))}
          </div>

          {/* Dots under carousel (3 dots, active = ink, 24x24px hit area with zero overlap) */}
          <div
            className="flex items-center justify-center gap-1"
            style={{ marginTop: "14px", marginBottom: "4px" }}
          >
            {siteContent.features.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollCarouselTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="features-carousel-dot"
                style={{
                  minWidth: "24px",
                  minHeight: "24px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    display: "block",
                    width: mobileActive === i ? "20px" : "7px",
                    height: "7px",
                    borderRadius: "4px",
                    background: mobileActive === i ? "var(--ink)" : "rgba(20,20,20,0.2)",
                    transition: "all 0.25s ease",
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* ─── DESKTOP TWO-COLUMN SECTION (>= 768px) ─── */}
        <div
          className="features-desktop-grid hidden md:grid"
          style={{
            gridTemplateColumns: "minmax(0, 1.05fr) 1px minmax(0, 1fr)",
            gap: "48px",
            alignItems: "stretch",
          }}
        >
          {/* Left: Layered visual composition (sunken panel, shared canvas texture, Card A, Card B, Chip) */}
          <div
            style={{
              position: "relative",
              width: "100%",
              minHeight: "480px",
              paddingBottom: "24px",
              paddingRight: "24px",
              boxSizing: "border-box",
            }}
          >
            <FeatureVisualLayered
              activeIndex={activeIdx}
              isMobile={false}
            />
          </div>

          {/* 1px vertical divider */}
          <div
            aria-hidden="true"
            style={{
              width: "1px",
              height: "100%",
              background: "rgba(20, 20, 20, 0.15)",
            }}
          />

          {/* Right: Feature copy + checklist + prev/next rolling pager */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
              paddingTop: "8px",
              paddingBottom: "8px",
            }}
          >
            {/* Stacked feature copy container */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", position: "relative" }}>
              {siteContent.features.map((item, i) => (
                <div
                  key={i}
                  ref={(el) => {
                    rightPanelsRef.current[i] = el;
                  }}
                  style={{
                    gridRow: "1 / 2",
                    gridColumn: "1 / 2",
                    opacity: i === 0 ? 1 : 0,
                    visibility: i === 0 ? "visible" : "hidden",
                    pointerEvents: i === 0 ? "auto" : "none",
                  }}
                >
                  <h2
                    id={i === 0 ? "features-title" : undefined}
                    style={{
                      fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                      fontSize: "clamp(26px, 2.6vw, 36px)",
                      fontWeight: 500,
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                      color: "var(--ink)",
                      marginBottom: "16px",
                    }}
                  >
                    {item.title}
                  </h2>

                  <p
                    style={{
                      fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                      fontSize: "15px",
                      fontWeight: 400,
                      lineHeight: 1.65,
                      color: "var(--muted)",
                      marginBottom: "28px",
                    }}
                  >
                    {item.body}
                  </p>

                  {/* Checklist style tasks */}
                  <div
                    style={{
                      borderTop: "1px solid var(--line)",
                      marginBottom: "32px",
                    }}
                  >
                    {item.tasks.map((task, tIdx) => (
                      <div
                        key={tIdx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          padding: "14px 0",
                          borderBottom: "1px solid var(--line)",
                        }}
                      >
                        <span
                          style={{
                            width: "18px",
                            height: "18px",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                          aria-hidden="true"
                        >
                          <StarShape size={8} variant="fill" color="var(--accent-text)" />
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                            fontSize: "15px",
                            fontWeight: 400,
                            color: "var(--ink)",
                          }}
                        >
                          {task}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Prev / Next controls and rolling digits pager */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginTop: "auto",
                paddingTop: "16px",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                  fontSize: "11px",
                  letterSpacing: "0.1em",
                  color: "var(--muted)",
                  visibility: activeIdx < siteContent.features.length - 1 ? "visible" : "hidden",
                }}
              >
                ▶ NEXT FEATURE
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  type="button"
                  disabled={activeIdx === 0}
                  onClick={() => goTo(activeIdx - 1)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "1px solid var(--line)",
                    background: "var(--surface)",
                    cursor: activeIdx === 0 ? "not-allowed" : "pointer",
                    opacity: activeIdx === 0 ? 0.35 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    color: "var(--ink)",
                    transition: "background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (activeIdx !== 0) {
                      e.currentTarget.style.background = "var(--ink)";
                      e.currentTarget.style.color = "var(--bg)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--surface)";
                    e.currentTarget.style.color = "var(--ink)";
                  }}
                  aria-label="Previous feature"
                >
                  ‹
                </button>

                {/* Rolling digits container */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                    fontSize: "12px",
                    color: "var(--muted)",
                    letterSpacing: "0.08em",
                  }}
                >
                  <div
                    style={{
                      display: "inline-block",
                      height: "16px",
                      overflow: "hidden",
                      verticalAlign: "middle",
                    }}
                  >
                    <div
                      ref={digitsRef}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        lineHeight: "16px",
                        transform: `translateY(-${activeIdx * 16}px)`,
                      }}
                    >
                      <span style={{ height: "16px", display: "flex", alignItems: "center" }}>01</span>
                      <span style={{ height: "16px", display: "flex", alignItems: "center" }}>02</span>
                      <span style={{ height: "16px", display: "flex", alignItems: "center" }}>03</span>
                    </div>
                  </div>
                  <span style={{ lineHeight: "16px" }}>&nbsp;/ 03</span>
                </div>

                <button
                  type="button"
                  disabled={activeIdx === siteContent.features.length - 1}
                  onClick={() => goTo(activeIdx + 1)}
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    border: "1px solid var(--line)",
                    background: "var(--surface)",
                    cursor: activeIdx === siteContent.features.length - 1 ? "not-allowed" : "pointer",
                    opacity: activeIdx === siteContent.features.length - 1 ? 0.35 : 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    color: "var(--ink)",
                    transition: "background-color 0.2s ease, color 0.2s ease, opacity 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    if (activeIdx !== siteContent.features.length - 1) {
                      e.currentTarget.style.background = "var(--ink)";
                      e.currentTarget.style.color = "var(--bg)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--surface)";
                    e.currentTarget.style.color = "var(--ink)";
                  }}
                  aria-label="Next feature"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        </div>
      </SectionColumn>
    </SectionFrame>
  );
}
