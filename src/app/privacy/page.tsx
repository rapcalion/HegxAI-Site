import type { Metadata } from "next";
import Link from "next/link";
import { siteContent } from "@/content/site";
import { SITE_URL } from "@/lib/site-url";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: siteContent.seo.pages.privacy.title,
  description: siteContent.seo.pages.privacy.description,
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    title: siteContent.seo.pages.privacy.title,
    description: siteContent.seo.pages.privacy.description,
    url: `${SITE_URL}/privacy`,
    siteName: siteContent.seo.siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteContent.seo.pages.privacy.title,
    description: siteContent.seo.pages.privacy.description,
  },
};

export default function PrivacyPage() {
  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Top minimal header */}
      <header
        style={{
          borderBottom: "1px solid var(--line)",
          background: "var(--bg)",
          padding: "20px var(--col-pad, 24px)",
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
            style={{
              fontFamily: "var(--ff-logo, 'Anton', sans-serif)",
              fontSize: "24px",
              letterSpacing: "0.04em",
              color: "var(--ink)",
              textDecoration: "none",
            }}
          >
            HEGXAI
          </Link>
          <Link
            href="/"
            style={{
              fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
              fontSize: "12px",
              color: "var(--muted)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <span>←</span> Back to Home
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main
        id="main"
        style={{
          flex: 1,
          maxWidth: "800px",
          width: "100%",
          margin: "0 auto",
          padding: "64px var(--col-pad, 24px) 96px",
        }}
      >
        {/* Draft Notice */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            background: "color-mix(in srgb, var(--accent) 12%, transparent)",
            border: "1px solid var(--accent)",
            color: "var(--ink)",
            padding: "6px 14px",
            borderRadius: "4px",
            fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
            fontSize: "12px",
            fontWeight: 500,
            marginBottom: "24px",
            letterSpacing: "0.04em",
          }}
        >
          <span style={{ color: "var(--accent-text)" }}>●</span> Draft — to be finalised
        </div>

        <h1
          style={{
            fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
            fontSize: "clamp(32px, 4vw, 48px)",
            fontWeight: 500,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: "var(--ink)",
            marginBottom: "12px",
          }}
        >
          Privacy Policy
        </h1>

        <p
          style={{
            fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
            fontSize: "12px",
            color: "var(--muted)",
            marginBottom: "40px",
          }}
        >
          Last updated: October 2026
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "36px",
            fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
            fontSize: "16px",
            lineHeight: 1.65,
            color: "var(--ink)",
          }}
        >
          <section>
            <h2
              style={{
                fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                fontSize: "22px",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
                marginBottom: "12px",
              }}
            >
              1. Overview
            </h2>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              HEGXAI builds intelligent AI agents and automated workflows for businesses. We respect
              your privacy and are committed to handling any information you share with us
              transparently and securely.
            </p>
          </section>

          <section>
            <h2
              style={{
                fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                fontSize: "22px",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
                marginBottom: "12px",
              }}
            >
              2. Data We Collect
            </h2>
            <p style={{ margin: "0 0 12px", color: "var(--muted)" }}>
              We only collect information that you explicitly submit through our contact form:
            </p>
            <ul
              style={{
                margin: 0,
                paddingLeft: "24px",
                color: "var(--muted)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <li>
                <strong style={{ color: "var(--ink)" }}>Name:</strong> To identify you in correspondence.
              </li>
              <li>
                <strong style={{ color: "var(--ink)" }}>Work Email:</strong> To respond to your inquiry and discuss automation possibilities.
              </li>
              <li>
                <strong style={{ color: "var(--ink)" }}>Company:</strong> Optional context about your business.
              </li>
              <li>
                <strong style={{ color: "var(--ink)" }}>Message:</strong> Details you provide regarding repetitive tasks, workflow bottlenecks, or project goals.
              </li>
            </ul>
          </section>

          <section>
            <h2
              style={{
                fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                fontSize: "22px",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
                marginBottom: "12px",
              }}
            >
              3. How We Use Your Data
            </h2>
            <p style={{ margin: "0 0 12px", color: "var(--muted)" }}>
              The data you submit through our contact form is used strictly to reply to you and assess
              how we can assist with your automation requirements:
            </p>
            <ul
              style={{
                margin: 0,
                paddingLeft: "24px",
                color: "var(--muted)",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <li>To respond to your questions and consultation requests.</li>
              <li>To evaluate potential project scopes and automation maps.</li>
              <li>To schedule consultation calls when you request a booking.</li>
            </ul>
          </section>

          <section>
            <h2
              style={{
                fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                fontSize: "22px",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
                marginBottom: "12px",
              }}
            >
              4. Data Protection & No Selling
            </h2>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              We do not sell, rent, lease, or monetize your contact information or submitted messages to
              any third party under any circumstances. Information is used exclusively by HEGXAI for direct
              communication.
            </p>
          </section>

          <section>
            <h2
              style={{
                fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                fontSize: "22px",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: "var(--ink)",
                marginBottom: "12px",
              }}
            >
              5. Contact
            </h2>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              If you have any questions about this privacy draft or wish to request the removal of your
              submitted information, please reach out via our contact form at{" "}
              <Link href="/#contact" style={{ color: "var(--ink)", textDecoration: "underline" }}>
                hegxai.com/#contact
              </Link>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
