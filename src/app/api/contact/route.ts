import { saveLead } from "@/lib/leads";
import { redactLead } from "@/lib/lead-utils";
import { renderLeadNotification, renderLeadAutoReply } from "@/lib/email-templates";

// In-memory rate limiter per IP: best-effort in serverless environments (isolated per lambda instance).
// Migrate to Upstash / Redis with the future backend for distributed state across instances.
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}


function isOriginAllowed(origin: string | null, host: string | null): boolean {
  if (!origin) return true; // Direct non-browser requests or same-origin without Origin header

  try {
    const originUrl = new URL(origin);

    // Allow localhost and 127.0.0.1 in non-production environments
    const isDev = process.env.NODE_ENV !== "production";
    if (isDev && (originUrl.hostname === "localhost" || originUrl.hostname === "127.0.0.1")) {
      return true;
    }

    // Check against NEXT_PUBLIC_SITE_URL
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (siteUrl) {
      const siteUrlOrigin = new URL(siteUrl).origin;
      if (originUrl.origin === siteUrlOrigin) {
        return true;
      }
    }

    // Check against Host header
    if (host && originUrl.host === host) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  // 1. Cross-site request check
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!isOriginAllowed(origin, host)) {
    return new Response(JSON.stringify({ ok: false, error: "forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2. Content-Type check
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return new Response(JSON.stringify({ ok: false, error: "validation" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 3. Payload size check (< 10KB)
  const contentLength = request.headers.get("content-length");
  if (contentLength && parseInt(contentLength, 10) > 10240) {
    return new Response(JSON.stringify({ ok: false, error: "validation" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
    if (rawBody.length > 10240) {
      return new Response(JSON.stringify({ ok: false, error: "validation" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "validation" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let body: Record<string, unknown> | null = null;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "validation" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 4. Extract and trim fields
  const name = typeof body?.name === "string" ? body.name.trim() : "";
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const company = typeof body?.company === "string" ? body.company.trim() : "";
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const website = typeof body?.website === "string" ? body.website.trim() : "";
  const ts = typeof body?.ts === "number" ? body.ts : 0;

  // 5. Spam detection: honeypot filled OR submitted too fast (< 3000ms)
  const now = Date.now();
  if (website !== "" || !ts || now - ts < 3000) {
    // Silently succeed to confuse bots without dispatching email
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 6. Validation limits
  if (
    !name ||
    name.length > 100 ||
    !email ||
    email.length > 254 ||
    !EMAIL_REGEX.test(email) ||
    company.length > 120 ||
    !message ||
    message.length > 1500
  ) {
    return new Response(JSON.stringify({ ok: false, error: "validation" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 7. Rate limiting per IP (first value of x-forwarded-for or fallback)
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

  if (!checkRateLimit(ip)) {
    return new Response(JSON.stringify({ ok: false, error: "rate_limited" }), {
      status: 429,
      headers: {
        "Content-Type": "application/json",
        "Retry-After": "3600",
      },
    });
  }

  // 8. Env vars verification
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.LEAD_TO_EMAIL;
  const fromEmail = process.env.LEAD_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    console.error("[Contact API] Missing required Resend env vars");
    return new Response(JSON.stringify({ ok: false, error: "not_configured" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 9. Call future backend lead persistence seam
  try {
    await saveLead({
      source: "form",
      name,
      email,
      company: company || undefined,
      message,
      createdAt: new Date(),
    });
  } catch (err) {
    console.error("[Contact API] Error in saveLead seam:", err instanceof Error ? err.message : "unknown");
  }

  // 10. Send email via Resend REST API
  const { subject, html, text } = renderLeadNotification({
    name,
    email,
    company: company || undefined,
    message,
    createdAt: new Date(),
  });

  try {
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail,
        reply_to: email,
        subject,
        text,
        html,
      }),
    });

    if (!resendRes.ok) {
      console.error(`[Contact API] Resend API error status: ${resendRes.status}`);
      return new Response(JSON.stringify({ ok: false, error: "server" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.info(`[Contact API] Lead email successfully dispatched for ${redactLead(name, email)}`);

    // 11. Optional Auto-Reply to visitor if enabled (isolated try/catch)
    if (process.env.LEAD_AUTOREPLY === "true") {
      try {
        const autoReply = renderLeadAutoReply({
          name,
          email,
          company: company || undefined,
          message,
        });

        const replyRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: fromEmail,
            to: email,
            reply_to: toEmail,
            subject: autoReply.subject,
            text: autoReply.text,
            html: autoReply.html,
          }),
        });

        console.info(`[Contact API] Auto-reply status code: ${replyRes.status}`);
      } catch {
        console.error("[Contact API] Auto-reply network error");
      }
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Contact API] Network error calling Resend API:", err instanceof Error ? err.message : "unknown");
    return new Response(JSON.stringify({ ok: false, error: "server" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
