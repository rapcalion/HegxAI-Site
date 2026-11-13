const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/+$/, "");

/**
 * True only when NEXT_PUBLIC_SITE_URL is explicitly set in the environment.
 */
export const HAS_ENV_SITE_URL = Boolean(envUrl);

/**
 * Site URL with trailing slashes trimmed.
 * Falls back to http://localhost:3000 in development, or when unconfigured to prevent URL instantiation errors.
 */
export const SITE_URL: string =
  envUrl || (process.env.NODE_ENV === "development" ? "http://localhost:3000" : "http://localhost:3000");

