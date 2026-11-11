"use client";

import { useRef, useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionBar, SectionColumn, Button } from "@/components/ui/shared";
import SectionFrame from "@/components/ui/SectionFrame";
import { useBooking } from "@/components/ui/BookingProvider";
import { siteContent } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CTABlock() {
  const router = useRouter();
  const { openBooking, preloadBooking, bookingUrl } = useBooking();
  const cardRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const mountTsRef = useRef<number>(0);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    mountTsRef.current = Date.now();

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    gsap.fromTo(
      cardRef.current,
      { scale: 0.97, opacity: 0.85 },
      {
        scale: 1,
        opacity: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
          end: "top 55%",
          scrub: 1,
        },
      }
    );
  }, []);

  const handleBookingClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      openBooking({
        name: formData.name,
        email: formData.email,
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedCompany = formData.company.trim();
    const trimmedMessage = formData.message.trim();

    // Client Validation
    if (!trimmedName) {
      setStatus("error");
      setErrorMessage("Please enter your name.");
      return;
    }
    if (trimmedName.length > 100) {
      setStatus("error");
      setErrorMessage("Name must be under 100 characters.");
      return;
    }
    if (!trimmedEmail || !EMAIL_REGEX.test(trimmedEmail)) {
      setStatus("error");
      setErrorMessage("Please enter a valid work email address.");
      return;
    }
    if (trimmedEmail.length > 254) {
      setStatus("error");
      setErrorMessage("Email must be under 254 characters.");
      return;
    }
    if (trimmedCompany.length > 120) {
      setStatus("error");
      setErrorMessage("Company name must be under 120 characters.");
      return;
    }
    if (!trimmedMessage) {
      setStatus("error");
      setErrorMessage("Please let us know what you want to automate.");
      return;
    }
    if (trimmedMessage.length > 1500) {
      setStatus("error");
      setErrorMessage("Message must be under 1500 characters.");
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          company: trimmedCompany,
          message: trimmedMessage,
          website: honeypot,
          ts: mountTsRef.current,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.ok) {
        setStatus("success");
        try {
          router.push("/thanks?source=form");
        } catch {
          // Inline success fallback remains visible if redirect throws
        }
      } else {
        setStatus("error");
        if (res.status === 429 || data?.error === "rate_limited") {
          setErrorMessage("Too many requests. Please wait a bit before submitting again.");
        } else if (data?.error === "validation") {
          setErrorMessage("Please check your entries and try again.");
        } else {
          setErrorMessage("Unable to send message right now. Please try again or book a call.");
        }
      }
    } catch {
      setStatus("error");
      setErrorMessage("A network error occurred. Please check your connection and try again.");
    }
  };

  return (
    <SectionFrame
      id="contact"
      ariaLabelledby="contact-title"
      theme="cream"
      style={{
        background: "var(--bg)",
      }}
    >
      <SectionColumn style={{ padding: "0 var(--col-pad, 24px)" }}>
        <SectionBar label="CONTACT" sectionId="contact" />

        <div
          ref={cardRef}
          className="contact-card-wrap"
          style={{
            background: "var(--surface)",
            border: "1px solid rgba(20,20,20,0.12)",
            borderRadius: "var(--r-card, 12px)",
            marginTop: "var(--heading-content-gap, 40px)",
            position: "relative",
            boxShadow: "none",
            overflow: "hidden",
          }}
        >
          <div className="contact-grid">
            {/* ─── LEFT: HEADING + COPY + PRIMARY BOOKING BUTTON + 3-STEP LIST ─── */}
            <div className="contact-left">
              <div>
                <h2
                  id="contact-title"
                  style={{
                    fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                    fontSize: "clamp(28px, 5vw, 48px)",
                    fontWeight: 500,
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                    color: "var(--ink)",
                    marginBottom: "16px",
                  }}
                >
                  Transform your business with intelligent AI automation
                </h2>

                <p
                  style={{
                    fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                    fontSize: "15px",
                    fontWeight: 400,
                    lineHeight: 1.6,
                    color: "#5f5b52",
                    maxWidth: "48ch",
                    marginBottom: "24px",
                  }}
                >
                  Start with a free audit. We&apos;ll map your biggest automation opportunities and
                  show you exactly what&apos;s possible — no commitment required.
                </p>

                <div style={{ marginBottom: "36px" }}>
                  <Button
                    href={bookingUrl || "#contact"}
                    variant="primary"
                    className="btn-mobile-full"
                    style={{ minHeight: "52px" }}
                    onClick={handleBookingClick}
                    onPointerEnter={preloadBooking}
                    onFocus={preloadBooking}
                  >
                    Book a free audit
                  </Button>
                </div>
              </div>

              {/* 3-Step Process List */}
              <div className="contact-steps-list">
                {[
                  { num: "01", text: "Free audit call" },
                  { num: "02", text: "Automation map" },
                  { num: "03", text: "Build plan" },
                ].map((step, idx) => (
                  <div
                    key={idx}
                    className="contact-step-row"
                    style={{
                      borderTop: idx === 0 ? "1px solid rgba(20,20,20,0.12)" : "none",
                      borderBottom: "1px solid rgba(20,20,20,0.12)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <span
                        style={{
                          width: "8px",
                          height: "8px",
                          background: "var(--ink)",
                          display: "inline-block",
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                          fontSize: "16px",
                          fontWeight: 500,
                          color: "var(--ink)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {step.text}
                      </span>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                        fontSize: "12px",
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        color: "var(--muted)",
                      }}
                    >
                      {step.num}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── RIGHT: CONTACT FORM / SUCCESS STATE ─── */}
            <div className="contact-right">
              {status === "success" ? (
                <div
                  className="contact-success-box"
                  style={{
                    background: "var(--bg)",
                    border: "1px solid rgba(20,20,20,0.12)",
                    padding: "36px 28px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "380px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      background: "var(--ink)",
                      color: "var(--accent-text)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: "var(--ff-mono, monospace)",
                      fontSize: "20px",
                      fontWeight: 700,
                      marginBottom: "20px",
                    }}
                  >
                    ✓
                  </div>
                  <h3
                    style={{
                      fontFamily: "var(--ff-display, 'Inter Tight', sans-serif)",
                      fontSize: "24px",
                      fontWeight: 500,
                      color: "var(--ink)",
                      marginBottom: "12px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Thanks, we&apos;ll be in touch soon.
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                      fontSize: "15px",
                      color: "#5f5b52",
                      lineHeight: 1.6,
                      maxWidth: "38ch",
                      marginBottom: "28px",
                    }}
                  >
                    We received your message and will review your workflow requirements within 24 hours.
                  </p>
                  <Button
                    href={bookingUrl || "#contact"}
                    variant="secondary"
                    className="btn-mobile-full"
                    style={{
                      minHeight: "52px",
                      width: "100%",
                      maxWidth: "280px",
                      borderColor: "var(--ink)",
                      color: "var(--ink)",
                      justifyContent: "center",
                    }}
                    onClick={handleBookingClick}
                    onPointerEnter={preloadBooking}
                    onFocus={preloadBooking}
                  >
                    Book a call instead
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  className="contact-form"
                  style={{
                    background: "var(--bg)",
                    border: "1px solid rgba(20,20,20,0.12)",
                    padding: "28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                  }}
                >
                  {/* Honeypot field (hidden from view & screen readers) */}
                  <div
                    style={{
                      position: "absolute",
                      left: "-9999px",
                      opacity: 0,
                      height: 0,
                      overflow: "hidden",
                    }}
                    aria-hidden="true"
                  >
                    <label htmlFor="contact-website">Website</label>
                    <input
                      id="contact-website"
                      type="text"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>

                  {/* Hidden timestamp field */}
                  <input type="hidden" name="ts" defaultValue="0" />

                  {/* Path clarity mono line */}
                  <div
                    style={{
                      fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                      fontSize: "11px",
                      fontWeight: 500,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <span style={{ color: "var(--accent-text)" }}>{"//"}</span>
                    <span>or send us a message</span>
                  </div>

                  {/* Name field */}
                  <div>
                    <label
                      htmlFor="contact-name"
                      style={{
                        display: "block",
                        fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                        fontSize: "12px",
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--ink)",
                        marginBottom: "6px",
                      }}
                    >
                      Name *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      maxLength={100}
                      autoComplete="name"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="contact-input"
                    />
                  </div>

                  {/* Work Email field */}
                  <div>
                    <label
                      htmlFor="contact-email"
                      style={{
                        display: "block",
                        fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                        fontSize: "12px",
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--ink)",
                        marginBottom: "6px",
                      }}
                    >
                      Work Email *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      maxLength={254}
                      autoComplete="email"
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="contact-input"
                    />
                  </div>

                  {/* Company field */}
                  <div>
                    <label
                      htmlFor="contact-company"
                      style={{
                        display: "block",
                        fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                        fontSize: "12px",
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--ink)",
                        marginBottom: "6px",
                      }}
                    >
                      Company
                    </label>
                    <input
                      id="contact-company"
                      name="company"
                      type="text"
                      maxLength={120}
                      autoComplete="organization"
                      placeholder="Acme Corp"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="contact-input"
                    />
                  </div>

                  {/* Message field */}
                  <div>
                    <label
                      htmlFor="contact-message"
                      style={{
                        display: "block",
                        fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                        fontSize: "12px",
                        fontWeight: 500,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--ink)",
                        marginBottom: "6px",
                      }}
                    >
                      What do you want to automate? *
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      required
                      maxLength={1500}
                      placeholder="Describe your current manual steps or bottleneck workflows..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="contact-textarea"
                    />
                  </div>

                  {/* Error live region */}
                  <div
                    role="region"
                    aria-live="polite"
                    aria-atomic="true"
                    style={{ minHeight: status === "error" ? "auto" : "0px" }}
                  >
                    {status === "error" && (
                      <div
                        role="alert"
                        style={{
                          background: "rgba(179, 38, 30, 0.08)",
                          border: "1px solid rgba(179, 38, 30, 0.35)",
                          padding: "10px 14px",
                          fontFamily: "var(--ff-body, 'DM Sans', sans-serif)",
                          fontSize: "13px",
                          color: "#B3261E",
                          lineHeight: 1.4,
                          display: "flex",
                          alignItems: "flex-start",
                          gap: "8px",
                        }}
                      >
                        <span style={{ fontWeight: 700, fontSize: "14px", color: "#B3261E", lineHeight: 1 }}>⚠</span>
                        <div style={{ color: "#B3261E" }}>
                          <div>{errorMessage}</div>
                          {siteContent.contact.email && (
                            <div style={{ marginTop: "6px", fontSize: "12px", color: "#B3261E" }}>
                              Or email us at{" "}
                              <a
                                href={`mailto:${siteContent.contact.email}`}
                                style={{ textDecoration: "underline", color: "inherit", fontWeight: 600 }}
                              >
                                {siteContent.contact.email}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={status === "submitting"}
                    className="btn-mobile-full"
                    style={{
                      width: "100%",
                      minHeight: "52px",
                      justifyContent: "center",
                      cursor: status === "submitting" ? "not-allowed" : "pointer",
                    }}
                  >
                    {status === "submitting" ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 16 16"
                          fill="none"
                          style={{ animation: "contact-spin 0.8s linear infinite" }}
                          aria-hidden="true"
                        >
                          <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                          <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span>Sending…</span>
                      </span>
                    ) : (
                      <span>Send message</span>
                    )}
                  </Button>

                  {/* Under-form notice */}
                  <p
                    style={{
                      fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
                      fontSize: "11px",
                      color: "var(--muted)",
                      margin: 0,
                      textAlign: "center",
                      letterSpacing: "0.02em",
                    }}
                  >
                    We only use this to reply to you.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </SectionColumn>

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0px;
          align-items: stretch;
        }
        @media (min-width: 900px) {
          .contact-grid {
            grid-template-columns: 1.05fr 1fr;
            gap: 0px;
            align-items: stretch;
          }
        }
        .contact-left {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 20px;
          box-sizing: border-box;
        }
        @media (min-width: 900px) {
          .contact-left {
            padding: 32px;
            height: 100%;
          }
        }
        .contact-right {
          padding: 0 20px 20px;
          box-sizing: border-box;
        }
        @media (min-width: 900px) {
          .contact-right {
            padding: 32px;
            height: 100%;
          }
        }
        .contact-steps-list {
          display: flex;
          flex-direction: column;
          margin-top: 36px;
        }
        @media (min-width: 900px) {
          .contact-steps-list {
            margin-top: auto;
          }
        }
        .contact-step-row {
          height: 72px;
          min-height: 72px;
          max-height: 72px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
        }
        @media (max-width: 767px) {
          .contact-step-row {
            padding: 0 12px;
          }
        }
        .contact-input {
          width: 100%;
          height: 52px;
          min-height: 52px;
          box-sizing: border-box;
          padding: 0 16px;
          border-radius: 0px;
          border: 1px solid rgba(20, 20, 20, 0.22);
          background: #ffffff;
          color: var(--ink);
          font-family: var(--ff-body, 'DM Sans', sans-serif);
          font-size: 16px;
          transition: border-color 0.2s ease;
        }
        .contact-input:hover {
          border-color: rgba(20, 20, 20, 0.5);
        }
        .contact-input:focus,
        .contact-input:focus-visible {
          outline: 2px solid var(--accent-text) !important;
          outline-offset: 2px !important;
          border-color: var(--accent-text) !important;
        }
        .contact-textarea {
          width: 100%;
          min-height: 110px;
          box-sizing: border-box;
          padding: 14px 16px;
          border-radius: 0px;
          border: 1px solid rgba(20, 20, 20, 0.22);
          background: #ffffff;
          color: var(--ink);
          font-family: var(--ff-body, 'DM Sans', sans-serif);
          font-size: 16px;
          line-height: 1.5;
          resize: vertical;
          transition: border-color 0.2s ease;
        }
        .contact-textarea:hover {
          border-color: rgba(20, 20, 20, 0.5);
        }
        .contact-textarea:focus,
        .contact-textarea:focus-visible {
          outline: 2px solid var(--accent-text) !important;
          outline-offset: 2px !important;
          border-color: var(--accent-text) !important;
        }
        @keyframes contact-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </SectionFrame>
  );
}
