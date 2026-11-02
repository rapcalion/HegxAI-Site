// Site content and configuration
// HARD RULE: Only real data. If empty, components hide the section/block instead of showing fake placeholders.

export interface WhyAutomateStat {
  value: string;
  suffix?: string;
  label: string;
  source: string;
  sourceUrl: string;
  note?: string;
}

export interface SiteContent {
  logo?: {
    showWordmark: boolean;
  };
  hero: {
    subtitle: string;
  };
  about: {
    headlineLead: string;
    headlineLeadLine1: string;
    headlineLeadLine2: string;
    headlineMuted: string;
    whatWeBuildTitle: string;
    whatWeBuildBody: string;
    howWeWorkTitle: string;
    howWeWorkBody: string;
    ctaLabel: string;
  };
  whyAutomate: {
    headline: string;
    stats: Array<{
      value: string;
      suffix?: string;
      label: string;
      source: string;
      sourceUrl: string;
      note?: string;
    }>;
  };
  features: Array<{
    tag: string;
    title: string;
    body: string;
    agentType: string;
    tasks: string[];
    nodes: string[];
  }>;
  contact: {
    email: string;
    bookingUrl: string;
    newsletterAction: string;
  };
  founder: {
    name: string;
    role: string;
    photo: string;
    bio: string;
  };
  clientLogos: Array<{ name: string; logoUrl: string }>;
  logos: Array<{ name: string; url: string }>;
  pricingTiers: Array<{
    name: string;
    price: string;
    period: string;
    description: string;
    features: string[];
  }>;
  socials: Array<{ label: string; href: string }>;
  legal: Array<{ label: string; href: string }>;
}

export const ACTIVE_SECTIONS = [
  { id: "about", label: "ABOUT US" },
  { id: "features", label: "THE FEATURES" },
  { id: "why-automate", label: "WHY AUTOMATE" },
  { id: "services", label: "SERVICES" },
  { id: "process", label: "THE PROCESS" },
  { id: "pricing", label: "FLEXIBLE ENGAGEMENT" },
  { id: "faq", label: "FAQ" },
  { id: "contact", label: "CONTACT" },
] as const;

export type SectionId = typeof ACTIVE_SECTIONS[number]["id"];

export function getSectionNumber(sectionId: string): string {
  const index = ACTIVE_SECTIONS.findIndex((s) => s.id === sectionId);
  if (index === -1) return "";
  return String(index + 1).padStart(3, "0");
}

export function getContactHref(): string {
  if (siteContent.contact.bookingUrl) return siteContent.contact.bookingUrl;
  if (siteContent.contact.email) return `mailto:${siteContent.contact.email}`;
  return "#contact";
}

export function getCalLink(url: string = siteContent.contact.bookingUrl): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    return parsed.pathname.replace(/^\/+/, "");
  } catch {
    return url.replace(/^https?:\/\/(www\.)?cal\.com\//i, "").replace(/^\/+/, "");
  }
}

export const siteContent: SiteContent = {
  logo: {
    showWordmark: true,
  },
  hero: {
    subtitle: "AI agents and workflows that run your repetitive business work.",
  },
  about: {
    headlineLead: "We find the repetitive work slowing your team down, build the agents and workflows that remove it,",
    headlineLeadLine1: "We find the repetitive work slowing your team down,",
    headlineLeadLine2: "build the agents and workflows that remove it,",
    headlineMuted: "and connect them to the tools you already use.",
    whatWeBuildTitle: "What we build",
    whatWeBuildBody: "AI agents and workflows for lead handling, follow-ups, reporting and internal operations.",
    howWeWorkTitle: "How we work",
    howWeWorkBody: "We start with a free audit, map what to automate, then build, test and connect it to your stack.",
    ctaLabel: "Book a free audit",
  },
  whyAutomate: {
    headline: "Businesses replacing repetitive workflows with AI — and the fastest teams are already ahead.",
    stats: [
      {
        value: "15",
        suffix: "%",
        label: "of day-to-day work decisions will be made autonomously by agentic AI by 2028 (Gartner prediction)",
        source: "Gartner",
        sourceUrl: "https://www.gartner.com/en/articles/ai-agents-pc1",
        note: "Gartner figure is a forecast.",
      },
      {
        value: "22",
        suffix: "%",
        label: "of respondents at smaller organizations are scaling AI agents in at least one business function",
        source: "McKinsey, The state of AI in 2026",
        sourceUrl: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
      },
      {
        value: "40",
        suffix: "%",
        label: "of respondents at large organizations (over $1B revenue) are scaling AI agents in at least one business function",
        source: "McKinsey, The state of AI in 2026",
        sourceUrl: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
      },
      {
        value: "9",
        suffix: " in 10",
        label: "respondents report regular use of AI in at least one business function",
        source: "McKinsey, The state of AI in 2026",
        sourceUrl: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
      },
    ],
  },
  features: [
    {
      tag: "AI AGENT",
      title: "Deploy an AI Agent in hours, not months",
      body: "Configure intelligent agents that handle repetitive tasks, answer customer queries, qualify leads, and escalate edge cases — all without human intervention.",
      agentType: "Customer Support Agent",
      tasks: ["Respond to FAQs", "Route complex tickets", "Log to CRM"],
      nodes: ["Inbound", "Classify", "Draft reply", "Log CRM"],
    },
    {
      tag: "WORKFLOW",
      title: "Automate multi-step workflows end to end",
      body: "Connect your tools into seamless pipelines. From inbound lead to closed deal — every step can be mapped, automated, and monitored in real-time.",
      agentType: "Sales Pipeline Workflow",
      tasks: ["Enrich lead data", "Schedule outreach", "Update Sheets"],
      nodes: ["Lead", "Enrich", "Outreach", "Sheet"],
    },
    {
      tag: "INTEGRATION",
      title: "One source of truth, no copy-pasting between tools",
      body: "Sync data across your stack automatically. Every system stays in sync without manual effort or repetitive transfer.",
      agentType: "Data Sync Integration",
      tasks: ["Bi-directional sync", "Conflict resolution", "Audit trail"],
      nodes: ["Trigger", "Validate", "Sync App", "Audit log"],
    },
  ],
  contact: {
    email: "", // keep empty per task
    bookingUrl: "https://cal.com/hegxai/free-audit",
    newsletterAction: "", // TODO: newsletter subscription endpoint (leave empty to hide form)
  },
  founder: {
    name: "", // Keep empty to hide founder slot until real data exists
    role: "",
    photo: "",
    bio: "",
  },
  clientLogos: [],
  logos: [],
  pricingTiers: [],
  socials: [], // Empty: hides social links until real social channels exist
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
};

export const calLink = getCalLink(siteContent.contact.bookingUrl);
