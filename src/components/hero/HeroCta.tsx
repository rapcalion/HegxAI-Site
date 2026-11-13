"use client";
import { Button } from "@/components/ui/shared";
import { useBooking } from "@/components/ui/BookingProvider";

export default function HeroCta() {
  const { openBooking, preloadBooking, bookingUrl } = useBooking();

  return (
    <div
      className="hero-cta-wrapper"
      style={{
        position: "relative",
        zIndex: 10,
        marginBottom: "64px",
        overflow: "hidden",
        display: "inline-block",
        padding: "4px",
        width: "100%",
        maxWidth: "320px",
      }}
    >
      <Button
        href={bookingUrl || "#contact"}
        variant="primary"
        brackets={true}
        style={{ width: "100%", justifyContent: "center" }}
        onClick={(e) => {
          if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
            e.preventDefault();
            openBooking();
          }
        }}
        onPointerEnter={preloadBooking}
        onFocus={preloadBooking}
      >
        Book a free audit
      </Button>
    </div>
  );
}

