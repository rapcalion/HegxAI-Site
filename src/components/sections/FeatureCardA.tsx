"use client";

import React from "react";
import StarShape from "@/components/ui/StarShape";
import { FeatureVisualCardA } from "@/content/site";

interface FeatureCardAProps {
  cardA: FeatureVisualCardA;
  isMobile?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function FeatureCardA({
  cardA,
  isMobile = false,
  className = "",
  style,
}: FeatureCardAProps) {
  return (
    <div
      className={`feature-card-a ${className}`}
      style={{
        width: isMobile ? "272px" : "352px",
        minHeight: isMobile ? "180px" : "236px",
        height: isMobile ? "180px" : "236px",
        background: "var(--ink-2)",
        borderRadius: "var(--r-card, 12px)",
        border: "1px solid var(--hairline-dark)",
        boxShadow: "0 20px 40px rgba(14, 16, 32, 0.45)",
        padding: isMobile ? "16px 14px" : "18px 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {/* Header */}
      <div>
        {/* Label row: mono label + star marker + small accent dot pulse */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "8px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span
              style={{
                width: "12px",
                height: "12px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              aria-hidden="true"
            >
              <StarShape size={8} variant="fill" color="var(--accent-on-dark)" />
            </span>
            <span
              style={{
                fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                fontSize: isMobile ? "10px" : "11px",
                fontWeight: 500,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--accent-on-dark)",
              }}
            >
              {cardA.label}
            </span>
          </div>

          {/* Pulsing accent dot */}
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "var(--accent)",
              boxShadow: "0 0 6px var(--accent)",
              display: "inline-block",
              animation: "cardPulse 2.4s ease-in-out infinite",
            }}
            aria-hidden="true"
          />
        </div>

        {/* Title: 20px white display */}
        <div
          style={{
            fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
            fontSize: isMobile ? "17px" : "20px",
            fontWeight: 500,
            letterSpacing: "-0.02em",
            color: "#ffffff",
            lineHeight: 1.25,
          }}
        >
          {cardA.title}
        </div>
      </div>

      {/* Body: 4 node chips with travelling packet & glowing active border */}
      <div
        style={{
          position: "relative",
          width: "100%",
          paddingTop: "14px",
          paddingBottom: "6px",
        }}
      >
        {/* Dashed connector track line behind chips */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: "12px",
            right: "12px",
            top: "calc(50% + 4px)",
            height: "1px",
            borderTop: "1px dashed rgba(255, 255, 255, 0.2)",
            zIndex: 1,
            pointerEvents: "none",
          }}
        />

        {/* Travelling packet dot (3.2s loop) */}
        <div
          className="feature-travel-packet"
          aria-hidden="true"
          style={{
            position: "absolute",
            top: "calc(50% + 1px)",
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "var(--accent)",
            boxShadow: "0 0 8px var(--accent), 0 0 14px var(--accent)",
            zIndex: 3,
            pointerEvents: "none",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* 4 node chips */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: isMobile ? "4px" : "6px",
            position: "relative",
            zIndex: 2,
          }}
        >
          {cardA.nodes.map((node, nIdx) => (
            <div
              key={nIdx}
              className={`feature-node-chip feature-node-${nIdx}`}
              style={{
                fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                fontSize: isMobile ? "7.5px" : "9px",
                fontWeight: 500,
                letterSpacing: isMobile ? "-0.02em" : "0.01em",
                textAlign: "center",
                padding: isMobile ? "4px 1px" : "5px 2px",
                borderRadius: "6px",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                color: "rgba(255, 255, 255, 0.88)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                boxSizing: "border-box",
                transition: "border-color 0.25s ease, box-shadow 0.25s ease, background-color 0.25s ease",
              }}
              title={node}
            >
              {node}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
