import type { Metadata } from "next";
import Link from "next/link";
import { siteContent } from "@/content/site";
import { SITE_URL } from "@/lib/site-url";
import JsonLd from "@/components/seo/JsonLd";
import Nav from "@/components/sections/Nav";
import Footer from "@/components/sections/Footer";
import SectionFrame from "@/components/ui/SectionFrame";
import { SectionBar, SectionColumn } from "@/components/ui/shared";
import StarShape from "@/components/ui/StarShape";
import GlyphField from "@/components/hero/GlyphField";
import SmoothScrollProvider from "@/lib/SmoothScrollProvider";
import BookingAuditButton from "@/components/services/BookingAuditButton";
import ServiceMockPanel from "@/components/services/ServiceMockPanel";
import ProcessSteps from "@/components/services/ProcessSteps";

export const metadata: Metadata = {
  title: siteContent.seo.pages.services.title,
  description: siteContent.seo.pages.services.description,
  alternates: {
    canonical: "/services",
  },
  openGraph: {
    title: siteContent.seo.pages.services.title,
    description: siteContent.seo.pages.services.description,
    url: `${SITE_URL}/services`,
    siteName: siteContent.seo.siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteContent.seo.pages.services.title,
    description: siteContent.seo.pages.services.description,
  },
};

const servicesJsonLd =
  siteContent.servicesPage.services && siteContent.servicesPage.services.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: "HEGXAI AI Automation Services",
        itemListElement: siteContent.servicesPage.services.map((service, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "Service",
            name: service.title,
            description: service.description,
            provider: {
              "@type": "Organization",
              name: siteContent.seo.siteName,
              url: SITE_URL,
            },
          },
        })),
      }
    : null;

