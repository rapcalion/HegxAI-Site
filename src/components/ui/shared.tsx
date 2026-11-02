"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { getSectionNumber } from "@/content/site";
import StarShape from "@/components/ui/StarShape";

gsap.registerPlugin(ScrollTrigger);
export interface SectionBarProps {
  label: string;
  num?: string;
  number?: string;
  sectionId?: string;
  theme?: "light" | "dark";
  showLine?: boolean;
  showNodes?: boolean;
  headingId?: string;
  inset?: number | string;
  height?: number | string;
  padding?: string;
  marginBottom?: number | string;
  style?: React.CSSProperties;
}

export function SectionBar({
  label,
  headingId,
  num,
  number,
  sectionId,
  theme = "light",
  showLine,
  showNodes = false,
  inset = 0,
  height = 34,
  padding = "0 12px",
  marginBottom,
  style,
}: SectionBarProps) {
  const autoNum = sectionId ? getSectionNumber(sectionId) : "";
  const displayNum = num || number || autoNum;
  const barRef = useRef<HTMLDivElement>(null);
  const isDark = theme === "dark";
  const shouldShowLine = showLine ?? false;

  const insetVal = typeof inset === "number" ? `${inset}px` : inset;
  const heightVal = typeof height === "number" ? `${height}px` : height;
  const mbVal = marginBottom !== undefined ? (typeof marginBottom === "number" ? `${marginBottom}px` : marginBottom) : "var(--heading-content-gap, 40px)";

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      el.style.clipPath = "inset(0 0% 0 0)";
      return;
    }

    gsap.fromTo(
      el,
      { clipPath: "inset(0 100% 0 0)" },
      {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <div style={{ position: "relative", width: "100%", marginTop: shouldShowLine ? 0 : "12px", marginBottom: mbVal, ...style }}>
      {/* Full-width thin horizontal line with optional square nodes at ends */}
      {shouldShowLine && (
        <div
          className="section-bar-line"
          style={{
            position: "relative",
            width: "100%",
            height: "1px",
            background: isDark ? "rgba(255,255,255,0.18)" : "rgba(20,20,20,0.25)",
            marginBottom: "12px",
          }}
        >
          {showNodes && (
            <>
              {/* Left node (at x=40px from viewport edge desktop, 16px mobile) */}
              <span
                style={{
                  position: "absolute",
                  left: "var(--section-node-edge, 40px)",
                  top: "-4.5px",
                  width: "10px",
                  height: "10px",
                  background: isDark ? "#ffffff" : "#2b2b2b",
                }}
              />
              {/* Right node (at x=40px from viewport edge desktop, 16px mobile) */}
              <span
                style={{
                  position: "absolute",
                  right: "var(--section-node-edge, 40px)",
                  top: "-4.5px",
                  width: "10px",
                  height: "10px",
                  background: isDark ? "#ffffff" : "#2b2b2b",
                }}
              />
            </>
          )}
        </div>
      )}

      {/* Section black bar */}
      <div
        ref={barRef}
        className={`section-bar-inner ${insetVal !== "0px" && insetVal !== "0" ? "section-bar-inset-custom" : ""}`}
        style={{
          width: insetVal !== "0px" && insetVal !== "0" ? `calc(100% - (${insetVal} * 2))` : "100%",
          margin: insetVal !== "0px" && insetVal !== "0" ? `0 ${insetVal}` : "0",
          height: `var(--section-bar-h, ${heightVal})`,
          background: isDark ? "rgba(255,255,255,0.08)" : "#0f0f0f",
          border: isDark ? "1px solid rgba(255,255,255,0.12)" : "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding,
          clipPath: "inset(0 100% 0 0)",
          willChange: "clip-path",
        }}
      >
        <span
          id={headingId}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
            fontWeight: 500,
            fontSize: "var(--section-bar-fz, 13px)",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#ffffff",
          }}
        >
          <StarShape size={10} variant="fill" color="var(--bg)" />
          {label}
        </span>
        {displayNum && (
          <span
            style={{
              fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
              fontWeight: 500,
              fontSize: "var(--section-bar-fz, 13px)",
              letterSpacing: "0.04em",
              color: "#ffffff",
            }}
          >
            {displayNum}
          </span>
        )}
      </div>
    </div>
  );
}

// Keep SectionLabel backwards compatibility mapping to SectionBar
export const SectionLabel = SectionBar;

