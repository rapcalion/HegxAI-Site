"use client";

import React from "react";
import { useBooking } from "@/components/ui/BookingProvider";
import { Button } from "@/components/ui/shared";

interface ThanksAuditButtonProps {
  label: string;
}

export default function ThanksAuditButton({ label }: ThanksAuditButtonProps) {
  const { openBooking, preloadBooking, bookingUrl } = useBooking();

  const handleBookingClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      openBooking();
    }
  };

  return (
    <Button
      href={bookingUrl || "#contact"}
      variant="secondary"
      style={{ minHeight: "44px", padding: "12px 24px" }}
      onClick={handleBookingClick}
      onPointerEnter={preloadBooking}
      onFocus={preloadBooking}
    >
      {label}
    </Button>
  );
}

