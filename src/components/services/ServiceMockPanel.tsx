"use client";

import { useId } from "react";
import StarShape from "@/components/ui/StarShape";
import LogoMark from "@/components/ui/LogoMark";

interface ServiceMockPanelProps {
  panel:
    | "workflow"
    | "agents"
    | "integrations"
    | "audit"
    | "training"
    | "voice"
    | "marketing"
    | "ecommerce"
    | "social"
    | "business"
    | string;
  nodes?: string[];
  agents?: string[];
  tools?: string[];
  steps?: string[];
}

export default function ServiceMockPanel({
  panel,
  nodes = ["New lead", "Classify", "Route", "Notify"],
  agents = ["Lead qualifier", "Reply drafter", "Report builder", "Follow-up agent"],
  tools = ["Gmail", "Google Sheets", "Slack", "HubSpot", "Notion", "Stripe"],
  steps = ["Map your workflows", "Find what to automate", "Get a simple plan"],
}: ServiceMockPanelProps) {
  const patternId = useId().replace(/:/g, "_");

  return (
    <div
      className="mock-panel-card"
      aria-hidden="true"
      style={{
        position: "relative",
        width: "100%",
        height: "220px",
        minHeight: "220px",
        background: "var(--ink-2, #0E1020)",
        border: "1px solid var(--hairline-dark, rgba(255, 255, 255, 0.12))",
        borderRadius: "var(--r-card, 12px)",
        overflow: "hidden",
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* 10% Dotted texture inside panel */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,1) 20%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,1) 20%, transparent 90%)",
          opacity: 0.1,
          zIndex: 1,
        }}
      >
        <svg width="100%" height="100%">
          <defs>
            <pattern
              id={`mock-pat-${patternId}`}
              width="10"
              height="10"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="5" cy="5" r="1.5" fill="var(--accent-on-dark, #7D93FF)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#mock-pat-${patternId})`} />
        </svg>
      </div>

      {/* Content for panel type */}
      <div style={{ position: "relative", zIndex: 2, width: "100%", height: "100%" }}>
        {/* PANEL: TRAINING (Model Training) */}
        {panel === "training" && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "16px 20px",
              boxSizing: "border-box",
            }}
          >
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontFamily: "var(--ff-mono, monospace)",
                  fontSize: "10.5px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--accent-on-dark, #7D93FF)",
                }}
              >
                TRAINING PIPELINE
              </span>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "3px 8px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  borderRadius: "9999px",
                }}
              >
                <span
                  className="panel-pulse-dot"
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--accent, #E05A47)",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--ff-mono, monospace)",
                    fontSize: "10.5px",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.85)",
                  }}
                >
                  FINE-TUNING
                </span>
              </div>
            </div>

            {/* Center Loss Curve SVG */}
            <div style={{ position: "relative", width: "100%", height: "76px", margin: "4px 0" }}>
              <svg
                viewBox="0 0 320 76"
                width="100%"
                height="100%"
                preserveAspectRatio="none"
                style={{ overflow: "visible" }}
              >
                <defs>
                  <linearGradient id={`grad-train-${patternId}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--accent-on-dark, #7D93FF)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="var(--accent-on-dark, #7D93FF)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <line x1="10" y1="18" x2="310" y2="18" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <line x1="10" y1="42" x2="310" y2="42" stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3" />
                <line x1="10" y1="66" x2="310" y2="66" stroke="rgba(255,255,255,0.12)" />

                <path
                  d="M 10 16 Q 60 18 110 44 T 210 58 T 300 62 L 300 66 L 10 66 Z"
                  fill={`url(#grad-train-${patternId})`}
                />
                <path
                  d="M 10 16 Q 60 18 110 44 T 210 58 T 300 62"
                  fill="none"
                  stroke="var(--accent-on-dark, #7D93FF)"
                  strokeWidth="2"
                />
                <circle cx="300" cy="62" r="3.5" fill="var(--accent, #E05A47)" stroke="#141414" strokeWidth="1" />
              </svg>
            </div>

            {/* Metric Chips Row */}
            <div style={{ display: "flex", gap: "8px", justifyContent: "space-between" }}>
              <div
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontFamily: "var(--ff-mono, monospace)", fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>DATASET</span>
                <span style={{ fontFamily: "var(--ff-mono, monospace)", fontSize: "11px", color: "#ffffff", fontWeight: 600 }}>DOMAIN DOCS</span>
              </div>
              <div
                style={{
                  flex: 1,
                  padding: "6px 8px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "6px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontFamily: "var(--ff-mono, monospace)", fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>WEIGHTS</span>
                <span style={{ fontFamily: "var(--ff-mono, monospace)", fontSize: "11px", color: "var(--accent-on-dark, #7D93FF)", fontWeight: 600 }}>PRIVATE & SECURE</span>
              </div>
            </div>
          </div>
        )}

        {/* PANEL: VOICE (AI Voice Agents) */}
        {panel === "voice" && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "16px 20px",
              boxSizing: "border-box",
            }}
          >
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontFamily: "var(--ff-mono, monospace)",
                  fontSize: "10.5px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--accent-on-dark, #7D93FF)",
                }}
              >
                VOICE STREAM
              </span>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "3px 8px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  borderRadius: "9999px",
                }}
              >
                <span
                  className="panel-pulse-dot"
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#10B981",
                    boxShadow: "0 0 6px #10B981",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--ff-mono, monospace)",
                    fontSize: "10.5px",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.85)",
                  }}
                >
                  LIVE CALL
                </span>
              </div>
            </div>

            {/* Audio Waveform Visualizer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                height: "50px",
                padding: "0 4px",
              }}
            >
              {[14, 26, 40, 20, 48, 32, 16, 44, 50, 36, 18, 46, 28, 42, 24, 34, 18, 12].map((h, i) => (
                <span
                  key={i}
                  className="panel-voice-bar"
                  style={{
                    width: "3px",
                    height: `${h}px`,
                    background: i % 3 === 0 ? "var(--accent, #E05A47)" : "var(--accent-on-dark, #7D93FF)",
                    borderRadius: "2px",
                    display: "inline-block",
                    animationDelay: `${(i * 0.08).toFixed(2)}s`,
                  }}
                />
              ))}
            </div>

            {/* Live Dialogue Exchange */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "5px 10px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "6px",
                  fontSize: "11px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontFamily: "var(--ff-mono, monospace)", color: "rgba(255,255,255,0.45)" }}>CALLER:</span>
                  <span style={{ color: "rgba(255,255,255,0.9)", fontFamily: "var(--ff-body, sans-serif)" }}>&ldquo;Book an audit for Thursday&rdquo;</span>
                </div>
                <span style={{ fontFamily: "var(--ff-mono, monospace)", fontSize: "10px", color: "#10B981" }}>STT OK</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "5px 10px",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "6px",
                  fontSize: "11px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ fontFamily: "var(--ff-mono, monospace)", color: "var(--accent-on-dark, #7D93FF)" }}>AGENT:</span>
                  <span style={{ color: "rgba(255,255,255,0.9)", fontFamily: "var(--ff-body, sans-serif)" }}>&ldquo;Confirmed for Thursday at 2 PM.&rdquo;</span>
                </div>
                <span style={{ fontFamily: "var(--ff-mono, monospace)", fontSize: "10px", color: "var(--accent, #E05A47)" }}>BOOKED</span>
              </div>
            </div>
          </div>
        )}

        {/* PANEL: WORKFLOW (Lead Generation & Follow-up Automation) */}
        {panel === "workflow" && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "16px 12px",
            }}
          >
            {/* Running status pill */}
            <div
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "3px 8px",
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.14)",
                borderRadius: "9999px",
              }}
            >
              <span
                className="panel-pulse-dot"
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  display: "inline-block",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--ff-mono, monospace)",
                  fontSize: "10.5px",
                  fontWeight: 500,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(255, 255, 255, 0.85)",
                }}
              >
                RUNNING
              </span>
            </div>

            {/* 4 Connected Nodes */}
            <svg viewBox="0 0 360 80" width="100%" height="80" fill="none" style={{ maxWidth: "100%", overflow: "visible" }}>
              <path
                d="M 45 40 L 315 40"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              {nodes.slice(0, 4).map((label, i) => {
                const cx = [45, 135, 225, 315][i];
                return (
                  <g key={i}>
                    <rect
                      x={cx - 36}
                      y={40 - 18}
                      width="72"
                      height="36"
                      rx="6"
                      fill="#222222"
                      stroke="rgba(255, 255, 255, 0.18)"
                      strokeWidth="1"
                    />
                    <text
                      x={cx}
                      y={44}
                      textAnchor="middle"
                      fill="rgba(255, 255, 255, 0.92)"
                      fontFamily="var(--ff-mono, monospace)"
                      fontSize="9.5"
                      fontWeight="500"
                    >
                      {label}
                    </text>
                  </g>
                );
              })}
              <circle
                className="panel-dot-travel"
                cx="0"
                cy="40"
                r="4.5"
                fill="var(--accent)"
                stroke="#141414"
                strokeWidth="1"
                style={{ filter: "drop-shadow(0 0 6px var(--accent))" }}
              />
            </svg>
          </div>
        )}

        {/* PANEL: MARKETING (Content & Marketing Automation) */}
        {panel === "marketing" && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "16px 20px",
              boxSizing: "border-box",
            }}
          >
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontFamily: "var(--ff-mono, monospace)",
                  fontSize: "10.5px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--accent-on-dark, #7D93FF)",
                }}
              >
                CAMPAIGN PIPELINE
              </span>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "3px 8px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  borderRadius: "9999px",
                }}
              >
                <span
                  className="panel-pulse-dot"
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--accent, #E05A47)",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--ff-mono, monospace)",
                    fontSize: "10.5px",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.85)",
                  }}
                >
                  AUTO-DISPATCH
                </span>
              </div>
            </div>

            {/* Content Queue Rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              {[
                { channel: "NEWSLETTER", title: "Weekly Automation Brief", status: "QUEUED", color: "var(--accent-on-dark)" },
                { channel: "SOCIAL", title: "Product Launch Thread", status: "SCHEDULED", color: "#10B981" },
                { channel: "OUTREACH", title: "Follow-up Sequence A/B", status: "PUBLISHED", color: "rgba(255,255,255,0.7)" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "7px 10px",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "6px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        fontFamily: "var(--ff-mono, monospace)",
                        fontSize: "9.5px",
                        fontWeight: 600,
                        padding: "2px 5px",
                        background: "rgba(255, 255, 255, 0.08)",
                        borderRadius: "3px",
                        color: "rgba(255, 255, 255, 0.65)",
                      }}
                    >
                      {item.channel}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--ff-body, sans-serif)",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "rgba(255, 255, 255, 0.9)",
                      }}
                    >
                      {item.title}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--ff-mono, monospace)",
                      fontSize: "10px",
                      fontWeight: 600,
                      color: item.color,
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL: E-COMMERCE (E-Commerce Automation) */}
        {panel === "ecommerce" && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "16px 20px",
              boxSizing: "border-box",
            }}
          >
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontFamily: "var(--ff-mono, monospace)",
                  fontSize: "10.5px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--accent-on-dark, #7D93FF)",
                }}
              >
                STORE OPERATIONS
              </span>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "3px 8px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  borderRadius: "9999px",
                }}
              >
                <span
                  className="panel-pulse-dot"
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#10B981",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--ff-mono, monospace)",
                    fontSize: "10.5px",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.85)",
                  }}
                >
                  INVENTORY SYNCED
                </span>
              </div>
            </div>

            {/* Operations Rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
              {[
                { event: "ORDER #4920", detail: "Shopify → 3PL Fulfillment", badge: "FULFILLED", badgeColor: "#10B981" },
                { event: "LOW STOCK", detail: "SKU-992 → Supplier Reorder", badge: "TRIGGERED", badgeColor: "var(--accent)" },
                { event: "RETURN TRIAGE", detail: "RMA #104 → Label Dispatched", badge: "AUTOMATED", badgeColor: "var(--accent-on-dark)" },
              ].map((row, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "7px 10px",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "6px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span
                      style={{
                        fontFamily: "var(--ff-mono, monospace)",
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "rgba(255, 255, 255, 0.75)",
                      }}
                    >
                      {row.event}
                    </span>
                    <span
                      style={{
                        fontFamily: "var(--ff-body, sans-serif)",
                        fontSize: "12px",
                        color: "rgba(255, 255, 255, 0.9)",
                      }}
                    >
                      {row.detail}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--ff-mono, monospace)",
                      fontSize: "9.5px",
                      fontWeight: 600,
                      padding: "2px 6px",
                      borderRadius: "4px",
                      background: "rgba(255, 255, 255, 0.06)",
                      color: row.badgeColor,
                    }}
                  >
                    {row.badge}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL: SOCIAL (Social Media Automation) */}
        {panel === "social" && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "16px 20px",
              boxSizing: "border-box",
            }}
          >
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontFamily: "var(--ff-mono, monospace)",
                  fontSize: "10.5px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--accent-on-dark, #7D93FF)",
                }}
              >
                SOCIAL RADAR
              </span>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "3px 8px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  borderRadius: "9999px",
                }}
              >
                <span
                  className="panel-pulse-dot"
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "var(--accent, #E05A47)",
                    display: "inline-block",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--ff-mono, monospace)",
                    fontSize: "10.5px",
                    fontWeight: 500,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "rgba(255, 255, 255, 0.85)",
                  }}
                >
                  MONITORING
                </span>
              </div>
            </div>

            {/* Platform Pill Bar */}
            <div style={{ display: "flex", gap: "6px" }}>
              {["X / TWITTER", "LINKEDIN", "INSTAGRAM", "YOUTUBE"].map((ch, idx) => (
                <span
                  key={idx}
                  style={{
                    flex: 1,
                    textAlign: "center",
                    fontFamily: "var(--ff-mono, monospace)",
                    fontSize: "9px",
                    fontWeight: 600,
                    padding: "4px 2px",
                    background: "rgba(255, 255, 255, 0.06)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "4px",
                    color: "rgba(255, 255, 255, 0.8)",
                  }}
                >
                  {ch}
                </span>
              ))}
            </div>

            {/* Inbound Triage Card */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "6px",
                padding: "8px 10px",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                borderRadius: "6px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--ff-mono, monospace)", fontSize: "10px", color: "var(--accent-on-dark, #7D93FF)" }}>
                  INBOUND DM TRIAGE
                </span>
                <span style={{ fontFamily: "var(--ff-mono, monospace)", fontSize: "9.5px", color: "#10B981" }}>
                  AUTO-ROUTED
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--ff-body, sans-serif)", fontSize: "12px", color: "rgba(255, 255, 255, 0.9)" }}>
                  Inquiry: &ldquo;Custom integration pricing?&rdquo;
                </span>
                <span style={{ fontFamily: "var(--ff-mono, monospace)", fontSize: "10px", color: "var(--accent, #E05A47)", fontWeight: 600 }}>
                  → SLACK SALES
                </span>
              </div>
            </div>
          </div>
        )}

        {/* PANEL: BUSINESS & INTEGRATIONS (Workflow & Business Automation) */}
        {(panel === "business" || panel === "integrations") && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px",
              boxSizing: "border-box",
            }}
          >
            <svg
              viewBox="0 0 360 200"
              width="100%"
              height="100%"
              style={{ overflow: "visible" }}
            >
              {/* Connecting lines from center (180, 100) to each chip */}
              {[
                [70, 48],
                [180, 36],
                [290, 48],
                [70, 152],
                [180, 164],
                [290, 152],
              ].map(([x, y], idx) => (
                <line
                  key={idx}
                  x1="180"
                  y1="100"
                  x2={x}
                  y2={y}
                  stroke="rgba(255, 255, 255, 0.18)"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />
              ))}

              {/* Central Logo Mark Badge */}
              <g transform="translate(162, 82)">
                <rect
                  width="36"
                  height="36"
                  rx="8"
                  fill="#222222"
                  stroke="rgba(255, 255, 255, 0.25)"
                  strokeWidth="1"
                />
              </g>

              {/* Central StarShape in SVG */}
              <circle cx="180" cy="100" r="14" fill="rgba(255, 255, 255, 0.06)" />
            </svg>

            {/* Central Logo in absolute overlay */}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 4,
              }}
            >
              <LogoMark height={22} isDark={true} />
            </div>

            {/* 6 Floating Tool Chips */}
            {[
              { pos: { left: "12%", top: "18%" }, delay: "0s" },
              { pos: { left: "50%", top: "12%", transform: "translateX(-50%)" }, delay: "0.6s" },
              { pos: { right: "12%", top: "18%" }, delay: "1.2s" },
              { pos: { left: "12%", bottom: "18%" }, delay: "0.3s" },
              { pos: { left: "50%", bottom: "12%", transform: "translateX(-50%)" }, delay: "0.9s" },
              { pos: { right: "12%", bottom: "18%" }, delay: "1.5s" },
            ].map((cfg, idx) => {
              const name = tools[idx] || "Tool";
              return (
                <div
                  key={idx}
                  className="panel-floating-chip"
                  style={{
                    position: "absolute",
                    ...cfg.pos,
                    animationDelay: cfg.delay,
                    fontFamily: "var(--ff-mono, monospace)",
                    fontSize: "10.5px",
                    fontWeight: 500,
                    letterSpacing: "0.04em",
                    padding: "4px 8px",
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.16)",
                    borderRadius: "6px",
                    color: "rgba(255, 255, 255, 0.95)",
                    zIndex: 3,
                    whiteSpace: "nowrap",
                  }}
                >
                  {name}
                </div>
              );
            })}
          </div>
        )}

        {/* PANEL: AGENTS (Custom AI Agents fallback) */}
        {panel === "agents" && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "16px 20px",
              boxSizing: "border-box",
            }}
          >
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontFamily: "var(--ff-mono, monospace)",
                  fontSize: "10.5px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--accent-on-dark)",
                }}
              >
                ACTIVE AGENTS
              </span>
              <span
                style={{
                  fontFamily: "var(--ff-mono, monospace)",
                  fontSize: "10.5px",
                  fontWeight: 600,
                  padding: "4px 10px",
                  background: "var(--accent-strong, #D84E39)",
                  color: "#ffffff",
                  borderRadius: "4px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  userSelect: "none",
                }}
              >
                Start
              </span>
            </div>

            {/* Rows */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {agents.slice(0, 4).map((role, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "6px 10px",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "6px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <StarShape size={9} variant="fill" color="var(--accent-on-dark)" />
                    <span
                      style={{
                        fontFamily: "var(--ff-body, sans-serif)",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: "rgba(255, 255, 255, 0.9)",
                      }}
                    >
                      {role}
                    </span>
                  </div>
                  <span
                    style={{
                      fontFamily: "var(--ff-mono, monospace)",
                      fontSize: "10px",
                      fontWeight: 500,
                      padding: "2px 6px",
                      background: "rgba(255, 255, 255, 0.08)",
                      border: "1px solid rgba(255, 255, 255, 0.14)",
                      borderRadius: "4px",
                      color: "rgba(255, 255, 255, 0.75)",
                      textTransform: "uppercase",
                    }}
                  >
                    Ready
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PANEL: AUDIT (Free Audit fallback) */}
        {panel === "audit" && (
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "18px 20px",
              boxSizing: "border-box",
            }}
          >
            {/* Header row */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  fontFamily: "var(--ff-mono, monospace)",
                  fontSize: "10.5px",
                  fontWeight: 600,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: "var(--accent-on-dark)",
                }}
              >
                AUDIT ROADMAP
              </span>
              <span
                style={{
                  fontFamily: "var(--ff-mono, monospace)",
                  fontSize: "10px",
                  fontWeight: 500,
                  padding: "2px 8px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.14)",
                  borderRadius: "4px",
                  color: "rgba(255, 255, 255, 0.8)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                20-MIN CALL
              </span>
            </div>

            {/* 3 Checklist Steps */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {steps.slice(0, 3).map((stepText, i) => {
                const isThird = i === 2;
                return (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "8px 10px",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "6px",
                    }}
                  >
                    {isThird ? (
                      <span
                        className="panel-pulse-dot"
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: "var(--accent)",
                          boxShadow: "0 0 8px var(--accent)",
                          flexShrink: 0,
                          margin: "0 2px",
                        }}
                      />
                    ) : (
                      <span
                        style={{
                          width: "14px",
                          height: "14px",
                          borderRadius: "50%",
                          background: "rgba(255, 255, 255, 0.08)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--accent-on-dark)",
                          fontSize: "10px",
                          fontWeight: 700,
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                    )}

                    <span
                      style={{
                        fontFamily: "var(--ff-body, sans-serif)",
                        fontSize: "13px",
                        fontWeight: isThird ? 600 : 400,
                        color: isThird ? "#ffffff" : "rgba(255, 255, 255, 0.85)",
                        lineHeight: 1.3,
                      }}
                    >
                      {stepText}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes panelDotTravel {
          0%, 16% { transform: translateX(45px); }
          28%, 44% { transform: translateX(135px); }
          56%, 72% { transform: translateX(225px); }
          84%, 100% { transform: translateX(315px); }
        }
        .panel-dot-travel {
          animation: panelDotTravel 3.6s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes panelPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        .panel-pulse-dot {
          animation: panelPulse 2s ease-in-out infinite;
        }
        @keyframes gentleFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }
        .panel-floating-chip {
          animation: gentleFloat 3s ease-in-out infinite;
        }
        @keyframes voiceWave {
          0%, 100% { transform: scaleY(0.35); opacity: 0.6; }
          50% { transform: scaleY(1); opacity: 1; }
        }
        .panel-voice-bar {
          transform-origin: bottom;
          animation: voiceWave 1.4s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .panel-dot-travel,
          .panel-pulse-dot,
          .panel-floating-chip,
          .panel-voice-bar {
            animation: none !important;
          }
          .panel-dot-travel {
            transform: translateX(45px);
          }
          .panel-voice-bar {
            transform: scaleY(0.7);
          }
        }
      `}</style>
    </div>
  );
}
