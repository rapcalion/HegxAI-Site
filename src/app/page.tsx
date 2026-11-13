import type { Metadata } from "next";
import { siteContent } from "@/content/site";
import { SITE_URL } from "@/lib/site-url";
import JsonLd from "@/components/seo/JsonLd";
import SmoothScrollProvider from "@/lib/SmoothScrollProvider";
import Nav from "@/components/sections/Nav";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Features from "@/components/sections/Features";
import WhyAutomate from "@/components/sections/WhyAutomate";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import CTABlock from "@/components/sections/CTABlock";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: siteContent.seo.pages.home.title,
  description: siteContent.seo.pages.home.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: siteContent.seo.pages.home.title,
    description: siteContent.seo.pages.home.description,
    url: SITE_URL,
    siteName: siteContent.seo.siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteContent.seo.pages.home.title,
    description: siteContent.seo.pages.home.description,
  },
};

const faqJsonLd =
  siteContent.faq && siteContent.faq.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: siteContent.faq.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      }
    : null;

export default function Home() {
  return (
    <SmoothScrollProvider>
      {faqJsonLd && <JsonLd data={faqJsonLd} />}
      {/* 0. NAV */}
      <Nav />

      {/* MAIN CONTENT */}
      <main id="main">
        {/* 1. HERO */}
        <Hero />

        {/* 2. 001 ABOUT US */}
        <About />

        {/* 3. 002 THE FEATURES */}
        <Features />

        {/* 4. 003 WHY AUTOMATE (DARK) */}
        <WhyAutomate />

        {/* 5. 004 SERVICES */}
        <Services />

        {/* 6. 005 THE PROCESS */}
        <Process />

        {/* 7. 006 FLEXIBLE ENGAGEMENT (PRICING) */}
        <Pricing />

        {/* 8. 007 FAQ */}
        <FAQ />

        {/* 9. 008 CONTACT */}
        <CTABlock />
      </main>

      {/* 10. FOOTER */}
      <Footer />
    </SmoothScrollProvider>
  );
}
