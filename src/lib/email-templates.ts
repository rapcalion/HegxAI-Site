import { escapeHtml } from "./lead-utils";
import { siteContent } from "@/content/site";

export interface LeadTemplateData {
  name: string;
  email: string;
  company?: string;
  message?: string;
  startTime?: string;
  createdAt?: Date | string;
}

export interface RenderedEmail {
  subject: string;
  html: string;
  text: string;
}

interface EmailLayoutOptions {
  preheader: string;
  eyebrow: string;
  title: string;
  bodyHtml: string;
  footerText?: string;
}

/**
 * Format date in Asia/Calcutta (IST) timezone
 */
export function formatIST(dateInput?: Date | string | null): string {
  if (!dateInput) return "N/A";
  try {
    const d = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    if (isNaN(d.getTime())) {
      return String(dateInput);
    }
    return (
      new Intl.DateTimeFormat("en-IN", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Asia/Calcutta",
      }).format(d) + " IST"
    );
  } catch {
    return String(dateInput);
  }
}

/**
 * Extract first name or fallback safely
 */
export function getFirstName(fullName: string): string {
  const trimmed = fullName.trim();
  if (!trimmed) return "there";
  const first = trimmed.split(/\s+/)[0];
  return first || trimmed;
}

/**
 * Bulletproof email button helper
 */
