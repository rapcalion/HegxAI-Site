"use client";

import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import FeatureTextureCanvas from "./FeatureTextureCanvas";
import FeatureCardA from "./FeatureCardA";
import FeatureCardB from "./FeatureCardB";
import FeatureStatusChip from "./FeatureStatusChip";
import { siteContent, FeatureItem } from "@/content/site";

interface FeatureVisualLayeredProps {
  activeIndex: number;
  isMobile?: boolean;
  slideFeature?: FeatureItem; // If rendered directly for a mobile slide
  onTransitionComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function FeatureVisualLayered({
  activeIndex,
  isMobile = false,
  slideFeature,
  onTransitionComplete,
  className = "",
  style,
}: FeatureVisualLayeredProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Parallax wrapper refs (for pointer: fine)
  const parallaxARef = useRef<HTMLDivElement>(null);
  const parallaxBRef = useRef<HTMLDivElement>(null);
  const parallaxChipRef = useRef<HTMLDivElement>(null);

  // Content animation refs (for staggered feature switch)
  const cardAAnimRef = useRef<HTMLDivElement>(null);
  const cardBAnimRef = useRef<HTMLDivElement>(null);
  const chipAnimRef = useRef<HTMLDivElement>(null);

  // Track the displayed index for staggered exit/entrance without flicker
  const [displayedIdx, setDisplayedIdx] = useState(
    slideFeature ? siteContent.features.indexOf(slideFeature) : activeIndex
  );
  const isTransitioningRef = useRef(false);

  // Active feature to render
  const feature = slideFeature || siteContent.features[displayedIdx] || siteContent.features[0];

  // Feature switch transition on desktop
  useEffect(() => {
    if (slideFeature) return; // Mobile slide handles its own static index
    if (activeIndex === displayedIdx || isTransitioningRef.current) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      const timer = setTimeout(() => {
        setDisplayedIdx(activeIndex);
        onTransitionComplete?.();
      }, 0);
      return () => clearTimeout(timer);
    }

    isTransitioningRef.current = true;

    const targets = [
      cardAAnimRef.current,
      cardBAnimRef.current,
      chipAnimRef.current,
    ].filter(Boolean);

    // Step 1: Outgoing cards fade + slide 12px (0.2s)
    gsap.to(targets, {
      opacity: 0,
      y: -12,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        // Swap displayed data
        setDisplayedIdx(activeIndex);

        // Step 2: Incoming cards enter staggered (A at 0, B at 0.12s, Chip at 0.20s, 0.4s each)
        if (cardAAnimRef.current) {
          gsap.fromTo(
            cardAAnimRef.current,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              delay: 0,
              ease: "power2.out",
            }
          );
        }

        if (cardBAnimRef.current) {
          gsap.fromTo(
            cardBAnimRef.current,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              delay: 0.12,
              ease: "power2.out",
            }
          );
        }

        if (chipAnimRef.current) {
          gsap.fromTo(
            chipAnimRef.current,
            { opacity: 0, y: 12 },
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              delay: 0.2,
              ease: "power2.out",
              onComplete: () => {
                isTransitioningRef.current = false;
                onTransitionComplete?.();
              },
            }
          );
        } else {
          isTransitioningRef.current = false;
          onTransitionComplete?.();
        }
      },
    });
  }, [activeIndex, displayedIdx, slideFeature, onTransitionComplete]);

  // Pointer fine parallax on panel hover (Card A: 8px, Card B: 14px, Chip: 4px opposite cursor)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile) return;
    const isFine = window.matchMedia("(pointer: fine)").matches;
    if (!isFine) return;

    const rect = panelRef.current?.getBoundingClientRect();
    if (!rect) return;

    const normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;

    if (parallaxARef.current) {
      gsap.to(parallaxARef.current, {
        x: -normX * 8,
        y: -normY * 8,
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    if (parallaxBRef.current) {
      gsap.to(parallaxBRef.current, {
        x: -normX * 14,
        y: -normY * 14,
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    if (parallaxChipRef.current) {
      gsap.to(parallaxChipRef.current, {
        x: -normX * 4,
        y: -normY * 4,
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  const handleMouseLeave = () => {
    if (isMobile) return;
    const targets = [
      parallaxARef.current,
      parallaxBRef.current,
      parallaxChipRef.current,
    ].filter(Boolean);

    if (targets.length > 0) {
      gsap.to(targets, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  return (
    <div
      ref={panelRef}
      className={`feature-visual-panel ${className}`}
      aria-hidden="true"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        background: "var(--bg-sunken)",
        borderRadius: "var(--r-card, 12px)",
        border: "1px solid var(--hairline)",
        position: "relative",
        overflow: "visible", // allows Card B to break out
        width: "100%",
        height: isMobile ? "340px" : "480px",
        minHeight: isMobile ? "340px" : "480px",
        boxSizing: "border-box",
        ...style,
      }}
    >
      {/* 1. Clipped texture layer: contains the single GlyphField texture canvas */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "inherit",
          overflow: "hidden",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <FeatureTextureCanvas
          activeIndex={slideFeature ? siteContent.features.indexOf(slideFeature) : displayedIdx}
          cellSize={isMobile ? 15 : 13}
        />
      </div>

      {/* 2. Status Chip: top-right (right 28px, top 28px), z-index 4, hidden on mobile */}
      {!isMobile && (
        <div
          ref={parallaxChipRef}
          style={{
            position: "absolute",
            right: "28px",
            top: "28px",
            zIndex: 4,
            pointerEvents: "none",
          }}
        >
          <div ref={chipAnimRef}>
            <FeatureStatusChip text={feature.visual.chip} />
          </div>
        </div>
      )}

      {/* 3. Card A: ~340x210 top-left (left 28px, top 44px), z-index 2 */}
      <div
        ref={parallaxARef}
        style={{
          position: "absolute",
          left: isMobile ? "14px" : "28px",
          top: isMobile ? "20px" : "44px",
          zIndex: 2,
        }}
      >
        <div className={isMobile ? "" : "feature-float-a"}>
          <div ref={cardAAnimRef}>
            <FeatureCardA cardA={feature.visual.cardA} isMobile={isMobile} />
          </div>
        </div>
      </div>

      {/* 4. Card B: ~270x180 bottom-right overlap (right -24px, bottom -24px), rotated 2deg, z-index 3 */}
      <div
        ref={parallaxBRef}
        style={{
          position: "absolute",
          right: isMobile ? "-12px" : "-24px",
          bottom: isMobile ? "-12px" : "-24px",
          zIndex: 3,
          transformOrigin: "bottom right",
        }}
      >
        <div className={isMobile ? "feature-float-b-mobile" : "feature-float-b"}>
          <div ref={cardBAnimRef}>
            <FeatureCardB cardB={feature.visual.cardB} />
          </div>
        </div>
      </div>
    </div>
  );
}
