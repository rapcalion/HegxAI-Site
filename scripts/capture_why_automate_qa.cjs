const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.resolve('C:/Users/aksha/.gemini/antigravity/brain/5af10971-c60a-4ba3-8f1f-63b2fa953de2/why_automate_qa');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });

  // ─── 1. DESKTOP RUN (1920 x 1080) ───
  console.log('Capturing Desktop 1920px...');
  const deskContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const deskPage = await deskContext.newPage();
  await deskPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await deskPage.waitForTimeout(500);

  // A. Desktop BEFORE animation (before scrolling into view / trigger)
  // Disable animation trigger temporarily to capture exact initial state
  const whySection = await deskPage.$('#why');
  if (whySection) {
    // Scroll directly to section with animations disabled first
    console.log('Capturing Desktop Before Animation...');
    // We can capture before triggering by using a page with reduced motion or scroll just before trigger
    await whySection.screenshot({ path: path.join(OUTPUT_DIR, 'why_automate_desktop_1920_before.png') });
  }

  // B. Desktop AFTER animation
  console.log('Triggering animation and waiting for count-up to finish...');
  await deskPage.evaluate(() => {
    document.querySelector('#why')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  // Wait for 1.2s count up + 0.9s columns rise
  await deskPage.waitForTimeout(2200);

  if (whySection) {
    await whySection.screenshot({ path: path.join(OUTPUT_DIR, 'why_automate_desktop_1920_after.png') });
    console.log('Saved why_automate_desktop_1920_after.png');
  }
  await deskContext.close();

  // ─── 2. MOBILE RUN (390 x 844) ───
  console.log('Capturing Mobile 390px...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(500);

  const mobileWhy = await mobilePage.$('#why');
  if (mobileWhy) {
    console.log('Capturing Mobile Before Animation...');
    await mobileWhy.screenshot({ path: path.join(OUTPUT_DIR, 'why_automate_mobile_390_before.png') });

    console.log('Triggering mobile animation...');
    await mobilePage.evaluate(() => {
      document.querySelector('#why')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    await mobilePage.waitForTimeout(2200);

    await mobileWhy.screenshot({ path: path.join(OUTPUT_DIR, 'why_automate_mobile_390_after.png') });
    console.log('Saved why_automate_mobile_390_after.png');
  }

  await mobileContext.close();
  await browser.close();
  console.log('Capture complete!');
}

capture().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});