function renderButton({
  text,
  url,
  variant = "primary",
}: {
  text: string;
  url: string;
  variant?: "primary" | "secondary";
}): string {
  const bg = variant === "primary" ? "#3A5BE0" : "#141414";
  return `
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;">
      <tr>
        <td align="center" bgcolor="${bg}" style="border-radius:6px; background-color:${bg};">
          <a href="${escapeHtml(url)}" target="_blank" style="display:inline-block; padding:12px 22px; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; font-weight:600; color:#FFFFFF; text-decoration:none; border-radius:6px; -webkit-text-size-adjust:none;">
            ${escapeHtml(text)}
          </a>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Render buttons row with mobile stacking / wrapping support
 */
function renderButtonsRow(
  buttons: Array<{ text: string; url: string; variant?: "primary" | "secondary" }>
): string {
  const validButtons = buttons.filter((b) => b.url && b.url.trim().length > 0);
  if (validButtons.length === 0) return "";

  return `
    <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:28px; border-collapse:collapse;">
      <tr>
        ${validButtons
          .map(
            (b, idx) => `
          <td style="${idx > 0 ? "padding-left:12px;" : ""} vertical-align:middle;">
            ${renderButton(b)}
          </td>
        `
          )
          .join("")}
      </tr>
    </table>
  `;
}

/**
 * Header logo lockup according to rules:
 * - <img src="{SITE}/brand/hegxai-mark-color.png" width="36" height="32" alt="" style="display:block">
 * - SITE = process.env.NEXT_PUBLIC_SITE_URL (https only).
 * - If SITE is missing, empty, or points to localhost/127.0.0.1, omit the <img> and render the text wordmark only.
 */
function renderHeaderLogo(): string {
  const rawSite = (process.env.NEXT_PUBLIC_SITE_URL || "").trim().replace(/\/+$/, "");
  const isHttps = rawSite.startsWith("https://");
  const isLocal = rawSite.includes("localhost") || rawSite.includes("127.0.0.1");
  const showLogoImg = isHttps && !isLocal && rawSite.length > 0;

  if (showLogoImg) {
    return `
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding-right:12px; vertical-align:middle;">
            <img src="${escapeHtml(rawSite)}/brand/hegxai-mark-color.png" width="36" height="32" alt="" style="display:block; width:36px; height:32px; border:0; outline:none; text-decoration:none;" />
          </td>
          <td style="vertical-align:middle;">
            <span style="font-family:Impact, 'Arial Narrow Bold', 'Arial Black', sans-serif; font-size:24px; line-height:1; letter-spacing:2px; color:#FFFFFF; font-weight:bold; text-transform:uppercase;">HEGXAI</span>
          </td>
        </tr>
      </table>
    `;
  }

  return `
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
      <tr>
        <td style="vertical-align:middle;">
          <span style="font-family:Impact, 'Arial Narrow Bold', 'Arial Black', sans-serif; font-size:24px; line-height:1; letter-spacing:2px; color:#FFFFFF; font-weight:bold; text-transform:uppercase;">HEGXAI</span>
        </td>
      </tr>
    </table>
  `;
}

/**
 * Shared email layout:
 * - Table-based, max 600px, centered
 * - Dark header (#0E1020), white card (#FFFFFF), outer bg (#F4EFE6)
 * - All styles inline, no CSS vars, no web fonts
 */
function emailLayout({
  preheader,
  eyebrow,
  title,
  bodyHtml,
  footerText = "Sent from HEGXAI.",
}: EmailLayoutOptions): string {
  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0; padding:0; background-color:#F4EFE6; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; color:#141414; -webkit-font-smoothing:antialiased; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%;">
  <!-- Preheader text (hidden from view) -->
  <div style="display:none; font-size:1px; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden; mso-hide:all;">
    ${escapeHtml(preheader)}
  </div>

  <!-- Outer background container -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#F4EFE6; width:100%; min-height:100%; padding:24px 12px; border-collapse:collapse;">
    <tr>
      <td align="center" style="padding:0;">
        <!-- Center Card (max 600px) -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:600px; width:100%; background-color:#FFFFFF; border:1px solid #E6E1D6; border-radius:8px; overflow:hidden; text-align:left; border-collapse:collapse;">
          
          <!-- Header Bar (dark #0E1020) -->
          <tr>
            <td bgcolor="#0E1020" style="background-color:#0E1020; padding:22px 28px;">
              ${renderHeaderLogo()}
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td style="padding:32px 28px 28px 28px; background-color:#FFFFFF;">
              <!-- Eyebrow label -->
              <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:12px; font-weight:bold; letter-spacing:1.5px; text-transform:uppercase; color:#3A5BE0; margin-bottom:12px;">
                ${escapeHtml(eyebrow)}
              </div>

              <!-- Main Title -->
              <h1 style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:26px; line-height:1.25; font-weight:bold; color:#141414; margin:0 0 16px 0; padding:0;">
                ${escapeHtml(title)}
              </h1>

              <!-- Dynamic Body Content -->
              ${bodyHtml}
            </td>
          </tr>

          <!-- Small Footer -->
          <tr>
            <td style="padding:16px 28px 24px 28px; background-color:#FFFFFF; border-top:1px solid #E6E1D6;">
              <p style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:12px; line-height:1.5; color:#5B574E; margin:0; padding:0;">
                ${escapeHtml(footerText)}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * 1) renderLeadNotification (to owner)
 * - subject: `New lead: ${name} (${company || "no company"})`
 * - preheader: `${name} wants to automate: ${first 80 chars of message}`
 * - eyebrow: NEW LEAD; title: `${name} wants to automate something`
 * - detail card rows: Name / Work email / Company / Received
 * - message block titled "What they want to automate" (pre-wrap)
 * - buttons: primary "Reply to ${firstName}" -> mailto, secondary "Book a call link" -> bookingUrl
 * - footer: "Sent from the HEGXAI website contact form."
 */
export function renderLeadNotification(lead: LeadTemplateData): RenderedEmail {
  const name = lead.name.trim();
  const email = lead.email.trim();
  const company = (lead.company || "").trim();
  const message = (lead.message || "").trim();
  const firstName = getFirstName(name);
  const formattedReceived = formatIST(lead.createdAt || new Date());
  const bookingUrl = siteContent.contact.bookingUrl || "";

  const subject = `New lead: ${name} (${company || "no company"})`;
  const msgSnippet = message.slice(0, 80);
  const preheader = `${name} wants to automate: ${msgSnippet || "new inquiry"}`;
  const eyebrow = "NEW LEAD";
  const title = `${name} wants to automate something`;

  const replyMailto = `mailto:${email}?subject=${encodeURIComponent("Re: your HEGXAI enquiry")}`;

  const bodyHtml = `
    <p style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:15px; line-height:1.5; color:#5B574E; margin:0 0 20px 0;">
      A new lead submitted the contact form on the HEGXAI website.
    </p>

    <!-- Detail Card (detail-card background #FAF8F3 with a 4px left border #5170FF) -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%; background-color:#FAF8F3; border-left:4px solid #5170FF; border-collapse:collapse; margin-bottom:20px;">
      <tr>
        <td style="padding:16px 20px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0; width:110px; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:13px; font-weight:600; color:#5B574E; vertical-align:top;">Name</td>
              <td style="padding:6px 0; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; color:#141414; font-weight:500;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; width:110px; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:13px; font-weight:600; color:#5B574E; vertical-align:top;">Work email</td>
              <td style="padding:6px 0; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; color:#141414;">
                <a href="mailto:${escapeHtml(email)}" style="color:#3A5BE0; text-decoration:underline;">${escapeHtml(email)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:6px 0; width:110px; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:13px; font-weight:600; color:#5B574E; vertical-align:top;">Company</td>
              <td style="padding:6px 0; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; color:#141414;">${escapeHtml(company || "N/A")}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; width:110px; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:13px; font-weight:600; color:#5B574E; vertical-align:top;">Received</td>
              <td style="padding:6px 0; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; color:#141414;">${escapeHtml(formattedReceived)}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Message Block titled 'What they want to automate' -->
    ${
      message
        ? `
      <div style="margin-top:20px;">
        <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:12px; font-weight:bold; letter-spacing:1px; text-transform:uppercase; color:#5B574E; margin-bottom:8px;">
          What they want to automate
        </div>
        <div style="background-color:#FAF8F3; border:1px solid #E6E1D6; border-radius:4px; padding:16px; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; line-height:1.6; color:#141414; white-space:pre-wrap;">${escapeHtml(message)}</div>
      </div>
    `
        : ""
    }

    <!-- Action Buttons Row -->
    ${renderButtonsRow([
      {
        text: `Reply to ${firstName}`,
        url: replyMailto,
        variant: "primary",
      },
      {
        text: "Book a call link",
        url: bookingUrl,
        variant: "secondary",
      },
    ])}
  `;

  const footerText = "Sent from the HEGXAI website contact form.";

  const html = emailLayout({
    preheader,
    eyebrow,
    title,
    bodyHtml,
    footerText,
  });

  const text = [
    `New lead: ${name} (${company || "no company"})`,
    "--------------------------------------------------",
    `Name: ${name}`,
    `Work email: ${email}`,
    `Company: ${company || "N/A"}`,
    `Received: ${formattedReceived}`,
    "",
    "What they want to automate:",
    message || "N/A",
    "",
    `Reply to ${firstName}: ${replyMailto}`,
    bookingUrl ? `Book a call link: ${bookingUrl}` : "",
    "--------------------------------------------------",
    footerText,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}

/**
 * 2) renderLeadAutoReply (to the visitor)
 * - subject: "We got your message - HEGXAI"
 * - preheader: "We'll reply within 24 hours."
 * - eyebrow: MESSAGE RECEIVED; title: `Thanks, ${firstName}. We've got your message.`
 * - intro: "We read every message ourselves and will get back to you within 24 hours."
 * - detail card "What you sent": their message (escaped, pre-wrap, truncated to 600 chars with an ellipsis).
 * - "What happens next" 3 numbered steps (plain table rows): 1) We read your message. 2) We reply with questions or a time for a short call. 3) We map what to automate and send a simple plan.
 * - button: primary "Book a free audit call" -> contact.bookingUrl (hide if empty).
 * - footer: "You are receiving this because you submitted the contact form on the HEGXAI website. Just reply to this email to reach us."
 */
