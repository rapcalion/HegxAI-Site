import { redactLead } from "./lead-utils";
import { renderBookingNotification } from "./email-templates";

// Future-backend lead storage and notification seams
export interface Lead {
  source: "form" | "cal";
  name: string;
  email: string;
  company?: string;
  message?: string;
  startTime?: string;
  createdAt: Date;
}

/**
 * Lead persistence seam.
 * Currently dispatches notification email for Cal.com bookings (form route dispatches its own email).
 * When a persistent database is connected (e.g. Supabase, PostgreSQL, Prisma),
 * DB writes will be centralized here for both lead sources.
 */
export async function saveLead(lead: Lead): Promise<void> {
  // DB Write stub: future backend persistence
  // e.g. await db.leads.create({ data: lead });

  if (lead.source === "cal") {
    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.LEAD_TO_EMAIL;
    const fromEmail = process.env.LEAD_FROM_EMAIL;

    const missingEnv: string[] = [];
    if (!apiKey) missingEnv.push("RESEND_API_KEY");
    if (!toEmail) missingEnv.push("LEAD_TO_EMAIL");
    if (!fromEmail) missingEnv.push("LEAD_FROM_EMAIL");

    if (missingEnv.length > 0) {
      console.warn(`[saveLead] Missing env vars: ${missingEnv.join(", ")}`);
      return;
    }

    const safeName = lead.name.trim();
    const safeEmail = lead.email.trim();
    const safeCompany = (lead.company || "").trim();
    const safeMessage = (lead.message || "").trim();
    const safeStartTime = (lead.startTime || "").trim();

    const { subject, html, text } = renderBookingNotification({
      name: safeName,
      email: safeEmail,
      company: safeCompany,
      message: safeMessage,
      startTime: safeStartTime,
      createdAt: lead.createdAt,
    });

    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromEmail,
          to: toEmail,
          reply_to: safeEmail,
          subject,
          text,
          html,
        }),
      });

      if (!res.ok) {
        let errData: { name?: string; message?: string } | null = null;
        try {
          errData = (await res.json()) as { name?: string; message?: string };
        } catch {
          // ignore parsing error if non-JSON
        }
        console.error(
          `[saveLead] Resend API error: status=${res.status} name=${errData?.name ?? "unknown"} message=${errData?.message ?? "unknown"}`
        );
      } else {
        console.info(`[saveLead] Booking email sent for ${redactLead(safeName, safeEmail)}`);
      }
    } catch (err) {
      console.error("[saveLead] Failed to dispatch Resend email:", err instanceof Error ? err.message : "unknown");
    }
  }
}
