# HEGXAI

> Every Task. Automated. Intelligent AI agents and workflow automation for modern businesses.

A high-performance, editorial landing page engineered with Next.js, TypeScript, GSAP, and Lenis smooth scrolling, featuring a warm cream architectural palette, lime chartreuse technical accents, and dynamic GSAP ticker marquees.

---

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Vanilla CSS tokens + TailwindCSS v4 bridge
- **Typography**: 
  - Display: `Inter Tight` (weights 500/600)
  - Wordmark Logo: `Anton` (used exclusively for the HEGXAI brand mark)
  - Body: `DM Sans` (weights 300, 400, 500, 600)
  - Technical Labels: `IBM Plex Mono` (monospace labels <= 11px)
- **Animation**: [GSAP](https://greensock.com/gsap/) + ScrollTrigger
- **Smooth Scroll**: [@studio-freight/lenis](https://github.com/darkroomengineering/lenis)

---

## Getting Started

### Prerequisites
Node.js 18+ (tested on Node.js v22+)

### Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

### Type Check & Linting
```bash
npx tsc --noEmit
npm run lint
```

### Webhook Testing
```bash
npm run test:webhook [base-url] # sends HMAC-signed test Cal.com booking payload to /api/webhooks/cal
```

---

## Folder Map

```
hegxai-design-final/
├── docs/
│   └── design-spec.md            # Detailed design tokens, typography, and layout specifications
├── public/                       # Static public assets
├── src/
│   ├── app/
│   │   ├── favicon.ico           # HEGXAI square mark favicon
│   │   ├── globals.css           # CSS design tokens, typography, focus rings, and resets
│   │   ├── icon.svg              # SVG square mark favicon
│   │   ├── layout.tsx            # Root layout, next/font bindings, metadata, JSON-LD
│   │   ├── opengraph-image.tsx   # Dynamic edge OpenGraph image generator (next/og)
│   │   ├── page.tsx              # Main single-page entry wrapping all sections
│   │   ├── robots.ts             # Robots.txt metadata route
│   │   └── sitemap.ts            # Sitemap.xml metadata route
│   ├── components/
│   │   ├── sections/
│   │   │   ├── About.tsx         # 001 About Us section with interactive chamfered lime tag
│   │   │   ├── CTABlock.tsx      # 008 Contact section with dynamic audit booking
│   │   │   ├── FAQ.tsx           # 007 FAQ accordion with accessible regions
│   │   │   ├── Features.tsx      # 002 The Features with interactive mock card
│   │   │   ├── Footer.tsx        # Footer columns, social links, and optional newsletter
│   │   │   ├── Hero.tsx          # Single H1 Hero with dashed connector and Marquee
│   │   │   ├── HeroWorkflowCard.tsx # Live workflow card with interactive nodes & feed
│   │   │   ├── Nav.tsx           # Desktop & mobile nav with ScrollTrigger active highlighting
│   │   │   ├── Pricing.tsx       # 006 Flexible engagement tiers
│   │   │   ├── Process.tsx       # 005 The Process with interactive step tabs
│   │   │   ├── Services.tsx      # 004 Services accordion and live ticker Marquee
│   │   │   └── WhyAutomate.tsx   # 003 Why Automate dark section with ASCII halftone canvas
│   │   └── ui/
│   │       ├── AsciiHalftoneCanvas.tsx # Procedural ASCII matrix background (light/dark)
│   │       ├── Marquee.tsx       # GSAP ticker marquee with Lenis velocity boost
│   │       └── shared.tsx        # Design system components: Button, SectionBar, SectionColumn
│   ├── content/
│   │   └── site.ts               # Central configuration and real business content
│   └── lib/
│       └── SmoothScrollProvider.tsx # Global Lenis smooth scrolling provider
```

---

## How to Edit Site Content (`src/content/site.ts`)

All user-configurable business information is centralized in [`src/content/site.ts`](file:///d:/hegxai-design-final/src/content/site.ts). The codebase follows a strict **"No Fake Data"** rule: sections and elements hide gracefully when data is empty.

### 1. Contact & Booking
```ts
export const siteContent: SiteContent = {
  contact: {
    email: "", // Enter real email (e.g. "hello@hegxai.com")
    bookingUrl: "", // Enter calendar URL (e.g. "https://cal.com/hegxai")
    newsletterAction: "", // Enter newsletter form endpoint (leave empty to hide the form)
  },
  // ...
};
```
- **When both `email` and `bookingUrl` are empty**: All CTAs across the site smoothly scroll to `#contact`, and the contact block shows a crisp `"Booking opens soon."` status.
- **When `bookingUrl` is set**: CTAs open your calendar link directly.
- **When `email` is set**: CTAs open a `mailto:` link.
- **Newsletter**: The newsletter form in the footer only renders if `newsletterAction` is set.

### 2. Founder / Team Slot
```ts
founder: {
  name: "", // Leave empty to keep founder card hidden until ready
  role: "",
  photo: "",
  bio: "",
}
```

### 3. Client & Partner Logos
Add entries to `siteContent.clientLogos` or `siteContent.logos` to automatically activate the scrolling ticker marquees.

---

## Accessibility & SEO Highlights

- **Accessibility**:
  - Global `:focus-visible` styling (`2px solid var(--ink)` on cream, `2px solid var(--lime)` on dark).
  - Skip-to-content anchor targeting `#main`.
  - Exactly one `<h1>` per page (in Hero).
  - Semantic sectioning with `aria-labelledby` referencing heading IDs.
  - Accordion controls with proper `aria-expanded` and `aria-controls`.
  - Decorative SVG and canvas backgrounds flagged with `aria-hidden="true"`.
- **SEO**:
  - Dynamic `metadataBase` support via `NEXT_PUBLIC_SITE_URL`.
  - Dynamic OpenGraph and Twitter cards (`src/app/opengraph-image.tsx`).
  - Search engine crawlers guided by `robots.ts` and `sitemap.ts`.
  - Valid `Organization` JSON-LD schema with real attributes only.
