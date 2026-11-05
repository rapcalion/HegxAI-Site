"use client";

import Link from "next/link";
import { useBooking } from "@/components/ui/BookingProvider";
import { Button } from "@/components/ui/shared";
import LogoMark from "@/components/ui/LogoMark";
import StarShape from "@/components/ui/StarShape";
import Footer from "@/components/sections/Footer";

export default function ThanksPage() {
  const { openBooking, preloadBooking, bookingUrl } = useBooking();

  const handleBookingClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      openBooking();
    }
  };

  return (
    <div
      style={{
        background: "var(--bg, #F4EFE6)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        color: "var(--ink, #141414)",
      }}
    >
      {/* ─── MINIMAL HEADER ─── */}
      <header
        style={{
          borderBottom: "1px solid var(--hairline, #D9D4C9)",
          background: "var(--bg, #F4EFE6)",
          padding: "16px var(--col-pad, 24px)",
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link
            href="/"
            aria-label="HEGXAI - home"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              textDecoration: "none",
            }}
          >
            <LogoMark height={32} />
            <span
              style={{
                fontFamily: "var(--ff-logo, 'Anton', sans-serif)",
                fontSize: "26px",
                lineHeight: 1,
                letterSpacing: "0.02em",
                color: "var(--ink, #141414)",
              }}
            >
              HEGXAI
            </span>
          </Link>

          <Link
            href="/"
            style={{
              fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.04em",
              color: "var(--ink, #141414)",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>←</span> Back to home
          </Link>
        </div>
      </header>

      {/* ─── MAIN THANKS CONTENT ─── */}
      <main
        id="main"
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "64px var(--col-pad, 24px) 80px",
        }}
      >
        <div
          className="thanks-card"
          style={{
            maxWidth: "680px",
            width: "100%",
            background: "var(--surface, #FBF8F2)",
            border: "1px solid rgba(20, 20, 20, 0.12)",
            borderRadius: "var(--r-card, 12px)",
            padding: "48px 40px",
            boxSizing: "border-box",
            position: "relative",
          }}
        >
          {/* Status Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 12px",
              background: "color-mix(in srgb, var(--accent) 12%, transparent)",
              border: "1px solid var(--accent)",
              fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
              fontSize: "11px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--accent-text)",
              marginBottom: "24px",
            }}
          >
            <StarShape size={8} variant="fill" color="var(--accent)" />
            <span>Message sent</span>
          </div>

          <h1
            style={{
              fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 500,
              lineHeight: 1.06,
              letterSpacing: "-0.02em",
              color: "var(--ink, #141414)",
              margin: "0 0 16px",
            }}
          >
            Message received
          </h1>

          <p
            style={{
              fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
              fontSize: "16px",
              lineHeight: 1.6,
              color: "#5f5b52",
              margin: "0 0 36px",
              maxWidth: "52ch",
            }}
          >
            Thank you for reaching out. We received your note and here is what happens next:
          </p>

          {/* 3 Steps List */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              borderTop: "1px solid rgba(20, 20, 20, 0.12)",
              borderBottom: "1px solid rgba(20, 20, 20, 0.12)",
              marginBottom: "36px",
            }}
          >
            {[
              {
                num: "01",
                title: "We read your message",
                desc: "Our engineering team reviews your bottlenecks and tooling stack.",
              },
              {
                num: "02",
                title: "We reply within 1 business day",
                desc: "You get a direct, thoughtful reply with initial ideas and feasibility.",
              },
              {
                num: "03",
                title: "We map what to automate on a short call",
                desc: "A focused conversation to blueprint high-impact agent workflows.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  padding: "18px 0",
                  borderBottom: idx < 2 ? "1px solid rgba(20, 20, 20, 0.08)" : "none",
                  gap: "16px",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <span
                    style={{
                      width: "8px",
                      height: "8px",
                      background: "var(--ink, #141414)",
                      display: "inline-block",
                      marginTop: "7px",
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <div
                      style={{
                        fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                        fontSize: "17px",
                        fontWeight: 500,
                        color: "var(--ink, #141414)",
                        letterSpacing: "-0.01em",
                        marginBottom: "4px",
                      }}
                    >
                      {step.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                        fontSize: "14px",
                        lineHeight: 1.5,
                        color: "#5f5b52",
                      }}
                    >
                      {step.desc}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                    fontSize: "12px",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    color: "var(--muted)",
                    paddingTop: "2px",
                  }}
                >
                  {step.num}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div
            className="thanks-actions"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            <Button
              href={bookingUrl || "#contact"}
              variant="primary"
              style={{ minHeight: "44px", padding: "12px 20px" }}
              onClick={handleBookingClick}
              onPointerEnter={preloadBooking}
              onFocus={preloadBooking}
            >
              Book a call now
            </Button>

            <Link
              href="/"
              style={{
                fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                fontSize: "13px",
                fontWeight: 500,
                letterSpacing: "0.04em",
                color: "var(--ink, #141414)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>←</span> Back to home
            </Link>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 767px) {
          .thanks-card {
            padding: 28px 20px !important;
          }
          .thanks-actions {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .thanks-actions a,
          .thanks-actions button {
            width: 100% !important;
            justify-content: center !important;
            text-align: center !important;
          }
        }
      `}</style>
    </div>
  );
}