export function SectionColumn({
  children,
  className = "",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={className}
      style={{
        maxWidth: "1320px",
        margin: "0 auto",
        position: "relative",
        padding: "0 var(--col-pad, 24px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [delay]);

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

export interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "inverse" | "accent";
  size?: "sm" | "md";
  brackets?: boolean;
  arrow?: string | false;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  onPointerEnter?: (e: React.PointerEvent<HTMLElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
  style?: React.CSSProperties;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  id?: string;
}

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  brackets = false,
  arrow = "→",
  className = "",
  onClick,
  onPointerEnter,
  onFocus,
  style: propStyle,
  type,
  disabled = false,
  id,
}: ButtonProps) {
  const v = variant;

  const isSmall = size === "sm";

  const normalTextColor =
    propStyle?.color ||
    (v === "primary" ? "var(--bg, #F4EFE6)" : v === "accent" ? "#ffffff" : "#141414");

  const handleMouseEnter = (e: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>) => {
    if (disabled) return;
    const el = e.currentTarget;
    const wipe = el.querySelector(".btn-wipe") as HTMLElement;
    const arrowEl = el.querySelector(".btn-arrow") as HTMLElement;
    const text = el.querySelector(".btn-text") as HTMLElement;

    if (wipe) wipe.style.transform = "translateY(0%)";
    if (arrowEl) {
      arrowEl.style.transform = arrow === "↑" ? "translateY(-3px)" : "translateX(4px)";
      if (v === "secondary" || v === "inverse" || v === "accent") arrowEl.style.color = "#ffffff";
    }
    if (text) {
      if (v === "secondary" || v === "inverse" || v === "accent") text.style.color = "#ffffff";
    }

    if (brackets) {
      const btl = el.querySelector(".bracket-tl") as HTMLElement;
      const btr = el.querySelector(".bracket-tr") as HTMLElement;
      const bbl = el.querySelector(".bracket-bl") as HTMLElement;
      const bbr = el.querySelector(".bracket-br") as HTMLElement;
      if (btl) btl.style.transform = "translate(-5px, -5px)";
      if (btr) btr.style.transform = "translate(5px, -5px)";
      if (bbl) bbl.style.transform = "translate(-5px, 5px)";
      if (bbr) bbr.style.transform = "translate(5px, 5px)";
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement> | React.FocusEvent<HTMLElement>) => {
    if (disabled) return;
    const el = e.currentTarget;
    const wipe = el.querySelector(".btn-wipe") as HTMLElement;
    const arrowEl = el.querySelector(".btn-arrow") as HTMLElement;
    const text = el.querySelector(".btn-text") as HTMLElement;

    if (wipe) wipe.style.transform = "translateY(100%)";
    if (arrowEl) {
      arrowEl.style.transform = "translate(0, 0)";
      arrowEl.style.color = normalTextColor;
    }
    if (text) {
      text.style.color = normalTextColor;
    }

    if (brackets) {
      const btl = el.querySelector(".bracket-tl") as HTMLElement;
      const btr = el.querySelector(".bracket-tr") as HTMLElement;
      const bbl = el.querySelector(".bracket-bl") as HTMLElement;
      const bbr = el.querySelector(".bracket-br") as HTMLElement;
      if (btl) btl.style.transform = "translate(-2px, -2px)";
      if (btr) btr.style.transform = "translate(2px, -2px)";
      if (bbl) bbl.style.transform = "translate(-2px, 2px)";
      if (bbr) bbr.style.transform = "translate(2px, 2px)";
    }
  };

  const bgDefault =
    v === "primary"
      ? "var(--ink)"
      : v === "inverse"
      ? "var(--bg)"
      : v === "accent"
      ? "var(--accent-strong)"
      : "transparent";

  const textColorDefault = normalTextColor;

  const borderColorDefault =
    v === "primary"
      ? "var(--ink)"
      : v === "inverse"
      ? "var(--bg)"
      : v === "accent"
      ? "var(--accent-strong)"
      : "var(--ink)";

  const wipeBg =
    v === "primary"
      ? "var(--accent-strong)"
      : v === "inverse"
      ? "var(--accent)"
      : v === "accent"
      ? "var(--accent-deep)"
      : "var(--ink)";

  const commonStyle: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: isSmall ? "10px 18px" : "16px 24px",
    borderRadius: "0px",
    background: bgDefault,
    border: `1px solid ${borderColorDefault}`,
    color: textColorDefault,
    fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
    fontSize: "13px",
    fontWeight: 500,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    textDecoration: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.65 : 1,
    whiteSpace: "nowrap",
    overflow: brackets ? "visible" : "hidden",
    transition: "border-color 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease",
    ...propStyle,
  };

  const innerContent = (
    <>
      {/* Ink Wipe from bottom (0.35s) wrapped in overflow:hidden container so it never escapes */}
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 0,
          borderRadius: "inherit",
        }}
      >
        <span
          className="btn-wipe"
          style={{
            position: "absolute",
            inset: 0,
            background: wipeBg,
            transform: "translateY(100%)",
            transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
      </span>

      {/* Button Content */}
      <span
        className="btn-text"
        style={{
          position: "relative",
          zIndex: 1,
          color: normalTextColor,
          transition: "color 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {children}
      </span>

      {arrow !== false && (
        <span
          className="btn-arrow"
          aria-hidden="true"
          style={{
            position: "relative",
            zIndex: 1,
            display: "inline-block",
            color: normalTextColor,
            transition:
              "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), color 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
            lineHeight: 1,
          }}
        >
          {arrow}
        </span>
      )}

      {/* 4 Corner Brackets (Hero CTA) */}
      {brackets && (
        <>
          <span
            className="bracket-corner bracket-tl"
            style={{
              position: "absolute",
              top: "-2px",
              left: "-2px",
              width: "10px",
              height: "10px",
              borderTop: "1.5px solid var(--accent-text)",
              borderLeft: "1.5px solid var(--accent-text)",
              pointerEvents: "none",
              transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: "translate(-2px, -2px)",
            }}
          />
          <span
            className="bracket-corner bracket-tr"
            style={{
              position: "absolute",
              top: "-2px",
              right: "-2px",
              width: "10px",
              height: "10px",
              borderTop: "1.5px solid var(--accent-text)",
              borderRight: "1.5px solid var(--accent-text)",
              pointerEvents: "none",
              transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: "translate(2px, -2px)",
            }}
          />
          <span
            className="bracket-corner bracket-bl"
            style={{
              position: "absolute",
              bottom: "-2px",
              left: "-2px",
              width: "10px",
              height: "10px",
              borderBottom: "1.5px solid var(--accent-text)",
              borderLeft: "1.5px solid var(--accent-text)",
              pointerEvents: "none",
              transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: "translate(-2px, 2px)",
            }}
          />
          <span
            className="bracket-corner bracket-br"
            style={{
              position: "absolute",
              bottom: "-2px",
              right: "-2px",
              width: "10px",
              height: "10px",
              borderBottom: "1.5px solid var(--accent-text)",
              borderRight: "1.5px solid var(--accent-text)",
              pointerEvents: "none",
              transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: "translate(2px, 2px)",
            }}
          />
        </>
      )}
    </>
  );

  if (type || !href) {
    return (
      <button
        id={id}
        type={type || "button"}
        disabled={disabled}
        onClick={onClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={(e) => {
          handleMouseEnter(e);
          onFocus?.(e);
        }}
        onBlur={handleMouseLeave}
        onPointerEnter={onPointerEnter}
        data-variant={v}
        className={`btn-square ${className}`}
        style={commonStyle}
      >
        {innerContent}
      </button>
    );
  }

  return (
    <a
      id={id}
      href={href}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={(e) => {
        handleMouseEnter(e);
        onFocus?.(e);
      }}
      onBlur={handleMouseLeave}
      onPointerEnter={onPointerEnter}
      data-variant={v}
      className={`btn-square ${className}`}
      style={commonStyle}
    >
      {innerContent}
    </a>
  );
}


// Keep PillButton mapped to the new square Button
export const PillButton = Button;

export function StickyTag({
  href = "#contact",
  label = "Book a free audit",
  className = "",
  style,
  tagRef,
  onClick,
  onPointerEnter,
  onFocus,
}: {
  href?: string;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  tagRef?: React.Ref<HTMLAnchorElement>;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  onPointerEnter?: (e: React.PointerEvent<HTMLAnchorElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      ref={tagRef}
      href={href}
      aria-label={label || "Book a free audit"}
      onClick={onClick}
      onPointerEnter={onPointerEnter}
      onFocus={onFocus}
      className={`about-accent-tag ${className}`}
      style={{
        display: "block",
        position: "relative",
        width: "114px",
        height: "144px",
        background: "var(--accent-strong)",
        color: "#ffffff",
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 20px 100%, 0 calc(100% - 20px))",
        textDecoration: "none",
        cursor: "pointer",
        flexShrink: 0,
        boxShadow: "0 4px 16px color-mix(in srgb, var(--accent-strong) 30%, transparent)",
        ...style,
      }}
    >
      {/* Top-left: 10px white square at (12px, 20px) */}
      <span
        style={{
          position: "absolute",
          left: "12px",
          top: "20px",
          width: "10px",
          height: "10px",
          background: "#ffffff",
        }}
      />

      {/* 3 thin chevrons ">>>" */}
      <div
        className="about-chevrons"
        style={{
          position: "absolute",
          left: "30px",
          top: "18px",
          display: "flex",
          alignItems: "center",
          gap: "3px",
        }}
      >
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="chevron-arrow">
          <path d="M1.5 1.5L6.5 7L1.5 12.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="chevron-arrow">
          <path d="M1.5 1.5L6.5 7L1.5 12.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="chevron-arrow">
          <path d="M1.5 1.5L6.5 7L1.5 12.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Bottom-right text: Inter Tight 600 14px uppercase: "BOOK A" / "FREE AUDIT" */}
      <div
        style={{
          position: "absolute",
          right: "12px",
          bottom: "16px",
          textAlign: "right",
          fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
          fontWeight: 600,
          fontSize: "14px",
          lineHeight: 1.15,
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          color: "#ffffff",
        }}
      >
        {label === "Book a free audit" ? (
          <>
            BOOK A<br />FREE AUDIT
          </>
        ) : (
          label
        )}
      </div>
    </a>
  );
}

export const AccentTag = StickyTag;
