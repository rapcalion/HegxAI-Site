"use client";
import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";

const GlyphField = dynamic(() => import("@/components/hero/GlyphField"), {
  ssr: false,
});

function subscribe(callback: () => void) {
  window.addEventListener("resize", callback);
  return () => window.removeEventListener("resize", callback);
}

function getSnapshot() {
  return window.innerWidth >= 768 && !window.matchMedia("(pointer: coarse)").matches;
}

function getServerSnapshot() {
  return false;
}

export default function HeroDesktopGlyphField() {
  const isDesktop = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  if (!isDesktop) return null;

  return (
    <div className="hidden min-[768px]:block">
      <GlyphField />
    </div>
  );
}

