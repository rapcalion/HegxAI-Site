"use client";

import React, { createContext, useContext, useCallback, useRef, useState } from "react";
import { siteContent, getCalLink } from "@/content/site";
import LogoMark from "@/components/ui/LogoMark";
import type { GlobalCal, GlobalCalWithoutNs } from "@calcom/embed-core";

export interface BookingOptions {
  name?: string;
  email?: string;
  event?: React.MouseEvent | React.SyntheticEvent;
}

interface BookingContextType {
  openBooking: (options?: BookingOptions) => void;
  preloadBooking: () => void;
  bookingUrl: string;
  calLink: string;
}

const BookingContext = createContext<BookingContextType | null>(null);

function ConfirmingOverlay() {
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="confirming-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        backgroundColor: "var(--bg, #F4EFE6)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        opacity: mounted ? 1 : 0,
        transition: "opacity 120ms ease-out",
        pointerEvents: "auto",
      }}
    >
      <LogoMark height={36} />
      <span
        style={{
          fontFamily: "var(--ff-mono, 'IBM Plex Mono', monospace)",
          fontSize: "14px",
          fontWeight: 500,
          letterSpacing: "0.04em",
          color: "var(--ink, #141414)",
        }}
      >
        Confirming your booking…
      </span>
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .confirming-overlay {
            transition: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  );
}

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const calPromiseRef = useRef<Promise<GlobalCal | GlobalCalWithoutNs> | null>(null);
  const subscribedRef = useRef(false);
  const isBookingHandledRef = useRef(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const bookingUrl = siteContent.contact.bookingUrl || "";
  const calLink = getCalLink(bookingUrl);

  const handleBookingSuccess = useCallback(() => {
    if (isBookingHandledRef.current) return;
    isBookingHandledRef.current = true;
    setIsConfirming(true);

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const delay = prefersReduced ? 0 : 120;
    setTimeout(() => {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.assign("/thanks?source=cal");
    }, delay);
  }, []);

  const initCal = useCallback(() => {
    if (typeof window === "undefined") return Promise.reject(new Error("SSR"));
    if (!calPromiseRef.current) {
      calPromiseRef.current = (async () => {
        const { getCalApi } = await import("@calcom/embed-react");
        const cal = await getCalApi();
        cal("ui", {
          theme: "light",
          cssVarsPerTheme: {
            light: {
              "cal-brand": "#5170FF",
              "cal-brand-accent": "#5170FF",
              "cal-text": "#141414",
            },
            dark: {
              "cal-brand": "#5170FF",
              "cal-brand-accent": "#5170FF",
              "cal-text": "#ffffff",
            },
          },
        });

        // Subscribe once to booking success events (guard with a ref, never rescheduleBookingSuccessful)
        if (!subscribedRef.current) {
          subscribedRef.current = true;
          cal("on", {
            action: "bookingSuccessful",
            callback: handleBookingSuccess,
          });
          cal("on", {
            action: "bookingSuccessfulV2",
            callback: handleBookingSuccess,
          });
        }

        return cal;
      })();
    }
    return calPromiseRef.current;
  }, [handleBookingSuccess]);

  const preloadBooking = useCallback(() => {
    if (bookingUrl) {
      initCal().catch((err) => {
        console.warn("Failed to preload Cal embed", err);
      });
    }
  }, [bookingUrl, initCal]);

  const openBooking = useCallback(
    async (options?: BookingOptions) => {
      if (options?.event) {
        options.event.preventDefault();
      }

      if (!bookingUrl) {
        const contactEl = document.getElementById("contact");
        if (contactEl) {
          contactEl.scrollIntoView({ behavior: "smooth" });
        } else {
          window.location.hash = "contact";
        }
        return;
      }

      // Read form input values if available and not explicitly provided
      let prefillName = options?.name?.trim();
      let prefillEmail = options?.email?.trim();

      if (!prefillName && typeof document !== "undefined") {
        const nameInput = document.querySelector<HTMLInputElement>('input[name="name"]');
        if (nameInput?.value) prefillName = nameInput.value.trim();
      }
      if (!prefillEmail && typeof document !== "undefined") {
        const emailInput = document.querySelector<HTMLInputElement>('input[name="email"]');
        if (emailInput?.value) prefillEmail = emailInput.value.trim();
      }

      try {
        // Fallback to opening bookingUrl in a new tab if embed doesn't initialize within 6s
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Cal.com embed loading timed out")), 6000)
        );

        const cal = await Promise.race([initCal(), timeoutPromise]);

        const config: Record<string, string> = {};
        if (prefillName) config.name = prefillName;
        if (prefillEmail) config.email = prefillEmail;

        cal("modal", {
          calLink,
          config,
        });
      } catch (err) {
        console.warn("Cal embed failed to open modal, falling back to new tab", err);
        window.open(bookingUrl, "_blank", "noopener,noreferrer");
      }
    },
    [bookingUrl, calLink, initCal]
  );

  return (
    <BookingContext.Provider value={{ openBooking, preloadBooking, bookingUrl, calLink }}>
      {children}
      {isConfirming && <ConfirmingOverlay />}
    </BookingContext.Provider>
  );
}

export function useBooking(): BookingContextType {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
