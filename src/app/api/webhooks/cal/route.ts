import crypto from "crypto";
import { saveLead } from "@/lib/leads";

interface CalAttendee {
  name?: string;
  email?: string;
  phoneNumber?: string;
}

interface CalWebhookPayload {
  triggerEvent?: string;
  type?: string;
  payload?: {
    name?: string;
    email?: string;
    startTime?: string;
    start_time?: string;
    description?: string;
    attendees?: CalAttendee[];
    responses?: Record<string, unknown>;
  };
}

function extractValue(raw: unknown): string {
  if (raw === null || raw === undefined) return "";
  if (typeof raw === "string") return raw.trim();
  if (typeof raw === "number" || typeof raw === "boolean") return String(raw);
  if (Array.isArray(raw)) {
    const parts = raw
      .map((item) => (typeof item === "object" ? "" : String(item ?? "").trim()))
      .filter(Boolean);
    return parts.join(", ");
  }
  if (typeof raw === "object") {
    const obj = raw as { value?: unknown };
    if (obj.value !== undefined && obj.value !== null) {
      return extractValue(obj.value);
    }
  }
  return "";
}

function extractLabel(slug: string, raw: unknown): string {
  if (
    typeof raw === "object" &&
    raw !== null &&
    "label" in raw &&
    typeof (raw as { label?: unknown }).label === "string" &&
    (raw as { label: string }).label.trim()
  ) {
    return (raw as { label: string }).label.trim();
  }
  return slug;
}

export async function GET() {
  return new Response(
    JSON.stringify({
      route: "cal-webhook",
      configured: {
        CAL_WEBHOOK_SECRET: !!process.env.CAL_WEBHOOK_SECRET,
        RESEND_API_KEY: !!process.env.RESEND_API_KEY,
        LEAD_FROM_EMAIL: !!process.env.LEAD_FROM_EMAIL,
        LEAD_TO_EMAIL: !!process.env.LEAD_TO_EMAIL,
      },
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function POST(request: Request) {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[Cal Webhook] rejected: no secret configured");
    return new Response(JSON.stringify({ ok: false, error: "webhook_not_configured" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const signature = request.headers.get("x-cal-signature-256");
  if (!signature) {
    console.error("[Cal Webhook] rejected: missing signature header");
    return new Response(JSON.stringify({ ok: false, error: "missing_signature" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "invalid_body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Calculate HMAC-SHA256 signature
  const expectedSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  try {
    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expectedSignature, "hex");

    if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
      console.error("[Cal Webhook] rejected: invalid signature");
      return new Response(JSON.stringify({ ok: false, error: "invalid_signature" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch {
    console.error("[Cal Webhook] rejected: invalid signature");
    return new Response(JSON.stringify({ ok: false, error: "invalid_signature_format" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  let data: CalWebhookPayload | null = null;
  try {
    data = JSON.parse(rawBody) as CalWebhookPayload;
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "invalid_json" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const rawTrigger = data?.triggerEvent || data?.type;
  const triggerEvent = typeof rawTrigger === "string" ? rawTrigger : "unknown";

  console.info("[Cal Webhook] received trigger=" + triggerEvent);

  if (triggerEvent.toUpperCase() === "BOOKING_CREATED") {
    const payload = data?.payload || {};
    const attendee = payload?.attendees?.[0] || {};
    const name = attendee?.name || payload?.name || "Cal.com Attendee";
    const email = attendee?.email || payload?.email || "";
    const startTime = payload?.startTime || payload?.start_time || "";
    const responses =
      payload?.responses && typeof payload.responses === "object" ? payload.responses : {};

    const phone =
      (typeof attendee?.phoneNumber === "string" ? attendee.phoneNumber.trim() : "") ||
      extractValue(responses?.smsReminderNumber) ||
      extractValue(responses?.attendeePhoneNumber) ||
      "";

    let company = "";
    const messageParts: string[] = [];

    if (phone) {
      messageParts.push(`Phone: ${phone}`);
    }

    const EXCLUDED_SLUGS = new Set([
      "name",
      "email",
      "location",
      "guests",
      "reschedulereason",
      "smsremindernumber",
      "attendeephonenumber",
    ]);

    for (const [slug, rawEntry] of Object.entries(responses)) {
      if (EXCLUDED_SLUGS.has(slug.toLowerCase())) {
        continue;
      }

      const val = extractValue(rawEntry);
      if (!val) continue;

      const label = extractLabel(slug, rawEntry);

      if (
        !company &&
        (/company|organi[sz]ation/i.test(slug) || /company|organi[sz]ation/i.test(label))
      ) {
        company = val;
      }

      messageParts.push(`${label}: ${val}`);
    }

    if (
      messageParts.length === 0 &&
      typeof payload?.description === "string" &&
      payload.description.trim()
    ) {
      messageParts.push(payload.description.trim());
    }

    const message = messageParts.join("\n\n");

    await saveLead({
      source: "cal",
      name,
      email,
      company,
      message,
      startTime,
      createdAt: new Date(),
    });

    console.info("[Cal Webhook] booking processed");

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Acknowledge and ignore other triggers per requirements
  console.info("[Cal Webhook] ignored trigger=" + triggerEvent);
  return new Response(JSON.stringify({ ok: true, ignored: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
