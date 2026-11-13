import type { Metadata } from "next";
import Link from "next/link";
import LogoMark from "@/components/ui/LogoMark";
import StarShape from "@/components/ui/StarShape";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist or has been moved.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NotFound() {
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
      {/* Minimal Header */}
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
            <span>←</span> Back to Home
          </Link>
        </div>
      </header>

      {/* Main 404 Content */}
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
          style={{
            maxWidth: "600px",
            width: "100%",
            margin: "0 auto",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* Status Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 14px",
              background: "color-mix(in srgb, var(--accent) 12%, transparent)",
              border: "1px solid var(--accent)",
              fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--accent-text)",
              marginBottom: "24px",
              borderRadius: "4px",
            }}
          >
            <StarShape size={8} variant="fill" color="var(--accent)" />
            <span>404 ERROR</span>
          </div>

          <h1
            style={{
              fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 500,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--ink, #141414)",
              margin: "0 0 16px",
            }}
          >
            Page Not Found
          </h1>

          <p
            style={{
              fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
              fontSize: "16px",
              lineHeight: 1.6,
              color: "var(--muted, rgba(20, 20, 20, 0.7))",
              maxWidth: "440px",
              margin: "0 0 32px",
            }}
          >
            The page you are looking for does not exist, has been removed, or is temporarily unavailable.
          </p>

          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "14px 28px",
              background: "var(--ink, #141414)",
              color: "#ffffff",
              borderRadius: "4px",
              fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
              fontSize: "14px",
              fontWeight: 500,
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            <span>←</span> Back to Home
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

