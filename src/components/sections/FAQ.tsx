"use client";
import { useState, useRef, useEffect } from "react";
import { SectionBar, SectionColumn } from "@/components/ui/shared";
import SectionFrame from "@/components/ui/SectionFrame";
import { getContactHref, siteContent, FaqItem } from "@/content/site";

export interface FAQProps {
  items?: FaqItem[];
  sectionNumber?: string;
  id?: string;
}

export default function FAQ({ items, sectionNumber, id = "faq" }: FAQProps = {}) {
  const faqList = items ?? siteContent.faq ?? [];
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [showAllFaqs, setShowAllFaqs] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    if (prefersReduced || isMobile) return;

    const el = sectionRef.current;
    if (!el) return;

    let st: { kill?: () => void } | undefined;
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
              st = gsap.fromTo(
                el,
                { opacity: 0 },
                {
                  opacity: 1,
                  duration: 0.8,
                  ease: "power3.out",
                  scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
                }
              );
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
      st?.kill?.();
    };
  }, []);

  if (faqList.length === 0) return null;

  const toggle = (idx: number) => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    const el = answerRefs.current[idx];

    if (openIdx === idx) {
      if (el && !prefersReduced && !isMobile) {
        import("gsap").then(({ gsap }) => {
          gsap.to(el, { height: 0, opacity: 0, duration: 0.35, ease: "power3.inOut" });
        });
      }
      setOpenIdx(null);
    } else {
      // Close previous
      if (openIdx !== null) {
        const prevEl = answerRefs.current[openIdx];
        if (prevEl && !prefersReduced && !isMobile) {
          import("gsap").then(({ gsap }) => {
            gsap.to(prevEl, { height: 0, opacity: 0, duration: 0.3, ease: "power3.inOut" });
          });
        }
      }
      setOpenIdx(idx);
      if (el && !prefersReduced && !isMobile) {
        import("gsap").then(({ gsap }) => {
          gsap.set(el, { height: "auto", opacity: 1 });
          const h = el.offsetHeight;
          gsap.fromTo(el, { height: 0, opacity: 0 }, { height: h, opacity: 1, duration: 0.45, ease: "power3.out" });
        });
      }
    }
  };

  return (
    <SectionFrame
      id={id}
      ariaLabelledby="faq-title"
      ref={sectionRef}
      theme="cream"
      style={{
        background: "var(--bg)",
      }}
    >
      <SectionColumn style={{ padding: "0 var(--col-pad, 24px)" }}>
        <SectionBar label="FAQ" sectionId="faq" num={sectionNumber} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-start" style={{ marginTop: "var(--heading-content-gap, 40px)" }}>
          {/* Left: heading + intro */}
          <div>
            <h2
              id="faq-title"
              style={{
                fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                fontSize: "clamp(30px, 8.4vw, 56px)",
                fontWeight: 500,
                lineHeight: 1.04,
                letterSpacing: "-0.02em",
                color: "var(--ink)",
              }}
            >
              <span className="reveal-mask" style={{ padding: "4px 0", overflow: "visible" }}>
                <span className="reveal-line" data-reveal-line style={{ lineHeight: 1.15 }}>
                  Frequently asked questions
                </span>
              </span>
            </h2>

            <p
              style={{
                fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                fontSize: "15px",
                fontWeight: 400,
                lineHeight: 1.7,
                color: "var(--muted)",
                marginTop: "20px",
                maxWidth: "360px",
              }}
            >
              <span className="reveal-mask" style={{ padding: "4px 0", overflow: "visible" }}>
                <span className="reveal-line" data-reveal-line style={{ lineHeight: 1.5 }}>
                  Questions about working with us? Here are the ones we hear most
                  often — answered honestly.
                </span>
              </span>
            </p>

            <a
              href={getContactHref()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                minHeight: "44px",
                marginTop: "20px",
                fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "var(--ink)",
                textDecoration: "underline",
                textUnderlineOffset: "4px",
                transition: "gap 0.2s ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.gap = "12px"; }}
              onMouseLeave={e => { e.currentTarget.style.gap = "8px"; }}
            >
              ASK A QUESTION →
            </a>
          </div>

          {/* Right: accordion */}
          <div>
            {faqList.map((faq, i) => {
              const isHiddenOnMobile = !showAllFaqs && i >= 4;
              return (
                <div
                  key={i}
                  className={isHiddenOnMobile ? "hidden md:block" : "block"}
                  style={{ borderBottom: "1px solid var(--line)" }}
                >
                  <button
                    onClick={() => toggle(i)}
                    id={`faq-btn-${i}`}
                    aria-expanded={openIdx === i}
                    aria-controls={`faq-answer-${i}`}
                    style={{
                      width: "100%",
                      minHeight: "52px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 0",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      gap: "16px",
                      textAlign: "left",
                    }}
                  >
                    <span style={{
                      fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                      fontSize: "16px",
                      fontWeight: 500,
                      color: "var(--ink)",
                      lineHeight: 1.35,
                      flex: 1,
                    }}>
                      {faq.q}
                    </span>
                    <span
                      style={{
                        width: "40px",
                        height: "40px",
                        minWidth: "40px",
                        minHeight: "40px",
                        borderRadius: "50%",
                        border: openIdx === i ? "1px solid var(--accent-text)" : "1px solid var(--line)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        fontSize: "18px",
                        color: "var(--ink)",
                        transition: "transform 0.35s cubic-bezier(0.16,1,0.3,1), background 0.2s ease, border-color 0.2s ease",
                        transform: openIdx === i ? "rotate(45deg)" : "rotate(0deg)",
                        background: openIdx === i ? "var(--accent-text)" : "transparent",
                      }}
                      aria-hidden
                    >
                      <span style={{ color: openIdx === i ? "#ffffff" : "var(--ink)", lineHeight: 1 }}>+</span>
                    </span>
                  </button>

                  <div
                    id={`faq-answer-${i}`}
                    ref={(el) => { answerRefs.current[i] = el; }}
                    role="region"
                    aria-labelledby={`faq-btn-${i}`}
                    style={{
                      height: openIdx === i ? "auto" : 0,
                      overflow: "hidden",
                      opacity: openIdx === i ? 1 : 0,
                    }}
                  >
                    <p style={{
                      fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                      fontSize: "15px",
                      fontWeight: 400,
                      lineHeight: 1.7,
                      color: "var(--muted)",
                      paddingBottom: "20px",
                    }}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              );
            })}

            {faqList.length > 4 && (
              <div className="md:hidden pt-3">
                <button
                  type="button"
                  onClick={() => setShowAllFaqs(!showAllFaqs)}
                  aria-expanded={showAllFaqs}
                  style={{
                    background: "none",
                    border: "none",
                    fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                    fontSize: "12px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "var(--ink)",
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "8px 0",
                  }}
                >
                  <span>{showAllFaqs ? "Show less" : "Show more"}</span>
                  <span>{showAllFaqs ? "↑" : "↓"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </SectionColumn>
    </SectionFrame>
  );
}
