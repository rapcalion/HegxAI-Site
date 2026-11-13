import Image from "next/image";

interface LogoMarkProps {
  size?: number; // px height
  height?: number | string;
  priority?: boolean;
  className?: string;
  isDark?: boolean;
  "aria-hidden"?: boolean | "true" | "false";
  alt?: string;
  style?: React.CSSProperties;
}

export default function LogoMark({
  size,
  height,
  priority = false,
  className = "",
  isDark = false,
  "aria-hidden": ariaHidden = true,
  alt = "HEGXAI mark",
  style,
}: LogoMarkProps) {
  // Use CSS height with width: auto to preserve the intrinsic 1:1 aspect ratio
  const h = height !== undefined
    ? (typeof height === "number" ? `${height}px` : height)
    : (size !== undefined ? `${size}px` : "var(--logo-mark-h, 40px)");

  return (
    <Image
      src="/brand/hegxai-mark-color.png"
      alt={ariaHidden ? "" : alt}
      width={600}
      height={600}
      sizes="40px"
      priority={priority}
      aria-hidden={ariaHidden ? "true" : undefined}
      className={className}
      style={{
        display: "block",
        height: h,
        width: "auto",
        filter: isDark
          ? "drop-shadow(0 0 14px color-mix(in srgb, var(--accent) 45%, transparent))"
          : undefined,
        flexShrink: 0,
        ...style,
      }}
    />
  );
}

