import { ImageResponse } from "next/og";
import { siteContent } from "@/content/site";

export const alt = siteContent.seo.ogImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#F4EFE6",
          color: "#141414",
          position: "relative",
          overflow: "hidden",
          fontFamily: "sans-serif",
        }}
      >
        {/* Subtle decorative background star motif */}
        <div
          style={{
            position: "absolute",
            right: "-80px",
            top: "-80px",
            width: "560px",
            height: "560px",
            display: "flex",
            opacity: 0.08,
          }}
        >
          <svg viewBox="0 0 100 100" width="560" height="560" fill="none">
            <path
              d="M50 0 C50 28 72 50 100 50 C72 50 50 72 50 100 C50 72 28 50 0 50 C28 50 50 28 50 0 Z"
              stroke="#141414"
              strokeWidth="1.5"
            />
          </svg>
        </div>

        {/* Top bar: Brand wordmark & label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            {/* Sparkle icon */}
            <div style={{ display: "flex", width: 36, height: 36 }}>
              <svg viewBox="0 0 100 100" width="36" height="36" fill="none">
                <path
                  d="M50 0 C50 28 72 50 100 50 C72 50 50 72 50 100 C50 72 28 50 0 50 C28 50 50 28 50 0 Z"
                  fill="#5170FF"
                />
              </svg>
            </div>
            <span
              style={{
                fontSize: 32,
                fontWeight: 900,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "#141414",
              }}
            >
              HEGXAI
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "6px 14px",
              background: "rgba(20, 20, 20, 0.05)",
              border: "1px solid rgba(20, 20, 20, 0.12)",
              borderRadius: "4px",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#2F4FD6",
            }}
          >
            AI AUTOMATION AGENCY
          </div>
        </div>

        {/* Center: Main text "Every task. Automated." */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, flexWrap: "wrap" }}>
            <span
              style={{
                fontSize: 74,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                color: "#141414",
                lineHeight: 1,
              }}
            >
              Every task.
            </span>
            <span
              style={{
                background: "linear-gradient(90deg, #194EB4 0%, #5170FF 50%, #B368DF 100%)",
                color: "#ffffff",
                padding: "4px 22px",
                borderRadius: "4px",
                fontSize: 74,
                fontWeight: 600,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              Automated.
            </span>
          </div>

          <p
            style={{
              fontSize: 26,
              color: "rgba(20, 20, 20, 0.7)",
              margin: 0,
              fontWeight: 400,
              maxWidth: "760px",
              lineHeight: 1.4,
            }}
          >
            {siteContent.hero.subtitle}
          </p>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(20, 20, 20, 0.12)",
            paddingTop: 20,
            fontSize: 14,
            color: "rgba(20, 20, 20, 0.6)",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
          }}
        >
          <span>hegxai.com</span>
          <span style={{ color: "#2F4FD6" }}>Intelligent Agents & Workflows</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
