import type { MetadataRoute } from "next";
import { SITE_URL, HAS_ENV_SITE_URL } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const isStagingOrMissing =
    !HAS_ENV_SITE_URL ||
    SITE_URL.includes("localhost") ||
    SITE_URL.includes("vercel.app");

  if (isStagingOrMissing) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
      sitemap: `${SITE_URL}/sitemap.xml`,
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/thanks"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
