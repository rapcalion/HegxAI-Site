"use client";

import React from "react";
import LogoMark from "@/components/ui/LogoMark";

interface FeatureStatusChipProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function FeatureStatusChip({
  text,
  className = "",
  style,
}: FeatureStatusChipProps) {
  return (
    <div
      className={`feature-status-chip ${className}`}
      style={{
        background: "var(--ink-2)",
        color: "var(--bg)",
        fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
        fontSize: "11px",
        fontWeight: 500,
        letterSpacing: "0.06em",
        borderRadius: "var(--r-pill, 999px)",
        border: "1px solid var(--hairline-dark)",
        boxShadow: "0 10px 24px rgba(14, 16, 32, 0.4)",
        padding: "5px 12px",
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        whiteSpace: "nowrap",
        userSelect: "none",
        ...style,
      }}
    >
      <LogoMark height={16} isDark={true} aria-hidden={true} />
      <span>{text}</span>
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
  );
}

