import type { Metadata } from "next";
import Link from "next/link";
import { siteContent } from "@/content/site";
import { SITE_URL } from "@/lib/site-url";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: siteContent.seo.pages.terms.title,
  description: siteContent.seo.pages.terms.description,
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: siteContent.seo.pages.terms.title,
    description: siteContent.seo.pages.terms.description,
    url: `${SITE_URL}/terms`,
    siteName: siteContent.seo.siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteContent.seo.pages.terms.title,
    description: siteContent.seo.pages.terms.description,
  },
};

export default function TermsPage() {
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
          Terms of Service
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
              1. Acceptance of Terms
            </h2>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              By accessing and using this website, you agree to these Terms of Service. If you do not
              agree with any part of these terms, please discontinue using this site.
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
              2. Informational Purposes & Services
            </h2>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              The content on this website is provided for informational purposes describing HEGXAI&apos;s
              capabilities in custom AI agents, workflow automation, and systems integration. Submitting
              a contact inquiry or requesting an audit call does not create a binding service agreement.
              All commercial engagements are formalized via mutual written agreement.
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
              3. Intellectual Property
            </h2>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              All original visual designs, logos, software workflows, text, and code presented on this
              site are the property of HEGXAI or its licensors. You may not reproduce, redistribute,
              or exploit any assets from this website without explicit prior consent.
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
              4. Acceptable Use
            </h2>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              You agree to use this site only for lawful purposes. You shall not submit false contact
              information, spam, malicious code, or automated requests designed to disrupt or impair our
              services or infrastructure.
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
              5. Disclaimer & Limitation of Liability
            </h2>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              This site and all materials are provided &ldquo;as is&rdquo; without warranties of any
              kind, express or implied. HEGXAI shall not be liable for any indirect or consequential
              damages resulting from the use or inability to use this site.
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
              6. Contact
            </h2>
            <p style={{ margin: 0, color: "var(--muted)" }}>
              If you have any questions about these terms, please contact us via our website at{" "}
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
