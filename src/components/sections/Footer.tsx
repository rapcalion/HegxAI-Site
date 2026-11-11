"use client";

import Link from "next/link";
import AsciiHalftoneCanvas from "@/components/ui/AsciiHalftoneCanvas";
import { siteContent } from "@/content/site";
import LogoMark from "@/components/ui/LogoMark";
import StarShape from "@/components/ui/StarShape";

const CURRENT_YEAR = 2026;

const PAGES_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Services", href: "/services" },
  { label: "Process", href: "/#process" },
  { label: "FAQ", href: "/#faq" },
];

export default function Footer() {
  const socials = siteContent.socials ?? [];

  return (
    <footer
      className="site-footer"
      style={{
        background: "var(--ink-2)",
        borderTop: "2px solid var(--accent)",
        color: "var(--bg, #F4EFE6)",
        position: "relative",
        overflow: "hidden",
        width: "100%",
        padding: "64px 0 36px",
      }}
    >
      {/* ─── MAIN FOOTER CONTENT CONTAINER (Same container / --col-pad as Nav and Hero) ─── */}
      <div
        style={{
          maxWidth: "1320px",
          width: "100%",
          margin: "0 auto",
          padding: "0 var(--col-pad, 24px)",
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* ─── 2. COLUMNS: Brand line, Pages, Contact ─── */}
        <div className="footer-columns-grid">
          {/* Brand Column */}
          <div className="footer-brand-column">
            <Link
              href="/"
              aria-label="HEGXAI - home"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "10px",
                textDecoration: "none",
                marginBottom: "14px",
              }}
            >
              <LogoMark height={36} isDark={true} aria-hidden={true} />
              {siteContent.logo?.showWordmark && (
                <span
                  style={{
                    fontFamily: "var(--ff-logo, 'Anton', sans-serif)",
                    fontSize: "26px",
                    letterSpacing: "0.04em",
                    color: "#F4EFE6",
                    display: "block",
                    textTransform: "uppercase",
                  }}
                >
                  HEGXAI
                </span>
              )}
              {!siteContent.logo?.showWordmark && (
                <span style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", border: 0 }}>
                  HEGXAI - home
                </span>
              )}
            </Link>
            <p
              style={{
                fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: 1.55,
                color: "rgba(244, 239, 230, 0.85)",
                maxWidth: "320px",
                margin: 0,
              }}
            >
              {siteContent.hero.subtitle}
            </p>
          </div>

          {/* Pages Column */}
          <div className="footer-nav-column">
            <span
              className="footer-column-label"
              style={{
                fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--accent-on-dark)",
                display: "block",
                marginBottom: "18px",
              }}
            >
              PAGES
            </span>
            <nav aria-label="Pages navigation" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {PAGES_LINKS.map((link) => (
                <Link key={link.label} href={link.href} className="footer-nav-link">
                  <span>{link.label}</span>
                  <span className="link-arrow" aria-hidden="true">→</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Column: Only renders existing contact items (no invented domain/email) */}
          <div className="footer-nav-column">
            <span
              className="footer-column-label"
              style={{
                fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                fontSize: "11px",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--accent-on-dark)",
                display: "block",
                marginBottom: "18px",
              }}
            >
              CONTACT
            </span>
            <nav aria-label="Contact navigation" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link href="/#contact" className="footer-nav-link">
                <span>Contact Us</span>
                <span className="link-arrow" aria-hidden="true">→</span>
              </Link>

              {siteContent.contact.email ? (
                <a href={`mailto:${siteContent.contact.email}`} className="footer-nav-link">
                  <span>{siteContent.contact.email}</span>
                  <span className="link-arrow" aria-hidden="true">→</span>
                </a>
              ) : null}

              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link"
                >
                  <span>{s.label}</span>
                  <span className="link-arrow" aria-hidden="true">→</span>
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* ─── 3. GIANT WORDMARK WITH ACCENT ASCII HALFTONE TEXTURE & GIANT ROTATING STAR BEHIND IT ─── */}
        <div
          className="footer-wordmark-container"
          style={{
            position: "relative",
            width: "100%",
            padding: "48px 0 28px",
            overflow: "hidden",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {/* Giant outline star (~70% of container width) behind wordmark with 120s rotation */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "min(70%, 750px)",
              aspectRatio: "1/1",
              pointerEvents: "none",
              zIndex: 0,
            }}
          >
            <StarShape
              size="100%"
              strokeWidth={1}
              variant="outline"
              color="var(--accent)"
              opacity={0.35}
              className="spin-footer-star"
              style={{ width: "100%", height: "100%" }}
            />
          </div>

          {/* IO-gated ASCII/halftone glyph texture in accent at ~10-14% opacity */}
          <AsciiHalftoneCanvas
            theme="dark"
            density="sparse"
            interactive={true}
            color="rgba(125, 147, 255, 0.12)"
            accentColor="rgba(125, 147, 255, 0.14)"
            wrapperStyle={{
              position: "absolute",
              inset: 0,
              zIndex: 1,
              opacity: 0.9,
              pointerEvents: "none",
            }}
          />

          {/* Giant HEGXAI in Anton with dark fill (#171A2E) and 1px accent outline (45% opacity) */}
          <div style={{ position: "relative", zIndex: 2, width: "100%" }}>
            <svg
              viewBox="0 0 760 170"
              width="100%"
              style={{ display: "block", height: "auto", overflow: "visible" }}
              aria-hidden="true"
            >
              <text
                x="380"
                y="142"
                textAnchor="middle"
                fill="#171A2E"
                stroke="rgba(81, 112, 255, 0.45)"
                strokeWidth="1"
                style={{
                  fontFamily: "var(--ff-logo, 'Anton', sans-serif)",
                  fontSize: "170px",
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  WebkitTextStroke: "1px rgba(81, 112, 255, 0.45)",
                }}
              >
                HEGXAI
              </text>
            </svg>
          </div>
        </div>

        {/* ─── 4. BOTTOM ROW: Thin 1px cream@15% divider, Copyright, Legal, Back to top ─── */}
        <div
          className="footer-bottom-row"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "18px",
            paddingTop: "24px",
            borderTop: "1px solid rgba(244, 239, 230, 0.15)",
          }}
        >
          {/* Left: Copyright & Legal links */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "16px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                fontSize: "12px",
                color: "rgba(244, 239, 230, 0.7)",
                letterSpacing: "0.04em",
              }}
            >
              © {CURRENT_YEAR} HEGXAI. All rights reserved.
            </span>

            <span
              aria-hidden="true"
              style={{ color: "rgba(244, 239, 230, 0.3)", fontSize: "12px" }}
            >
              •
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <Link
                href="/privacy"
                className="footer-legal-link"
                style={{
                  fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                  fontSize: "12px",
                  color: "rgba(244, 239, 230, 0.7)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                Privacy
              </Link>
              <span
                aria-hidden="true"
                style={{ color: "rgba(244, 239, 230, 0.3)", fontSize: "12px" }}
              >
                /
              </span>
              <Link
                href="/terms"
                className="footer-legal-link"
                style={{
                  fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                  fontSize: "12px",
                  color: "rgba(244, 239, 230, 0.7)",
                  textDecoration: "none",
                  transition: "color 0.2s ease",
                }}
              >
                Terms
              </Link>
            </div>
          </div>

          {/* Right: Outlined Button: cream text, 1px --accent border, hover: --accent-strong fill + white text */}
          <button
            type="button"
            className="footer-back-to-top btn-mobile-full"
            onClick={(e) => {
              e.preventDefault();
              const lenis = (window as unknown as { __lenis?: { scrollTo: (t: number) => void } }).__lenis;
              if (lenis) lenis.scrollTo(0);
              else window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <span>Back to top</span>
            <span aria-hidden="true">↑</span>
          </button>
        </div>
      </div>

      <style>{`
        .footer-columns-grid {
          display: grid;
          grid-template-columns: minmax(280px, 360px) 1fr 1fr;
          gap: 48px;
          align-items: start;
        }
        .footer-nav-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-family: var(--ff-body, 'DM Sans', sans-serif);
          fontSize: 15px;
          font-weight: 400;
          color: rgba(244, 239, 230, 0.85);
          text-decoration: none;
          transition: color 0.2s ease, transform 0.2s ease;
          width: fit-content;
        }
        .footer-nav-link:hover {
          color: var(--accent-on-dark) !important;
        }
        .footer-nav-link .link-arrow {
          opacity: 0;
          transform: translateX(-4px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          font-size: 13px;
          line-height: 1;
          color: var(--accent-on-dark);
        }
        .footer-nav-link:hover .link-arrow {
          opacity: 1;
          transform: translateX(0);
        }
        .footer-legal-link:hover {
          color: var(--accent-on-dark) !important;
        }
        .footer-back-to-top {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background: transparent;
          border: 1px solid var(--accent);
          color: var(--bg, #F4EFE6);
          font-family: var(--ff-display, 'Inter Tight', sans-serif);
          font-size: 12.5px;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          min-height: 42px;
          padding: 10px 20px;
          border-radius: 0px;
          cursor: pointer;
          transition: background-color 0.25s ease, color 0.25s ease, border-color 0.25s ease;
        }
        .footer-back-to-top:hover {
          background: var(--accent-strong) !important;
          border-color: var(--accent-strong) !important;
          color: #ffffff !important;
        }
        @media (max-width: 900px) {
          .footer-columns-grid {
            grid-template-columns: 1fr 1fr;
            gap: 36px;
          }
          .footer-brand-column {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 767px) {
          .footer-columns-grid {
            display: flex !important;
            flex-direction: column !important;
            gap: 32px !important;
          }
          .footer-column-label {
            font-size: 12px !important;
          }
          .footer-nav-link {
            font-size: 16px !important;
          }
          .footer-wordmark-container {
            padding: 32px 0 20px !important;
          }
          .footer-bottom-row {
            flex-direction: column-reverse !important;
            align-items: stretch !important;
            gap: 20px !important;
          }
          .footer-bottom-row .btn-mobile-full {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </footer>
  );
}
