import { NextRequest } from "next/server";
import {
  renderLeadNotification,
  renderLeadAutoReply,
  renderBookingNotification,
} from "@/lib/email-templates";

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return new Response("Not found", { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "lead";

  const sampleLead = {
    name: "Vinni Sharma",
    email: "vinni@acme.com",
    company: "Acme Corp",
    message: "We need to automate our inbound lead triage and CRM data entry.\nCurrently spending 15+ hours weekly copying information between tools.",
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(),
  };

  let rendered: { html: string };

  switch (type) {
    case "autoreply":
      rendered = renderLeadAutoReply(sampleLead);
      break;
    case "booking":
      rendered = renderBookingNotification(sampleLead);
      break;
    case "lead":
    default:
      rendered = renderLeadNotification(sampleLead);
      break;
  }

  return new Response(rendered.html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