export function renderLeadAutoReply(lead: LeadTemplateData): RenderedEmail {
  const name = lead.name.trim();
  const rawMsg = (lead.message || "").trim();
  const firstName = getFirstName(name);
  const truncatedMessage = rawMsg.length > 600 ? rawMsg.slice(0, 600) + "..." : rawMsg || "No message provided.";
  const bookingUrl = siteContent.contact.bookingUrl || "";

  const subject = "We got your message - HEGXAI";
  const preheader = "We'll reply within 24 hours.";
  const eyebrow = "MESSAGE RECEIVED";
  const title = `Thanks, ${firstName}. We've got your message.`;
  const intro = "We read every message ourselves and will get back to you within 24 hours.";

  const bodyHtml = `
    <p style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:15px; line-height:1.5; color:#5B574E; margin:0 0 20px 0;">
      ${escapeHtml(intro)}
    </p>

    <!-- Detail Card "What you sent" -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%; background-color:#FAF8F3; border-left:4px solid #5170FF; border-collapse:collapse; margin-bottom:24px;">
      <tr>
        <td style="padding:16px 20px;">
          <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:12px; font-weight:bold; letter-spacing:1px; text-transform:uppercase; color:#5B574E; margin-bottom:8px;">
            What you sent
          </div>
          <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; line-height:1.6; color:#141414; white-space:pre-wrap;">${escapeHtml(truncatedMessage)}</div>
        </td>
      </tr>
    </table>

    <!-- "What happens next" 3 numbered steps -->
    <div style="margin:24px 0 20px 0;">
      <div style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:12px; font-weight:bold; letter-spacing:1px; text-transform:uppercase; color:#5B574E; margin-bottom:12px;">
        What happens next
      </div>
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%; border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0; width:28px; vertical-align:top; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; font-weight:bold; color:#3A5BE0;">1)</td>
          <td style="padding:8px 0; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; line-height:1.5; color:#141414;">We read your message.</td>
        </tr>
        <tr>
          <td style="padding:8px 0; width:28px; vertical-align:top; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; font-weight:bold; color:#3A5BE0;">2)</td>
          <td style="padding:8px 0; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; line-height:1.5; color:#141414;">We reply with questions or a time for a short call.</td>
        </tr>
        <tr>
          <td style="padding:8px 0; width:28px; vertical-align:top; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; font-weight:bold; color:#3A5BE0;">3)</td>
          <td style="padding:8px 0; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; line-height:1.5; color:#141414;">We map what to automate and send a simple plan.</td>
        </tr>
      </table>
    </div>

    <!-- Action Button -->
    ${
      bookingUrl
        ? renderButtonsRow([
            {
              text: "Book a free audit call",
              url: bookingUrl,
              variant: "primary",
            },
          ])
        : ""
    }
  `;

  const footerText =
    "You are receiving this because you submitted the contact form on the HEGXAI website. Just reply to this email to reach us.";

  const html = emailLayout({
    preheader,
    eyebrow,
    title,
    bodyHtml,
    footerText,
  });

  const text = [
    subject,
    "--------------------------------------------------",
    `Thanks, ${firstName}. We've got your message.`,
    "",
    intro,
    "",
    "What you sent:",
    truncatedMessage,
    "",
    "What happens next:",
    "1) We read your message.",
    "2) We reply with questions or a time for a short call.",
    "3) We map what to automate and send a simple plan.",
    "",
    bookingUrl ? `Book a free audit call: ${bookingUrl}\n` : "",
    "--------------------------------------------------",
    footerText,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}

/**
 * 3) renderBookingNotification (Cal webhook -> owner)
 * - subject: `New booking: ${name} (${company || "no company"})`
 * - eyebrow: NEW BOOKING; title: `${name} booked a free audit`
 * - rows: Name / Email / Company / Call time (startTime formatted in IST, "N/A" if empty) / Notes (intake answers, pre-wrap).
 * - buttons: primary "Reply to ${firstName}" (mailto); secondary hidden.
 */
export function renderBookingNotification(lead: LeadTemplateData): RenderedEmail {
  const name = lead.name.trim();
  const email = lead.email.trim();
  const company = (lead.company || "").trim();
  const notes = (lead.message || "").trim();
  const firstName = getFirstName(name);
  const formattedStartTime = formatIST(lead.startTime);

  const subject = `New booking: ${name} (${company || "no company"})`;
  const preheader = `${name} booked a free audit call (${formattedStartTime})`;
  const eyebrow = "NEW BOOKING";
  const title = `${name} booked a free audit`;

  const replyMailto = `mailto:${email}?subject=${encodeURIComponent("Re: your HEGXAI booking")}`;

  const bodyHtml = `
    <p style="font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:15px; line-height:1.5; color:#5B574E; margin:0 0 20px 0;">
      A new meeting was booked via the Cal.com scheduling system.
    </p>

    <!-- Detail Card with Name / Email / Company / Call time / Notes -->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%; background-color:#FAF8F3; border-left:4px solid #5170FF; border-collapse:collapse; margin-bottom:20px;">
      <tr>
        <td style="padding:16px 20px;">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="width:100%; border-collapse:collapse;">
            <tr>
              <td style="padding:6px 0; width:110px; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:13px; font-weight:600; color:#5B574E; vertical-align:top;">Name</td>
              <td style="padding:6px 0; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; color:#141414; font-weight:500;">${escapeHtml(name)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; width:110px; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:13px; font-weight:600; color:#5B574E; vertical-align:top;">Email</td>
              <td style="padding:6px 0; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; color:#141414;">
                <a href="mailto:${escapeHtml(email)}" style="color:#3A5BE0; text-decoration:underline;">${escapeHtml(email)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:6px 0; width:110px; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:13px; font-weight:600; color:#5B574E; vertical-align:top;">Company</td>
              <td style="padding:6px 0; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; color:#141414;">${escapeHtml(company || "N/A")}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; width:110px; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:13px; font-weight:600; color:#5B574E; vertical-align:top;">Call time</td>
              <td style="padding:6px 0; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; color:#141414;">${escapeHtml(formattedStartTime)}</td>
            </tr>
            <tr>
              <td style="padding:6px 0; width:110px; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:13px; font-weight:600; color:#5B574E; vertical-align:top;">Notes</td>
              <td style="padding:6px 0; font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; font-size:14px; color:#141414; white-space:pre-wrap; line-height:1.5;">${escapeHtml(notes || "None")}</td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Action Buttons Row (primary only, secondary hidden) -->
    ${renderButtonsRow([
      {
        text: `Reply to ${firstName}`,
        url: replyMailto,
        variant: "primary",
      },
    ])}
  `;

  const footerText = "Sent from the HEGXAI Cal.com booking integration.";

  const html = emailLayout({
    preheader,
    eyebrow,
    title,
    bodyHtml,
    footerText,
  });

  const text = [
    subject,
    "--------------------------------------------------",
    `Name: ${name}`,
    `Email: ${email}`,
    `Company: ${company || "N/A"}`,
    `Call time: ${formattedStartTime}`,
    "Notes:",
    notes || "None",
    "",
    `Reply to ${firstName}: ${replyMailto}`,
    "--------------------------------------------------",
    footerText,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}

