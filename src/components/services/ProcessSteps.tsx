"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProcessStepItem } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

interface ProcessStepsProps {
  steps: ProcessStepItem[];
}

export default function ProcessSteps({ steps }: ProcessStepsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const stepElements = el.querySelectorAll(".process-step-card");
    if (stepElements.length === 0) return;

    gsap.fromTo(
      stepElements,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <div ref={containerRef} className="process-steps-container">
      {steps.map((step, idx) => (
        <div key={step.tag} className="process-step-card">
          <div className="process-step-header">
            <span className="process-step-num">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <span className="process-step-tag">
              {step.tag}
            </span>
          </div>

          <h3 className="process-step-title">{step.title}</h3>
          <p className="process-step-body">{step.body}</p>
        </div>
      ))}

      <style>{`
        .process-steps-container {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 28px;
          margin-top: 40px;
        }
        .process-step-card {
          border-top: 1px solid var(--hairline, #D9D4C9);
          padding-top: 24px;
          display: flex;
          flex-direction: column;
        }
        .process-step-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
        }
        .process-step-num {
          font-family: var(--ff-mono, monospace);
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.08em;
          color: var(--accent-text, #C94A38);
        }
        .process-step-tag {
          font-family: var(--ff-mono, monospace);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--muted, #5f5b52);
          padding: 2px 8px;
          background: rgba(20, 20, 20, 0.04);
          border: 1px solid var(--line, rgba(20, 20, 20, 0.12));
          border-radius: 4px;
        }
        .process-step-title {
          font-family: var(--ff-display, 'Inter Tight', sans-serif);
          font-size: 20px;
          font-weight: 500;
          line-height: 1.2;
          letter-spacing: -0.01em;
          color: var(--ink, #141414);
          margin: 0 0 10px;
        }
        .process-step-body {
          font-family: var(--ff-body, 'DM Sans', sans-serif);
          font-size: 14px;
          line-height: 1.55;
          color: rgba(20, 20, 20, 0.72);
          margin: 0;
        }
        @media (max-width: 900px) {
          .process-steps-container {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            margin-top: 28px !important;
          }
          .process-step-card {
            padding-top: 18px !important;
          }
        }
      `}</style>
    </div>
  );
}