export default function ServicesPage() {
  const { hero, services, benefits, process } = siteContent.servicesPage;
  const founderPhoto = siteContent.founder.photo;

  return (
    <SmoothScrollProvider>
      {servicesJsonLd && <JsonLd data={servicesJsonLd} />}
      <Nav />

      <main id="main">
        {/* 1. HERO + SERVICES GRID SECTION (SERVICES / 001) */}
        <SectionFrame
          id="services"
          ariaLabelledby="services-hero-title"
          theme="cream"
          style={{ background: "var(--bg, #F4EFE6)" }}
        >
          <SectionColumn style={{ padding: "0 var(--col-pad, 24px)" }}>
            <SectionBar label="SERVICES" num="001" headingId="services-bar-title" />

            {/* 1A. Hero Content */}
            <div style={{ maxWidth: "880px", marginTop: "var(--heading-content-gap, 40px)" }}>
              <span
                style={{
                  fontFamily: "var(--ff-mono, monospace)",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--accent-text)",
                  display: "inline-block",
                  marginBottom: "16px",
                }}
              >
                {"// SERVICES"}
              </span>

              <h1
                id="services-hero-title"
                style={{
                  fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                  fontSize: "clamp(38px, 6vw, 68px)",
                  fontWeight: 500,
                  lineHeight: 1.02,
                  letterSpacing: "-0.03em",
                  color: "var(--ink)",
                  margin: "0 0 20px",
                  maxWidth: "18ch",
                }}
              >
                {hero.title}
              </h1>

              <p
                style={{
                  fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                  fontSize: "clamp(18px, 1.8vw, 20px)",
                  fontWeight: 400,
                  lineHeight: 1.55,
                  color: "rgba(20, 20, 20, 0.72)",
                  maxWidth: "54ch",
                  margin: "0 0 32px",
                }}
              >
                {hero.subtext}
              </p>

              <div>
                <BookingAuditButton variant="primary">
                  {hero.cta}
                </BookingAuditButton>
              </div>
            </div>

            {/* 1B. Wide Visual Band Reusing GlyphField with 2 Chips */}
            <div style={{ marginTop: "48px", marginBottom: "48px" }}>
              <GlyphField
                chipCount={2}
                desktopHeight={280}
                tabletHeight={220}
                mobileHeight={180}
                marginTop={0}
              />
            </div>

            {/* 1C. Services Grid */}
            <h2 className="sr-only">Our AI Automation Services</h2>
            <div className="services-cards-grid">
              {services.map((service, index) => {
                const isWide = index === services.length - 1 && services.length % 2 !== 0;
                return (
                  <div
                    key={service.slug}
                    className={`service-solution-card ${isWide ? "service-card-wide" : ""}`}
                  >
                    {/* Top: Mono label + right-aligned index */}
                    <div
                      className="service-card-header"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "16px",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <StarShape size={8} variant="fill" color="var(--accent-text)" />
                        <span
                          style={{
                            fontFamily: "var(--ff-mono, monospace)",
                            fontSize: "11px",
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "var(--accent-text)",
                          }}
                        >
                          {service.label}
                        </span>
                      </div>
                      <span
                        style={{
                          fontFamily: "var(--ff-mono, monospace)",
                          fontSize: "12px",
                          fontWeight: 500,
                          color: "var(--muted)",
                        }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Mock UI Panel */}
                    <div className="service-card-panel-wrap" style={{ marginBottom: "20px" }}>
                      <ServiceMockPanel
                        panel={service.panel}
                        nodes={service.nodes}
                        agents={service.agents}
                        tools={service.tools}
                        steps={service.steps}
                      />
                    </div>

                    {/* Card Title & Description */}
                    <div className="service-card-content" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <h3
                        style={{
                          fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                          fontSize: "clamp(24px, 2.2vw, 28px)",
                          fontWeight: 500,
                          lineHeight: 1.15,
                          letterSpacing: "-0.02em",
                          color: "var(--ink)",
                          margin: 0,
                        }}
                      >
                        {service.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                          fontSize: "15px",
                          lineHeight: 1.55,
                          color: "rgba(20, 20, 20, 0.72)",
                          margin: 0,
                        }}
                      >
                        {service.description}
                      </p>
                      {service.tags && service.tags.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "6px",
                            marginTop: "8px",
                          }}
                        >
                          {service.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{
                                fontFamily: "var(--ff-mono, monospace)",
                                fontSize: "10px",
                                fontWeight: 500,
                                letterSpacing: "0.04em",
                                textTransform: "uppercase",
                                padding: "3px 7px",
                                background: "rgba(20, 20, 20, 0.04)",
                                border: "1px solid var(--hairline)",
                                borderRadius: "4px",
                                color: "rgba(20, 20, 20, 0.65)",
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionColumn>
        </SectionFrame>

        {/* 2. BENEFITS SECTION (BENEFITS / 002) */}
        <SectionFrame
          id="benefits"
          ariaLabelledby="benefits-title"
          theme="cream"
          style={{ background: "var(--bg, #F4EFE6)" }}
        >
          <SectionColumn style={{ padding: "0 var(--col-pad, 24px)" }}>
            <SectionBar label="BENEFITS" num="002" headingId="benefits-bar-title" />

            <div className="benefits-two-col-grid" style={{ marginTop: "var(--heading-content-gap, 40px)" }}>
              {/* Left Column: Heading + CTA Button */}
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <span
                    style={{
                      fontFamily: "var(--ff-mono, monospace)",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      color: "var(--accent-text)",
                      display: "block",
                      marginBottom: "14px",
                    }}
                  >
                    {"// BENEFITS"}
                  </span>
                  <h2
                    id="benefits-title"
                    style={{
                      fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                      fontSize: "clamp(32px, 4vw, 48px)",
                      fontWeight: 500,
                      lineHeight: 1.08,
                      letterSpacing: "-0.02em",
                      color: "var(--ink)",
                      margin: "0 0 28px",
                      maxWidth: "16ch",
                    }}
                  >
                    {benefits.title}
                  </h2>
                </div>

                <div style={{ marginTop: "auto", paddingTop: "20px" }}>
                  <BookingAuditButton variant="secondary">
                    Book a free audit
                  </BookingAuditButton>
                  {founderPhoto && (
                    <div style={{ marginTop: "24px" }}>
                      {/* Optional founder portrait if present in site.ts */}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column: Stacked 4 Benefit Items */}
              <div className="benefits-items-list">
                {benefits.items.map((item, idx) => (
                  <div key={idx} className="benefit-item-row">
                    <span
                      style={{
                        width: "18px",
                        height: "18px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: "2px",
                      }}
                      aria-hidden="true"
                    >
                      <StarShape size={8} variant="fill" color="var(--accent-text)" />
                    </span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                      <span
                        style={{
                          fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                          fontSize: "19px",
                          fontWeight: 500,
                          lineHeight: 1.2,
                          letterSpacing: "-0.01em",
                          color: "var(--ink)",
                        }}
                      >
                        {item.title}
                      </span>
                      <p
                        style={{
                          fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                          fontSize: "15px",
                          lineHeight: 1.55,
                          color: "rgba(20, 20, 20, 0.72)",
                          margin: 0,
                        }}
                      >
                        {item.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SectionColumn>
        </SectionFrame>

        {/* 3. PROCESS SECTION (PROCESS / 003) */}
        <SectionFrame
          id="process"
          ariaLabelledby="process-title"
          theme="cream"
          style={{ background: "var(--bg, #F4EFE6)" }}
        >
          <SectionColumn style={{ padding: "0 var(--col-pad, 24px)" }}>
            <SectionBar label="PROCESS" num="003" headingId="process-bar-title" />

            <div style={{ marginTop: "var(--heading-content-gap, 40px)", maxWidth: "600px" }}>
              <span
                style={{
                  fontFamily: "var(--ff-mono, monospace)",
                  fontSize: "12px",
                  fontWeight: 600,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "var(--accent-text)",
                  display: "block",
                  marginBottom: "14px",
                }}
              >
                {"// PROCESS"}
              </span>
              <h2
                id="process-title"
                style={{
                  fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                  fontSize: "clamp(30px, 3.6vw, 44px)",
                  fontWeight: 500,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "var(--ink)",
                  margin: 0,
                }}
              >
                From first audit to launch.
              </h2>
            </div>

            {/* 4 Process Columns with Scroll Count-in */}
            <ProcessSteps steps={process.steps} />
          </SectionColumn>
        </SectionFrame>

        {/* 4. CLOSING CTA BLOCK */}
        <SectionFrame
          id="services-cta"
          ariaLabelledby="services-cta-title"
          theme="dark"
          style={{ background: "var(--ink-2, #0E1020)" }}
        >
          <SectionColumn style={{ padding: "0 var(--col-pad, 24px)" }}>
            <SectionBar label="GET STARTED" num="004" theme="dark" headingId="services-cta-bar" />

            <div className="services-closing-card">
              {/* Faint large outline star behind headline */}
              <div
                aria-hidden="true"
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  opacity: 0.06,
                  zIndex: 0,
                }}
              >
                <StarShape size={440} variant="outline" color="#ffffff" />
              </div>

              <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h2
                  id="services-cta-title"
                  style={{
                    fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                    fontSize: "clamp(30px, 4.8vw, 54px)",
                    fontWeight: 500,
                    lineHeight: 1.06,
                    letterSpacing: "-0.03em",
                    color: "#ffffff",
                    maxWidth: "24ch",
                    margin: "0 0 20px",
                  }}
                >
                  Tell us what&apos;s eating your team&apos;s time.
                </h2>
                <p
                  style={{
                    fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                    fontSize: "16px",
                    lineHeight: 1.6,
                    color: "rgba(244, 239, 230, 0.76)",
                    maxWidth: "48ch",
                    margin: "0 0 32px",
                  }}
                >
                  Book a 20-minute audit call. We&apos;ll map your repetitive tasks and tell you honestly what&apos;s worth automating.
                </p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "20px",
                  }}
                >
                  <BookingAuditButton variant="inverse" size="md">
                    Book a free audit
                  </BookingAuditButton>
                  <Link
                    href="/#contact"
                    style={{
                      fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                      fontSize: "14px",
                      fontWeight: 500,
                      letterSpacing: "0.04em",
                      textTransform: "uppercase",
                      color: "rgba(244, 239, 230, 0.9)",
                      textDecoration: "underline",
                      textUnderlineOffset: "4px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 12px",
                      minHeight: "44px",
                    }}
                  >
                    <span>Or send us a message</span>
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </SectionColumn>
        </SectionFrame>
      </main>

      <Footer />

      <style>{`
        .services-cards-grid,
        .services-2x2-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
        }
        .service-solution-card {
          background: var(--surface, #FBF8F2);
          border: 1px solid var(--hairline, #D9D4C9);
          border-radius: var(--r-card, 12px);
          padding: 28px;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s ease, box-shadow 0.3s ease;
        }
        @media (min-width: 1024px) {
          .service-card-wide {
            grid-column: 1 / -1;
            display: grid !important;
            grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
            grid-template-areas:
              "header header"
              "content panel";
            column-gap: 36px;
            align-items: center;
          }
          .service-card-wide .service-card-header {
            grid-area: header;
          }
          .service-card-wide .service-card-panel-wrap {
            grid-area: panel;
            margin-bottom: 0 !important;
          }
          .service-card-wide .service-card-content {
            grid-area: content;
          }
        }
        @media (pointer: fine) {
          .service-solution-card:hover {
            transform: translateY(-4px);
            border-color: var(--accent, #E05A47) !important;
            box-shadow: 0 12px 32px rgba(20, 20, 20, 0.08);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .service-solution-card:hover {
            transform: none !important;
          }
        }
        .benefits-two-col-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
          gap: 48px;
        }
        .benefits-items-list {
          display: flex;
          flex-direction: column;
        }
        .benefit-item-row {
          border-top: 1px solid var(--hairline, #D9D4C9);
          padding: 20px 0;
          display: flex;
          align-items: flex-start;
          gap: 16px;
        }
        .services-closing-card {
          background: var(--ink-2, #0E1020);
          border-radius: var(--r-card, 12px);
          border: 1px solid var(--hairline-dark, rgba(255, 255, 255, 0.12));
          padding: 64px 32px;
          text-align: center;
          position: relative;
          overflow: hidden;
          margin-top: var(--heading-content-gap, 40px);
        }
        @media (max-width: 1023px) {
          .services-cards-grid,
          .services-2x2-grid {
            grid-template-columns: 1fr !important;
          }
          .benefits-two-col-grid {
            grid-template-columns: 1fr !important;
            gap: 36px !important;
          }
        }
        @media (max-width: 767px) {
          .service-solution-card {
            padding: 20px !important;
          }
          .services-closing-card {
            padding: 40px 20px !important;
          }
        }
      `}</style>
    </SmoothScrollProvider>
  );
}
