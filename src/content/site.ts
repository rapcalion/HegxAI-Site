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

export interface ThanksStep {
  num: string;
  text: string;
}

export interface ThanksSection {
  eyebrow: string;
  title: string;
  steps: ThanksStep[];
  ctaLabel?: string;
}

export interface ThanksContent {
  cal: ThanksSection;
  form: ThanksSection;
  backHomeLabel: string;
}

export interface PricingTier {
  id: "starter" | "growth";
  name: string;
  descriptor: string;
  description: string;
  priceNote: string;
  recommended: boolean;
  ctaLabel: string;
  ctaHref: string;
  features: string[];
}

export interface ServiceCardItem {
  slug: string;
  label: string;
  title: string;
  description: string;
  panel:
    | "workflow"
    | "agents"
    | "integrations"
    | "audit"
    | "training"
    | "voice"
    | "marketing"
    | "ecommerce"
    | "social"
    | "business"
    | string;
  nodes?: string[];
  agents?: string[];
  tools?: string[];
  steps?: string[];
  tags?: string[];
}

export interface BenefitItem {
  title: string;
  body: string;
}

export interface ProcessStepItem {
  tag: string;
  title: string;
  body: string;
}

export interface ServicesPageContent {
  hero: {
    title: string;
    subtext: string;
    cta: string;
  };
  services: ServiceCardItem[];
  benefits: {
    label: string;
    title: string;
    items: BenefitItem[];
  };
  process: {
    label: string;
    steps: ProcessStepItem[];
  };
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface FeatureVisualCardA {
  label: string;
  title: string;
  nodes: string[];
}

export interface FeatureVisualCardB {
  title: string;
  rows: string[];
}

export interface FeatureVisualData {
  cardA: FeatureVisualCardA;
  cardB: FeatureVisualCardB;
  chip: string;
}

export interface FeatureItem {
  tag: string;
  title: string;
  body: string;
  agentType: string;
  tasks: string[];
  nodes: string[];
  visual: FeatureVisualData;
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
  features: FeatureItem[];
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
  pricingTiers: PricingTier[];
  socials: Array<{ label: string; href: string }>;
  legal: Array<{ label: string; href: string }>;
  faq: FaqItem[];
  servicesPage: ServicesPageContent;
  thanks: ThanksContent;
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
      title: "Deploy an AI agent without the long build",
      body: "Configure intelligent agents that handle repetitive tasks, answer customer queries, qualify leads, and escalate edge cases — with a human approving what matters.",
      agentType: "Customer Support Agent",
      tasks: ["Respond to FAQs", "Route complex tickets", "Log to CRM"],
      nodes: ["Inbound", "Classify", "Draft reply", "Log CRM"],
      visual: {
        cardA: {
          label: "AI AGENT",
          title: "Customer Support Agent",
          nodes: ["Inbound", "Classify", "Draft reply", "Log CRM"],
        },
        cardB: {
          title: "Live replies",
          rows: ["FAQ answered", "Ticket routed", "Reply drafted"],
        },
        chip: "Agent ready",
      },
    },
    {
      tag: "WORKFLOW",
      title: "Automate multi-step workflows end to end",
      body: "Connect your tools into seamless pipelines. From inbound lead to closed deal — every step can be mapped, automated, and monitored in real-time.",
      agentType: "Sales Pipeline Workflow",
      tasks: ["Enrich lead data", "Schedule outreach", "Update Sheets"],
      nodes: ["Lead", "Enrich", "Outreach", "Sheet"],
      visual: {
        cardA: {
          label: "WORKFLOW",
          title: "Sales Pipeline Workflow",
          nodes: ["New lead", "Enrich", "Outreach", "Update sheet"],
        },
        cardB: {
          title: "Pipeline",
          rows: ["Lead enriched", "Outreach scheduled", "Sheet updated"],
        },
        chip: "Running",
      },
    },
    {
      tag: "INTEGRATION",
      title: "One source of truth, no copy-pasting between tools",
      body: "Sync data across your stack automatically. Every system stays in sync without manual effort or repetitive transfer.",
      agentType: "Data Sync Integration",
      tasks: ["Bi-directional sync", "Conflict resolution", "Audit trail"],
      nodes: ["Trigger", "Validate", "Sync App", "Audit log"],
      visual: {
        cardA: {
          label: "INTEGRATION",
          title: "Data Sync Integration",
          nodes: ["Source", "Map", "Sync", "Verify"],
        },
        cardB: {
          title: "Sync log",
          rows: ["Records mapped", "Sync completed", "Check passed"],
        },
        chip: "In sync",
      },
    },
  ],
  contact: {
    email: "", // keep empty per task
    bookingUrl: "https://cal.com/hegxcorp-afipon/free-audit-call",
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
  pricingTiers: [
    {
      id: "starter",
      name: "Starter",
      descriptor: "Start with one workflow",
      description: "One workflow, built, tested and connected to your tools.",
      priceNote: "Scoped after a free audit",
      recommended: false,
      ctaLabel: "See how it works",
      ctaHref: "#process",
      features: [
        "Free audit and process mapping",
        "One custom AI agent or workflow",
        "Integration with your CRM and messaging tools",
        "Error handling and monitoring",
        "Documentation and handover",
      ],
    },
    {
      id: "growth",
      name: "Growth",
      descriptor: "Automate across your team",
      description: "Connected agents and workflows across your team.",
      priceNote: "Scoped after a free audit",
      recommended: false,
      ctaLabel: "Book a free audit",
      ctaHref: "https://cal.com/hegxcorp-afipon/free-audit-call",
      features: [
        "Full operational audit",
        "Multiple connected agents and workflows",
        "Custom integrations with your existing tools",
        "Human-in-the-loop approvals",
        "Ongoing improvements after launch",
      ],
    },
  ],
  socials: [], // Empty: hides social links until real social channels exist
  legal: [
    { label: "Privacy", href: "/privacy" },
    { label: "Terms", href: "/terms" },
  ],
  faq: [
    {
      q: "How long does a project take?",
      a: "It depends on scope — a single workflow automation can be live in days, while a full multi-system deployment typically takes a few weeks. We scope this clearly in our initial audit so there are no surprises.",
    },
    {
      q: "Does it work with our existing tools?",
      a: "In almost every case, yes. We build integrations for the most common business tools — CRMs, email platforms, spreadsheets, project management software, and more. If your tool has an API, we can connect it.",
    },
    {
      q: "Do you build custom AI agents?",
      a: "Yes. We design and deploy AI agents tailored to your specific workflows — whether that's a customer support agent, a lead qualification bot, or an internal operations assistant. Every agent is purpose-built, not off-the-shelf.",
    },
    {
      q: "How do you handle data security?",
      a: "We take data security seriously. All automations are built with least-privilege access principles, encrypted connections, and clear data handling documentation. We never store your data beyond what's needed to make a system work.",
    },
    {
      q: "Do you provide ongoing support?",
      a: "Yes. Every project includes a handoff period, full documentation, and an option for ongoing maintenance. Your automations will keep running reliably — and if anything needs adjusting as your business evolves, we're here.",
    },
  ],
  servicesPage: {
    hero: {
      title: "Automation that fits how you work.",
      subtext: "We find the repetitive work, build the agents and workflows that remove it, and connect them to your tools.",
      cta: "Book a free audit",
    },
    services: [
      {
        slug: "model-training",
        label: "MODEL TRAINING",
        title: "Domain-Specific Model Training",
        description: "Fine-tune models on your proprietary datasets, internal documentation, and specialized business logic.",
        panel: "training",
        nodes: ["Data Ingestion", "Fine-Tuning", "Evaluation", "Production Deploy"],
        tags: ["Fine-Tuning", "Private Weights", "Evaluation"],
      },
      {
        slug: "ai-voice-agents",
        label: "AI VOICE AGENTS",
        title: "Inbound & Outbound Calling",
        description: "Low-latency voice agents that answer calls, qualify prospects, handle inquiries, and book meetings in real time.",
        panel: "voice",
        nodes: ["Inbound Call", "Real-Time STT", "LLM Reasoning", "Calendar Booking"],
        tags: ["Real-Time STT", "Natural Cadence", "Call Transfers"],
      },
      {
        slug: "lead-generation-follow-up",
        label: "LEAD GENERATION & FOLLOW-UP",
        title: "Inbound Capture to Closed Deal",
        description: "Capture leads, enrich contact data, draft personalized outreach, and trigger multi-touch follow-ups automatically.",
        panel: "workflow",
        nodes: ["Lead Capture", "Enrichment", "Draft Outreach", "CRM Sync"],
        tags: ["Instant Routing", "Multi-Touch", "CRM Sync"],
      },
      {
        slug: "content-marketing-automation",
        label: "CONTENT & MARKETING",
        title: "Automated Content Pipelines",
        description: "Automate research, creative generation, copy variations, and multi-channel campaign publishing end-to-end.",
        panel: "marketing",
        nodes: ["Topic Brief", "Asset Drafting", "Human Review", "Multi-Publish"],
        tags: ["Content Engine", "Asset Creation", "Multi-Publish"],
      },
      {
        slug: "ecommerce-automation",
        label: "E-COMMERCE AUTOMATION",
        title: "Order, Inventory & Returns",
        description: "Sync orders and inventory in real time, trigger supplier restock alerts, and resolve customer return requests.",
        panel: "ecommerce",
        nodes: ["Order Placed", "Stock Sync", "Fulfillment", "Return Triage"],
        tags: ["Stock Sync", "Order Routing", "Return Triage"],
      },
      {
        slug: "social-media-automation",
        label: "SOCIAL MEDIA AUTOMATION",
        title: "Omnichannel Publishing & Triage",
        description: "Schedule posts across platforms, monitor mentions, triage inbound direct messages, and route sales opportunities.",
        panel: "social",
        nodes: ["Content Queue", "Brand Monitor", "DM Triage", "Sales Escalation"],
        tags: ["Multi-Channel", "DM Triage", "Sales Escalation"],
      },
      {
        slug: "workflow-business-automation",
        label: "WORKFLOW & BUSINESS AUTOMATION",
        title: "End-to-End Operational Flow",
        description: "Connect your team's tools, internal approvals, database synchronization, and daily reporting without manual work.",
        panel: "business",
        tools: ["Gmail", "Google Sheets", "Slack", "HubSpot", "Notion", "Stripe"],
        tags: ["Cross-Tool Sync", "Approval Chains", "Error Recovery"],
      },
    ],
    benefits: {
      label: "BENEFITS",
      title: "Less manual work, more done.",
      items: [
        {
          title: "Audit first",
          body: "We start by understanding your workflow, not by selling a tool.",
        },
        {
          title: "Built around your tools",
          body: "We connect what you already use.",
        },
        {
          title: "You stay in control",
          body: "Human approval where it matters.",
        },
        {
          title: "Improves after launch",
          body: "We refine it as your work changes.",
        },
      ],
    },
    process: {
      label: "PROCESS",
      steps: [
        {
          tag: "STRATEGY",
          title: "Free audit",
          body: "We map your repetitive work and pick the best first workflow.",
        },
        {
          tag: "DESIGN",
          title: "Plan",
          body: "We agree what gets automated and how it connects.",
        },
        {
          tag: "BUILD",
          title: "Build and test",
          body: "We build it, test it with your real cases and fix issues.",
        },
        {
          tag: "SUPPORT",
          title: "Launch and improve",
          body: "We go live and keep improving it with you.",
        },
      ],
    },
  },
  thanks: {
    cal: {
      eyebrow: "BOOKING CONFIRMED",
      title: "You're booked. Check your inbox.",
      steps: [
        {
          num: "01",
          text: "Your calendar invite and Google Meet link are in your email.",
        },
        {
          num: "02",
          text: "Reply to that email if you want to share anything before the call.",
        },
        {
          num: "03",
          text: "We'll map what to automate on the call.",
        },
      ],
    },
    form: {
      eyebrow: "MESSAGE RECEIVED",
      title: "Thanks, we'll be in touch.",
      steps: [
        {
          num: "01",
          text: "We read your message.",
        },
        {
          num: "02",
          text: "We reply within 24 hours.",
        },
        {
          num: "03",
          text: "We map what to automate and send a simple plan.",
        },
      ],
      ctaLabel: "Book a free audit",
    },
    backHomeLabel: "Back to home",
  },
};

export const calLink = getCalLink(siteContent.contact.bookingUrl);
