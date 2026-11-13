/**
 * Trims whitespace and trailing slashes, and validates that the value is a valid http(s) URL.
 * Returns the normalized URL string if valid, or null to fall through.
 */
function cleanAndValidate(val: unknown): string | null {
  if (typeof val !== "string") return null;
  const trimmed = val.trim().replace(/\/+$/, "");
  if (!trimmed) return null;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return trimmed;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Resolves the site URL evaluated at runtime on the server.
 * Resolution order:
 * 1. process.env["SITE_URL"] (bracket access so bundler does not inline it)
 * 2. process.env["NEXT_PUBLIC_SITE_URL"] (bracket access, same reason)
 * 3. if process.env.NODE_ENV === "production": "https://hegxai.com"
 * 4. otherwise "http://localhost:3000"
 *
 * Trims whitespace and any trailing slash. Validates with new URL();
 * if invalid, falls through to the next option.
 */
export function getSiteUrl(): string {
  // 1. process.env["SITE_URL"]
  const fromSiteUrl = cleanAndValidate(process.env["SITE_URL"]);
  if (fromSiteUrl) return fromSiteUrl;

  // 2. process.env["NEXT_PUBLIC_SITE_URL"]
  const fromPublicUrl = cleanAndValidate(process.env["NEXT_PUBLIC_SITE_URL"]);
  if (fromPublicUrl) return fromPublicUrl;

  // 3. if process.env.NODE_ENV === "production": "https://hegxai.com"
  if (process.env.NODE_ENV === "production") {
    const prodDefault = cleanAndValidate("https://hegxai.com");
    if (prodDefault) return prodDefault;
  }

  // 4. otherwise "http://localhost:3000"
  return "http://localhost:3000";
}

/**
 * True only when an explicit site URL environment variable is configured and valid.
 */
export const HAS_ENV_SITE_URL = Boolean(
  cleanAndValidate(process.env["SITE_URL"]) || cleanAndValidate(process.env["NEXT_PUBLIC_SITE_URL"])
);

/**
 * Exported site URL evaluated for runtime and static imports.
 */
export const SITE_URL: string = getSiteUrl();
