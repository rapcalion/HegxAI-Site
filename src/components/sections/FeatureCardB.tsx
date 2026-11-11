"use client";

import React from "react";
import { FeatureVisualCardB } from "@/content/site";

interface FeatureCardBProps {
  cardB: FeatureVisualCardB;
  className?: string;
  style?: React.CSSProperties;
}

export default function FeatureCardB({
  cardB,
  className = "",
  style,
}: FeatureCardBProps) {
  return (
    <div
      className={`feature-card-b ${className}`}
      style={{
        width: "270px",
        minHeight: "180px",
        height: "180px",
        background: "var(--ink-2)",
        borderRadius: "var(--r-card, 12px)",
        border: "1px solid var(--hairline-dark)",
        boxShadow: "0 24px 48px rgba(14, 16, 32, 0.38)",
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {/* Header: mono title + Live pill */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "8px",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <span
          style={{
            fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          {cardB.title}
        </span>

        {/* "Live" pill: --accent-strong bg, white text, tiny pulse */}
        <span
          style={{
            background: "var(--accent-strong)",
            color: "#ffffff",
            fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
            fontSize: "9.5px",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "2px 8px",
            borderRadius: "var(--r-pill, 999px)",
            display: "inline-flex",
            alignItems: "center",
            gap: "5px",
            lineHeight: 1.4,
          }}
        >
          <span
            style={{
              width: "4px",
              height: "4px",
              borderRadius: "50%",
              background: "#ffffff",
              display: "inline-block",
            }}
            aria-hidden="true"
          />
          Live
        </span>
      </div>

      {/* Rows: 3 items with checkmark in --accent-on-dark, text cream */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          flex: 1,
          justifyContent: "center",
          paddingTop: "6px",
        }}
      >
        {cardB.rows.map((row, rIdx) => (
          <div
            key={rIdx}
            className={`feature-row-reveal feature-row-${rIdx}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              fontSize: "12px",
            }}
          >
            {/* Check icon in --accent-on-dark */}
            <span
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "rgba(125, 147, 255, 0.14)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
              aria-hidden="true"
            >
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                <path
                  d="M2.5 6.5L4.5 8.5L9.5 3.5"
                  stroke="var(--accent-on-dark)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>

            {/* Row text: cream color */}
            <span
              style={{
                fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                fontSize: "11.5px",
                fontWeight: 400,
                color: "var(--bg)",
                letterSpacing: "0.01em",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {row}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

