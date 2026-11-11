"use client";

import React from "react";
import { useBooking } from "@/components/ui/BookingProvider";
import { Button } from "@/components/ui/shared";

interface BookingAuditButtonProps {
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "inverse" | "accent";
  size?: "sm" | "md";
  className?: string;
  style?: React.CSSProperties;
}

export default function BookingAuditButton({
  children = "Book a free audit",
  variant = "primary",
  size = "md",
  className = "",
  style,
}: BookingAuditButtonProps) {
  const { openBooking, preloadBooking, bookingUrl } = useBooking();

  const handleBookingClick = (e: React.MouseEvent<HTMLElement>) => {
    if (e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      openBooking();
    }
  };

  return (
    <Button
      href={bookingUrl || "/#contact"}
      variant={variant}
      size={size}
      className={className}
      style={style}
      onClick={handleBookingClick}
      onPointerEnter={preloadBooking}
      onFocus={preloadBooking}
    >
      {children}
    </Button>
  );
}

