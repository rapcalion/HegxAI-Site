import type { Metadata, Viewport } from "next";
import { Anton, Inter_Tight, DM_Sans, IBM_Plex_Mono } from "next/font/google";
import { SITE_URL } from "@/lib/site-url";
import { siteContent } from "@/content/site";
import JsonLd from "@/components/seo/JsonLd";
import { BookingProvider } from "@/components/ui/BookingProvider";
import "./globals.css";

const interTight = Inter_Tight({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-logo",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const ibmMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F4EFE6",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteContent.seo.defaultTitle,
    template: siteContent.seo.titleTemplate,
  },
  description: siteContent.seo.description,
  applicationName: siteContent.seo.applicationName,
  openGraph: {
    type: "website",
    siteName: siteContent.seo.siteName,
    locale: siteContent.seo.locale,
    url: SITE_URL,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: siteContent.seo.ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/twitter-image"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
  },
};

const organizationJsonLd: Record<string, unknown> = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteContent.seo.siteName,
  url: SITE_URL,
  logo: `${SITE_URL}/brand/hegxai-mark-color.png`,
  description: siteContent.seo.description,
};

if (siteContent.contact.email) {
  organizationJsonLd.email = siteContent.contact.email;
  organizationJsonLd.contactPoint = {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: siteContent.contact.email,
  };
}

if (siteContent.founder?.name) {
  organizationJsonLd.founder = {
    "@type": "Person",
    name: siteContent.founder.name,
    jobTitle: siteContent.founder.role || "Founder",
  };
}

if (siteContent.socials && siteContent.socials.length > 0) {
  organizationJsonLd.sameAs = siteContent.socials.map((s) => s.href);
}

const webSiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteContent.seo.siteName,
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${interTight.variable} ${anton.variable} ${dmSans.variable} ${ibmMono.variable}`}
    >
      <head>
        <JsonLd data={organizationJsonLd} />
        <JsonLd data={webSiteJsonLd} />
      </head>
      <body style={{ fontFamily: "var(--ff-body, 'DM Sans', sans-serif)" }}>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <BookingProvider>{children}</BookingProvider>
      </body>
    </html>
  );
}
