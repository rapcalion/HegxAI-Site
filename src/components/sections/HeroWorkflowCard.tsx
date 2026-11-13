"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// Event feed cycling copies (no numbers / stats / brand names)
const FEED_ITEMS = [
  "Lead routed",
  "Reply drafted",
  "CRM updated",
  "Report generated",
];

interface Packet {
  id: number;
  active: boolean;
  stage: "to-agent" | "to-action";
  inPathIdx: number;
  outPathIdx: number;
  progress: number;
  duration: number;
}

interface FeedRow {
  id: number;
  text: string;
  isNew: boolean;
}

export default function HeroWorkflowCard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const agentHaloRef = useRef<SVGCircleElement>(null);
  const toastLeftRef = useRef<HTMLDivElement>(null);
  const toastRightRef = useRef<HTMLDivElement>(null);

  // Workflow SVG path refs
  const inPathRefs = useRef<(SVGPathElement | null)[]>([]);
  const outPathRefs = useRef<(SVGPathElement | null)[]>([]);
  const actionNodeRefs = useRef<(SVGGElement | null)[]>([]);
  const packetCircleRefs = useRef<(SVGCircleElement | null)[]>([]);

  // State
  const [feedRows, setFeedRows] = useState<FeedRow[]>([
    { id: 1, text: "Lead routed", isNew: false },
    { id: 2, text: "Reply drafted", isNew: false },
    { id: 3, text: "CRM updated", isNew: false },
    { id: 4, text: "Report generated", isNew: false },
  ]);
  const [progressStep, setProgressStep] = useState(0);

  // References for ticker animation
  const isVisibleRef = useRef(false);
  const isReducedMotionRef = useRef(false);
  const feedCounterRef = useRef(0);
  const nextSpawnTimeRef = useRef(0);
  const packetsRef = useRef<Packet[]>([
    { id: 0, active: false, stage: "to-agent", inPathIdx: 0, outPathIdx: 0, progress: 0, duration: 0.9 },
    { id: 1, active: false, stage: "to-agent", inPathIdx: 1, outPathIdx: 1, progress: 0, duration: 0.9 },
    { id: 2, active: false, stage: "to-agent", inPathIdx: 2, outPathIdx: 2, progress: 0, duration: 0.9 },
    { id: 3, active: false, stage: "to-agent", inPathIdx: 0, outPathIdx: 1, progress: 0, duration: 0.9 },
  ]);

  // Feed row adder callback
  const pushFeedItem = useCallback(() => {
    feedCounterRef.current += 1;
    const text = FEED_ITEMS[feedCounterRef.current % FEED_ITEMS.length];
    const newId = Date.now() + Math.random();

    setFeedRows((prev) => [
      { id: newId, text, isNew: true },
      ...prev.slice(0, 3).map((r) => ({ ...r, isNew: false })),
    ]);
  }, []);

  // ─── 1. SCROLL ENTRANCE & BREATHING GLOW ────────────────────────────
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    isReducedMotionRef.current = prefersReduced;
    const isMobile = window.innerWidth < 768;

    const panel = panelRef.current;
    if (!panel || prefersReduced || isMobile) return;

    let cancelled = false;

    const schedule = (cb: () => void) => {
      if ("requestIdleCallback" in window) {
        (window as Window).requestIdleCallback(cb);
      } else {
        setTimeout(cb, 1);
      }
    };

    schedule(async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      // Scale 0.92 -> 1, y 60 -> 0 scroll scrub
      gsap.fromTo(
        panel,
        { scale: 0.92, y: 60 },
        {
          scale: 1,
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: panel,
            start: "top 90%",
            end: "top 55%",
            scrub: true,
          },
        }
      );

      // On mobile, skip continuous idle loops
      if (isMobile) return;

      // Outer glow breathing: opacity 0.2 <-> 0.4, 4s cycle (40% max per brand guidelines)
      if (glowRef.current) {
        gsap.fromTo(
          glowRef.current,
          { opacity: 0.2 },
          {
            opacity: 0.4,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
          }
        );
      }

      // Floating chips subtle floating entrance & gentle idle
      const toastL = toastLeftRef.current;
      const toastR = toastRightRef.current;
      const toasts = [toastL, toastR].filter(Boolean) as HTMLDivElement[];
      if (toasts.length > 0) {
        gsap.fromTo(
          toasts,
          { scale: 0.85, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.7,
            stagger: 0.15,
            ease: "back.out(1.7)",
            delay: 0.5,
          }
        );

        toasts.forEach((toast, i) => {
          gsap.to(toast, {
            y: i === 0 ? -5 : 5,
            duration: 3 + i * 0.8,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.2,
          });
        });
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  // ─── 3. 3D TILT FOLLOWING MOUSE & 1.5x PARALLAX ON TILES ───────────
  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasPointerFine = window.matchMedia("(pointer: fine)").matches;
    const isTouchOrCoarse =
      typeof window !== "undefined" &&
      (window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0);

    if (prefersReduced || !hasPointerFine || isTouchOrCoarse) return;

    const container = containerRef.current;
    const panel = panelRef.current;
    if (!container || !panel) return;

    let cleanup: (() => void) | undefined;

    import("gsap").then(({ gsap }) => {
      const quickRotateX = gsap.quickTo(panel, "rotationX", { duration: 0.5, ease: "power2.out" });
      const quickRotateY = gsap.quickTo(panel, "rotationY", { duration: 0.5, ease: "power2.out" });

      // QuickTo for subtle parallax on floating chips
      const toastSetters = [toastLeftRef.current, toastRightRef.current]
        .filter(Boolean)
        .map((toast) => ({
          x: gsap.quickTo(toast, "x", { duration: 0.6, ease: "power2.out" }),
          y: gsap.quickTo(toast, "y", { duration: 0.6, ease: "power2.out" }),
        }));

      const handleMouseMove = (e: MouseEvent) => {
        if (!isVisibleRef.current) return;
        const rect = panel.getBoundingClientRect();
        const panelCenterX = rect.left + rect.width / 2;
        const panelCenterY = rect.top + rect.height / 2;

        // Normalized coordinates from -1 to 1 based on viewport distance
        const normX = Math.max(-1, Math.min(1, (e.clientX - panelCenterX) / (window.innerWidth / 2)));
        const normY = Math.max(-1, Math.min(1, (e.clientY - panelCenterY) / (window.innerHeight / 2)));

        // Max 4 deg tilt
        quickRotateY(normX * 4);
        quickRotateX(-normY * 4);

        // Subtle parallax on chips
        toastSetters.forEach((setters) => {
          setters.x(normX * 10);
          setters.y(normY * 10);
        });
      };

      const handleMouseLeave = () => {
        quickRotateX(0);
        quickRotateY(0);
        toastSetters.forEach((setters) => {
          setters.x(0);
          setters.y(0);
        });
      };

      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

      cleanup = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseleave", handleMouseLeave);
      };
    });

    return () => {
      cleanup?.();
    };
  }, []);

  // ─── 4. WORKFLOW GRAPH PACKET SIMULATOR & TICKER (GATED BY OBSERVER) ──
  useEffect(() => {
    if (isReducedMotionRef.current) return;

    // Cache path total lengths
    const inLengths = inPathRefs.current.map((p) => (p ? p.getTotalLength() : 0));
    const outLengths = outPathRefs.current.map((p) => (p ? p.getTotalLength() : 0));

    let lastTime = performance.now();
    let feedIntervalTimer = 0;
    let progressTimer = 0;
    const isMobileDevice = typeof window !== "undefined" && window.innerWidth < 768;
    const minFrameInterval = isMobileDevice ? 1000 / 30 : 0; // 30fps cap on mobile
    let lastRenderTime = 0;

    const tickerCallback = (now: number) => {
      if (!isVisibleRef.current) return;
      if (isMobileDevice && now - lastRenderTime < minFrameInterval) {
        return;
      }
      lastRenderTime = now;
      const deltaSec = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      // 1. Spawn a new packet every ~1.2s if an idle packet exists (max 4 alive)
      if (now >= nextSpawnTimeRef.current) {
        nextSpawnTimeRef.current = now + 1200;
        const idlePacket = packetsRef.current.find((p) => !p.active);
        if (idlePacket) {
          idlePacket.active = true;
          idlePacket.stage = "to-agent";
          idlePacket.inPathIdx = Math.floor(Math.random() * 3);
          idlePacket.outPathIdx = Math.floor(Math.random() * 3);
          idlePacket.progress = 0;
          idlePacket.duration = 0.9;
        }
      }

      // 2. Advance active packets along curved paths
      packetsRef.current.forEach((pkt, idx) => {
        const circleEl = packetCircleRefs.current[idx];
        if (!pkt.active || !circleEl) {
          if (circleEl) circleEl.style.opacity = "0";
          return;
        }

        pkt.progress += deltaSec / pkt.duration;

        if (pkt.stage === "to-agent") {
          const pathEl = inPathRefs.current[pkt.inPathIdx];
          const totalLen = inLengths[pkt.inPathIdx];

          if (pathEl && totalLen > 0) {
            if (pkt.progress >= 1) {
              // Reached Agent: Flash halo and switch to action path
              pkt.stage = "to-action";
              pkt.progress = 0;
              pkt.duration = 0.9;

              if (agentHaloRef.current) {
                agentHaloRef.current.style.opacity = "0.9";
                agentHaloRef.current.style.transform = "scale(1.25)";
                setTimeout(() => {
                  if (agentHaloRef.current) {
                    agentHaloRef.current.style.opacity = "0.1";
                    agentHaloRef.current.style.transform = "scale(1)";
                  }
                }, 200);
              }
            } else {
              const pt = pathEl.getPointAtLength(pkt.progress * totalLen);
              circleEl.setAttribute("cx", pt.x.toFixed(1));
              circleEl.setAttribute("cy", pt.y.toFixed(1));
              circleEl.style.opacity = "1";
            }
          }
        } else if (pkt.stage === "to-action") {
          const pathEl = outPathRefs.current[pkt.outPathIdx];
          const totalLen = outLengths[pkt.outPathIdx];

          if (pathEl && totalLen > 0) {
            if (pkt.progress >= 1) {
              // Reached Action Node: Highlight action node and push feed item
              pkt.active = false;
              circleEl.style.opacity = "0";

              const actionNode = actionNodeRefs.current[pkt.outPathIdx];
              if (actionNode) {
                actionNode.style.stroke = "var(--accent)";
                actionNode.style.strokeWidth = "2";
                setTimeout(() => {
                  if (actionNode) {
                    actionNode.style.stroke = "rgba(255,255,255,0.14)";
                    actionNode.style.strokeWidth = "1";
                  }
                }, 350);
              }

              pushFeedItem();
            } else {
              const pt = pathEl.getPointAtLength(pkt.progress * totalLen);
              circleEl.setAttribute("cx", pt.x.toFixed(1));
              circleEl.setAttribute("cy", pt.y.toFixed(1));
              circleEl.style.opacity = "1";
            }
          }
        }
      });

      // 3. Fallback Feed trigger every ~1.6s if packets are quiet
      feedIntervalTimer += deltaSec;
      if (feedIntervalTimer >= 1.6) {
        feedIntervalTimer = 0;
        pushFeedItem();
      }

      // 4. Looping 12-segment progress bar over 6s
      progressTimer += deltaSec;
      if (progressTimer >= 6) progressTimer -= 6;
      const currentSegment = Math.floor((progressTimer / 6) * 12);
      setProgressStep(currentSegment);
    };

    let rafId: number | null = null;
    let isRunning = false;

    const tick = (now: number) => {
      if (!isRunning) return;
      tickerCallback(now);
      rafId = requestAnimationFrame(tick);
    };

    const start = () => {
      if (!isRunning) {
        isRunning = true;
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    const stop = () => {
      if (isRunning) {
        isRunning = false;
        if (rafId !== null) cancelAnimationFrame(rafId);
      }
    };

    const target = containerRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && !document.hidden;
        isVisibleRef.current = visible;
        if (visible) start();
        else stop();
      },
      { rootMargin: "120px" }
    );
    observer.observe(target);

    const handleVisibilityChange = () => {
      const visible = !document.hidden;
      isVisibleRef.current = visible;
      if (visible) start();
      else stop();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stop();
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [pushFeedItem]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        zIndex: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "-66px",
        perspective: "1200px",
        width: "100%",
      }}
    >
      {/* ─── MAIN ACCENT PANEL WITH CORNER BRACKETS & 3D TILT ─── */}
      <div
        ref={panelRef}
        style={{
          position: "relative",
          background: "var(--accent)",
          borderRadius: "var(--r-card, 12px)",
          padding: "6px",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="hero-workflow-panel"
      >
        {/* ─── 2 MEANINGFUL FLOATING CHIPS (Clean, purposeful, no decorative icons) ─── */}
        {/* Chip 1: "Lead routed" toast */}
        <div
          ref={toastLeftRef}
          style={{
            position: "absolute",
            left: "-24px",
            top: "84px",
            zIndex: 12,
            background: "var(--ink-2)",
            borderRadius: "var(--r-pill, 999px)",
            padding: "6px 14px 6px 8px",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            border: "1px solid var(--hairline-dark)",
            transform: "translateZ(30px)",
          }}
          className="hero-toast-item hidden md:flex"
        >
          <span
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: "rgba(125, 147, 255, 0.16)",
              color: "var(--accent-on-dark)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "10px",
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            ✓
          </span>
          <span
            style={{
              fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
              fontSize: "12px",
              fontWeight: 600,
              color: "#ffffff",
              letterSpacing: "0.01em",
              whiteSpace: "nowrap",
            }}
          >
            Lead routed
          </span>
        </div>

        {/* Chip 2: "Pipeline active" status chip */}
        <div
          ref={toastRightRef}
          style={{
            position: "absolute",
            right: "-24px",
            top: "132px",
            zIndex: 12,
            background: "var(--ink-2)",
            borderRadius: "var(--r-pill, 999px)",
            padding: "6px 14px 6px 10px",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
            border: "1px solid var(--hairline-dark)",
            transform: "translateZ(30px)",
          }}
          className="hero-toast-item hidden md:flex"
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "rgba(125, 147, 255, 0.2)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                background: "var(--accent-on-dark)",
                animation: "hero-live-pulse 1.8s ease-in-out infinite",
              }}
            />
          </span>
          <span
            style={{
              fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
              fontSize: "11px",
              fontWeight: 600,
              color: "#ffffff",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Pipeline active
          </span>
        </div>
        {/* Soft breathing outer glow (static blur 60px, opacity animated .5 <-> .9) */}
        <div
          ref={glowRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "var(--r-card, 12px)",
            boxShadow: "0 0 60px color-mix(in srgb, var(--accent) 25%, transparent)",
            pointerEvents: "none",
            opacity: 0.4,
            zIndex: -1,
          }}
        />

        {/* ─── 4 CORNER BRACKETS (14px arms, offset 10px outside) ─── */}
        <span
          style={{
            position: "absolute",
            top: "-10px",
            left: "-10px",
            width: "14px",
            height: "14px",
            borderTop: "1.5px solid var(--ink, #141414)",
            borderLeft: "1.5px solid var(--ink, #141414)",
            pointerEvents: "none",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: "-10px",
            right: "-10px",
            width: "14px",
            height: "14px",
            borderTop: "1.5px solid var(--ink, #141414)",
            borderRight: "1.5px solid var(--ink, #141414)",
            pointerEvents: "none",
          }}
        />
        <span
          style={{
            position: "absolute",
            bottom: "-10px",
            left: "-10px",
            width: "14px",
            height: "14px",
            borderBottom: "1.5px solid var(--ink, #141414)",
            borderLeft: "1.5px solid var(--ink, #141414)",
            pointerEvents: "none",
          }}
        />
        <span
          style={{
            position: "absolute",
            bottom: "-10px",
            right: "-10px",
            width: "14px",
            height: "14px",
            borderBottom: "1.5px solid var(--ink, #141414)",
            borderRight: "1.5px solid var(--ink, #141414)",
            pointerEvents: "none",
          }}
        />

        {/* ─── INNER DARK CARD (--ink-2, ~560x400 desktop, ~440x360 tablet) ─── */}
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "var(--ink-2)",
            borderRadius: "var(--r-card, 12px)",
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            boxSizing: "border-box",
            overflow: "hidden",
            position: "relative",
            border: "1px solid var(--hairline-dark)",
          }}
        >
          {/* ─── 1. WHITE HEADER BAR ─── */}
          <div
            style={{
              width: "100%",
              height: "32px",
              background: "#ffffff",
              borderRadius: "var(--r-0, 0px)",
              padding: "0 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxSizing: "border-box",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                fontSize: "11px",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#141414",
              }}
            >
              AI AUTOMATIONS
            </span>
            <div
              style={{
                background: "var(--accent-strong)",
                borderRadius: "var(--r-pill, 999px)",
                padding: "2px 8px",
                display: "flex",
                alignItems: "center",
                gap: "5px",
              }}
            >
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "#ffffff",
                  display: "inline-block",
                  animation: "hero-live-pulse 1.8s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#ffffff",
                  lineHeight: 1,
                }}
              >
                LIVE
              </span>
            </div>
          </div>

          {/* ─── 2. MAIN BODY (LEFT REBALANCED WORKFLOW + RIGHT EVENT FEED) ─── */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.15fr 1px 1fr",
              gap: "14px",
              alignItems: "stretch",
              flex: 1,
              minHeight: 0,
              padding: "10px 0 6px",
            }}
            className="hero-workflow-grid"
          >
            {/* ─── LEFT: WORKFLOW GRAPH (INLINE SVG) ─── */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
              }}
            >
              <svg
                viewBox="0 0 320 240"
                width="100%"
                height="100%"
                style={{ display: "block", overflow: "visible" }}
                preserveAspectRatio="xMidYMid meet"
              >
                {/* ─── CONNECTOR CURVES (1px dashed rgba(255,255,255,0.25)) ─── */}
                <g>
                  {/* Inputs -> Agent */}
                  <path
                    ref={(el) => {
                      inPathRefs.current[0] = el;
                    }}
                    d="M 110 36 C 124 36, 126 120, 136 120"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <path
                    ref={(el) => {
                      inPathRefs.current[1] = el;
                    }}
                    d="M 110 120 L 136 120"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <path
                    ref={(el) => {
                      inPathRefs.current[2] = el;
                    }}
                    d="M 110 204 C 124 204, 126 120, 136 120"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />

                  {/* Agent -> Actions */}
                  <path
                    ref={(el) => {
                      outPathRefs.current[0] = el;
                    }}
                    d="M 184 120 C 194 120, 196 36, 210 36"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <path
                    ref={(el) => {
                      outPathRefs.current[1] = el;
                    }}
                    d="M 184 120 L 210 120"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <path
                    ref={(el) => {
                      outPathRefs.current[2] = el;
                    }}
                    d="M 184 120 C 194 120, 196 204, 210 204"
                    fill="none"
                    stroke="rgba(255,255,255,0.25)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                </g>

                {/* ─── COLUMN 1: INPUT NODES (106x44, dark #262626, mono 10.5-11px label) ─── */}
                <g>
                  {/* Node 1: NEW LEAD */}
                  <g transform="translate(4, 14)">
                    <rect
                      width="106"
                      height="44"
                      rx="6"
                      fill="#262626"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="1"
                    />
                    <text
                      x="53"
                      y="26.5"
                      fill="rgba(255,255,255,0.88)"
                      fontFamily="var(--ff-mono, 'IBM Plex Mono', monospace)"
                      fontSize="11"
                      fontWeight="500"
                      letterSpacing="0.04em"
                      textAnchor="middle"
                    >
                      NEW LEAD
                    </text>
                  </g>

                  {/* Node 2: INBOUND EMAIL */}
                  <g transform="translate(4, 98)">
                    <rect
                      width="106"
                      height="44"
                      rx="6"
                      fill="#262626"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="1"
                    />
                    <text
                      x="53"
                      y="26.5"
                      fill="rgba(255,255,255,0.88)"
                      fontFamily="var(--ff-mono, 'IBM Plex Mono', monospace)"
                      fontSize="10.5"
                      fontWeight="500"
                      letterSpacing="0.02em"
                      textAnchor="middle"
                    >
                      INBOUND EMAIL
                    </text>
                  </g>

                  {/* Node 3: FORM SUBMIT */}
                  <g transform="translate(4, 182)">
                    <rect
                      width="106"
                      height="44"
                      rx="6"
                      fill="#262626"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="1"
                    />
                    <text
                      x="53"
                      y="26.5"
                      fill="rgba(255,255,255,0.88)"
                      fontFamily="var(--ff-mono, 'IBM Plex Mono', monospace)"
                      fontSize="11"
                      fontWeight="500"
                      letterSpacing="0.04em"
                      textAnchor="middle"
                    >
                      FORM SUBMIT
                    </text>
                  </g>
                </g>

                {/* ─── COLUMN 2: CENTER AI AGENT (centered at 160, 120) ─── */}
                <g transform="translate(160, 120)">
                  {/* Soft pulsing halo */}
                  <circle
                    r="30"
                    fill="color-mix(in srgb, var(--accent) 20%, transparent)"
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "center",
                      animation: "hero-halo-pulse 2s cubic-bezier(0.2, 0.8, 0.4, 1) infinite",
                    }}
                  />

                  {/* Packet impact flash halo */}
                  <circle
                    ref={agentHaloRef}
                    r="30"
                    fill="color-mix(in srgb, var(--accent) 35%, transparent)"
                    style={{ transformBox: "fill-box", transformOrigin: "center", opacity: 0 }}
                  />

                  {/* Slowly rotating dashed ring (20s) */}
                  <circle
                    r="33"
                    fill="none"
                    stroke="color-mix(in srgb, var(--accent) 35%, transparent)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                    style={{
                      transformBox: "fill-box",
                      transformOrigin: "center",
                      animation: "hero-agent-dash-spin 20s linear infinite",
                    }}
                  />

                  {/* Inner Dark Circle with 2px Accent Ring */}
                  <circle
                    r="24"
                    fill="#141414"
                    stroke="var(--accent)"
                    strokeWidth="2"
                  />

                  {/* Centre Logo Mark (Sparkle) */}
                  <image
                    href="/brand/hegxai-mark-color.png"
                    x="-16"
                    y="-16"
                    width="32"
                    height="32"
                    preserveAspectRatio="xMidYMid meet"
                  />

                  {/* Agent Tag (10px IBM Plex Mono 600) */}
                  <text
                    x="0"
                    y="40"
                    fill="var(--accent-on-dark)"
                    fontFamily="var(--ff-mono, 'IBM Plex Mono', monospace)"
                    fontSize="10"
                    fontWeight="600"
                    letterSpacing="0.04em"
                    textAnchor="middle"
                  >
                    AI AGENT
                  </text>
                </g>

                {/* ─── COLUMN 3: ACTION NODES (106x44, dark #262626, mono 10-10.5px label) ─── */}
                <g>
                  {/* Node 1: ROUTE TO OWNER */}
                  <g
                    transform="translate(210, 14)"
                    ref={(el) => {
                      actionNodeRefs.current[0] = el;
                    }}
                  >
                    <rect
                      width="106"
                      height="44"
                      rx="6"
                      fill="#262626"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="1"
                    />
                    <text
                      x="53"
                      y="26.5"
                      fill="rgba(255,255,255,0.88)"
                      fontFamily="var(--ff-mono, 'IBM Plex Mono', monospace)"
                      fontSize="10"
                      fontWeight="500"
                      letterSpacing="0.02em"
                      textAnchor="middle"
                    >
                      ROUTE TO OWNER
                    </text>
                  </g>

                  {/* Node 2: DRAFT REPLY */}
                  <g
                    transform="translate(210, 98)"
                    ref={(el) => {
                      actionNodeRefs.current[1] = el;
                    }}
                  >
                    <rect
                      width="106"
                      height="44"
                      rx="6"
                      fill="#262626"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="1"
                    />
                    <text
                      x="53"
                      y="26.5"
                      fill="rgba(255,255,255,0.88)"
                      fontFamily="var(--ff-mono, 'IBM Plex Mono', monospace)"
                      fontSize="10.5"
                      fontWeight="500"
                      letterSpacing="0.03em"
                      textAnchor="middle"
                    >
                      DRAFT REPLY
                    </text>
                  </g>

                  {/* Node 3: UPDATE CRM */}
                  <g
                    transform="translate(210, 182)"
                    ref={(el) => {
                      actionNodeRefs.current[2] = el;
                    }}
                  >
                    <rect
                      width="106"
                      height="44"
                      rx="6"
                      fill="#262626"
                      stroke="rgba(255,255,255,0.12)"
                      strokeWidth="1"
                    />
                    <text
                      x="53"
                      y="26.5"
                      fill="rgba(255,255,255,0.88)"
                      fontFamily="var(--ff-mono, 'IBM Plex Mono', monospace)"
                      fontSize="10.5"
                      fontWeight="500"
                      letterSpacing="0.04em"
                      textAnchor="middle"
                    >
                      UPDATE CRM
                    </text>
                  </g>
                </g>

                {/* ─── PACKETS (5px accent dots with glow traveling along paths) ─── */}
                <g>
                  {[0, 1, 2, 3].map((i) => (
                    <circle
                      key={i}
                      ref={(el) => {
                        packetCircleRefs.current[i] = el;
                      }}
                      r="2.5"
                      fill="var(--accent)"
                      stroke="#141414"
                      strokeWidth="0.5"
                      style={{
                        opacity: 0,
                        filter: "drop-shadow(0 0 4px var(--accent))",
                        pointerEvents: "none",
                      }}
                    />
                  ))}
                </g>
              </svg>
            </div>

            {/* 1px Vertical Divider */}
            <div
              className="hero-workflow-divider"
              style={{
                width: "1px",
                height: "100%",
                background: "rgba(255, 255, 255, 0.08)",
              }}
            />

            {/* ─── RIGHT: EVENT FEED (4 ROWS, EVENLY SPACED, NO TRUNCATION) ─── */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                paddingLeft: "4px",
                overflow: "hidden",
              }}
            >
              {/* Title */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "8px",
                  paddingBottom: "4px",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                    fontSize: "10px",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    color: "rgba(255,255,255,0.7)",
                    textTransform: "uppercase",
                  }}
                >
                  LIVE ACTIVITY
                </span>
                <span
                  style={{
                    width: "4px",
                    height: "4px",
                    borderRadius: "50%",
                    background: "var(--accent)",
                  }}
                />
              </div>

              {/* 4 Event Rows: evenly spaced, text 12.5px, check 9.5px, timestamp "now" / "just now" */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  flex: 1,
                  justifyContent: "space-between",
                }}
              >
                {feedRows.map((row, idx) => (
                  <div
                    key={row.id}
                    className="hero-feed-row"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "6px",
                      height: "42px",
                      padding: "0 8px",
                      borderRadius: "var(--r-0, 0px)",
                      background: idx === 0 ? "rgba(255,255,255,0.04)" : "transparent",
                      border: idx === 0 ? "1px solid color-mix(in srgb, var(--accent) 30%, transparent)" : "1px solid transparent",
                      animation: row.isNew ? "hero-feed-slide-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards" : undefined,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "7px", minWidth: 0, flex: 1 }}>
                      {/* Icon: spinning ring for 0.6s or accent check */}
                      {row.isNew ? (
                        <span
                          style={{
                            width: "14px",
                            height: "14px",
                            borderRadius: "50%",
                            border: "1.5px solid color-mix(in srgb, var(--accent) 30%, transparent)",
                            borderTopColor: "var(--accent)",
                            animation: "hero-icon-spin 0.6s linear infinite",
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            width: "14px",
                            height: "14px",
                            borderRadius: "50%",
                            background: "rgba(125, 147, 255, 0.16)",
                            color: "var(--accent-on-dark)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "9.5px",
                            fontWeight: 800,
                            lineHeight: 1,
                            flexShrink: 0,
                          }}
                        >
                          ✓
                        </span>
                      )}

                      <span
                        style={{
                          fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                          fontSize: "12.5px",
                          fontWeight: idx === 0 ? 600 : 400,
                          color: idx === 0 ? "#ffffff" : "rgba(255,255,255,0.72)",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {row.text}
                      </span>
                    </div>

                    {/* Timestamp: "now" / "just now" */}
                    <span
                      style={{
                        fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                        fontSize: "10px",
                        color: idx === 0 ? "var(--accent-on-dark)" : "rgba(255,255,255,0.7)",
                        whiteSpace: "nowrap",
                        marginLeft: "4px",
                        flexShrink: 0,
                      }}
                    >
                      {idx === 0 ? "now" : "just now"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ─── 3. BOTTOM STRIP: CHIPS + 12-SEGMENT LOOPING PROGRESS BAR ─── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "8px",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              flexShrink: 0,
            }}
          >
            {/* Chips */}
            <div className="hero-workflow-chips" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              {["LEAD ROUTING", "REPORTING", "OUTREACH"].map((chip) => (
                <span
                  key={chip}
                  style={{
                    fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                    fontSize: "10px",
                    fontWeight: 500,
                    letterSpacing: "0.06em",
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {chip}
                </span>
              ))}
            </div>

            {/* 12-Segment Progress Bar (loops fill with accent, 6s) */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "3px",
              }}
              className="hero-workflow-progress"
              title="Pipeline activity loop"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: "8px",
                    height: "3px",
                    borderRadius: "var(--r-0, 0px)",
                    background: i <= progressStep ? "var(--accent)" : "rgba(255,255,255,0.12)",
                    transition: "background 0.2s ease",
                  }}
                />
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ─── SCOPED KEYFRAME ANIMATIONS ─── */}
      <style>{`
        .hero-workflow-panel {
          width: 576px;
          height: 436px;
          max-width: 94vw;
        }
        @media (max-width: 1199px) {
          .hero-workflow-panel {
            width: 456px;
            height: 390px;
          }
        }
        @media (max-width: 767px) {
          .hero-workflow-panel {
            width: 100% !important;
            max-width: 420px !important;
            height: auto !important;
            min-height: auto !important;
            padding: 8px !important;
          }
          .hero-workflow-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          .hero-workflow-bottom { flex-direction: column; align-items: stretch !important; gap: 6px; }
          .hero-workflow-chips { flex-wrap: nowrap; white-space: nowrap; gap: 14px !important; overflow-x: auto; scrollbar-width: none; }
          .hero-workflow-chips span { font-size: 10px !important; flex-shrink: 0; }
          .hero-workflow-progress { width: 100%; }
          .hero-workflow-progress > div { flex: 1; }
          .hero-workflow-divider {
            display: none !important;
          }
          .hero-feed-row:nth-child(n+4) {
            display: none !important;
          }
        }

        @keyframes hero-live-pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.35;
            transform: scale(1.35);
          }
        }

        @keyframes hero-halo-pulse {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.25);
            opacity: 0;
          }
        }

        @keyframes hero-agent-dash-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes hero-feed-slide-in {
          from {
            opacity: 0.85;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes hero-icon-spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
