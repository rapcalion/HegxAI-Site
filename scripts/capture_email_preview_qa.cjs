const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.resolve('C:/Users/aksha/.gemini/antigravity/brain/5af10971-c60a-4ba3-8f1f-63b2fa953de2');
const QA_DIR = path.join(OUTPUT_DIR, 'email_preview_qa');
if (!fs.existsSync(QA_DIR)) {
  fs.mkdirSync(QA_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching browser for email preview capture...');
  const browser = await chromium.launch({ headless: true });

  const types = ['lead', 'autoreply', 'booking'];

  // 1. Desktop 1920x1080
  console.log('--- Desktop (1920x1080) ---');
  const deskContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const deskPage = await deskContext.newPage();

  for (const type of types) {
    const url = `http://localhost:3000/api/dev/email-preview?type=${type}`;
    console.log(`Navigating to ${url}...`);
    await deskPage.goto(url, { waitUntil: 'networkidle' });
    await deskPage.waitForTimeout(400);

    const filename = `email_preview_${type}_1920.png`;
    const target1 = path.join(QA_DIR, filename);
    const target2 = path.join(OUTPUT_DIR, filename);

    await deskPage.screenshot({ path: target1, fullPage: true });
    fs.copyFileSync(target1, target2);
    console.log(`Saved ${filename}`);
  }
  await deskContext.close();

  // 2. Mobile 390x844
  console.log('--- Mobile (390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();

  for (const type of types) {
    const url = `http://localhost:3000/api/dev/email-preview?type=${type}`;
    console.log(`Navigating to ${url}...`);
    await mobilePage.goto(url, { waitUntil: 'networkidle' });
    await mobilePage.waitForTimeout(400);

    const filename = `email_preview_${type}_390.png`;
    const target1 = path.join(QA_DIR, filename);
    const target2 = path.join(OUTPUT_DIR, filename);

    await mobilePage.screenshot({ path: target1, fullPage: true });
    fs.copyFileSync(target1, target2);
    console.log(`Saved ${filename}`);
  }
  await mobileContext.close();

  await browser.close();
  console.log('All email preview QA screenshots captured successfully.');
}

capture().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});

