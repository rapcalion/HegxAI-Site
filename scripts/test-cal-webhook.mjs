import crypto from "node:crypto";
import fs from "node:fs";

// Load CAL_WEBHOOK_SECRET from environment or fallback to .env.local
let secret = process.env.CAL_WEBHOOK_SECRET;
if (!secret && fs.existsSync(".env.local")) {
  const envContent = fs.readFileSync(".env.local", "utf8");
  const match = envContent.match(/^CAL_WEBHOOK_SECRET=["']?([^"'\r\n]+)["']?/m);
  if (match) {
    secret = match[1];
  }
}

if (!secret) {
  console.error("Error: CAL_WEBHOOK_SECRET environment variable is required.");
  process.exit(1);
}

const rawBaseUrl = process.argv[2] || process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const baseUrl = rawBaseUrl.replace(/\/+$/, "");
const targetUrl = `${baseUrl}/api/webhooks/cal`;

const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

const payload = {
  triggerEvent: "BOOKING_CREATED",
  payload: {
    startTime: tomorrow,
    attendees: [
      {
        name: "Test Person",
        email: "test@example.com",
      },
    ],
    responses: {
      "what-do-you-want-to-automate": {
        label: "What do you want to automate?",
        value: "Lead qualification and routing into our CRM",
      },
    },
  },
};

const rawBody = JSON.stringify(payload);
const signature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

console.log(`Target URL: ${targetUrl}`);
console.log(`Trigger Event: ${payload.triggerEvent}`);

try {
  const res = await fetch(targetUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-cal-signature-256": signature,
    },
    body: rawBody,
  });

  const responseText = await res.text();
  console.log(`HTTP Status: ${res.status}`);
  console.log(`Response Body: ${responseText}`);
} catch (err) {
  console.error(`Request failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
}

