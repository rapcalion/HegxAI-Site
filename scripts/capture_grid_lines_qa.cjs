const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACTS_DIR = path.resolve('C:/Users/aksha/.gemini/antigravity/brain/5af10971-c60a-4ba3-8f1f-63b2fa953de2');
const QA_DIR = path.join(ARTIFACTS_DIR, 'grid_lines_qa');
if (!fs.existsSync(QA_DIR)) {
  fs.mkdirSync(QA_DIR, { recursive: true });
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
  
  // Track console errors
  const errors = [];
  deskPage.on('pageerror', (err) => errors.push(err.message));
  deskPage.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });

  await deskPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await deskPage.waitForTimeout(600);

  // A. Hero strip lines check
  console.log('Capturing Hero strip lines...');
  const heroStrip = await deskPage.$('.hero-strip-bar');
  if (heroStrip) {
    const heroStripBox = await heroStrip.boundingBox();
    if (heroStripBox) {
      await deskPage.screenshot({
        path: path.join(QA_DIR, 'hero_strip_desktop_1920.png'),
        clip: {
          x: 0,
          y: Math.max(0, heroStripBox.y - 40),
          width: 1920,
          height: heroStripBox.height + 80,
        },
      });
      fs.copyFileSync(path.join(QA_DIR, 'hero_strip_desktop_1920.png'), path.join(ARTIFACTS_DIR, 'hero_strip_desktop_1920.png'));
    }
  }

  // B. About + Features boundary (scroll so About bottom and Features top meet in viewport)
  console.log('Capturing About + Features boundary...');
  const aboutEl = await deskPage.$('#about');
  const featuresEl = await deskPage.$('#features');
  if (aboutEl && featuresEl) {
    const aboutBox = await aboutEl.boundingBox();
    const featuresBox = await featuresEl.boundingBox();
    if (aboutBox && featuresBox) {
      // Boundary is at aboutBox.y + aboutBox.height
      const boundaryY = aboutBox.y + aboutBox.height;
      // Scroll to boundary
      await deskPage.evaluate((y) => window.scrollTo({ top: y - 400, behavior: 'instant' }), boundaryY);
      await deskPage.waitForTimeout(800);

      // Trigger scroll animation
      const scrollPos = await deskPage.evaluate(() => window.scrollY);
      await deskPage.screenshot({
        path: path.join(QA_DIR, 'boundary_about_features_desktop_1920.png'),
        clip: {
          x: 0,
          y: 0,
          width: 1920,
          height: 900,
        },
      });
      fs.copyFileSync(path.join(QA_DIR, 'boundary_about_features_desktop_1920.png'), path.join(ARTIFACTS_DIR, 'boundary_about_features_desktop_1920.png'));
      console.log('Saved boundary_about_features_desktop_1920.png');
    }
  }

  // C. Why Automate (dark section with hairlines & cream squares)
  console.log('Capturing Why Automate (dark section)...');
  const whyEl = await deskPage.$('#why');
  if (whyEl) {
    await whyEl.scrollIntoViewIfNeeded();
    await deskPage.waitForTimeout(1000);
    await whyEl.screenshot({ path: path.join(QA_DIR, 'why_automate_desktop_1920.png') });
    fs.copyFileSync(path.join(QA_DIR, 'why_automate_desktop_1920.png'), path.join(ARTIFACTS_DIR, 'why_automate_desktop_1920.png'));
    console.log('Saved why_automate_desktop_1920.png');
  }

  // D. Pricing section
  console.log('Capturing Pricing section...');
  const pricingEl = await deskPage.$('#pricing');
  if (pricingEl) {
    await pricingEl.scrollIntoViewIfNeeded();
    await deskPage.waitForTimeout(1000);
    await pricingEl.screenshot({ path: path.join(QA_DIR, 'pricing_desktop_1920.png') });
    fs.copyFileSync(path.join(QA_DIR, 'pricing_desktop_1920.png'), path.join(ARTIFACTS_DIR, 'pricing_desktop_1920.png'));
    console.log('Saved pricing_desktop_1920.png');
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
  await mobilePage.waitForTimeout(600);

  // Check overflow
  const overflowData = await mobilePage.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      bodyScrollWidth: document.body.scrollWidth,
    };
  });
  console.log('Mobile overflow data:', overflowData);

  // Check vertical lines hidden on mobile
  const vLineVisibility = await mobilePage.evaluate(() => {
    const vLines = document.querySelectorAll('.section-v-line');
    const displays = Array.from(vLines).map((el) => window.getComputedStyle(el).display);
    return {
      total: vLines.length,
      allNone: displays.every((d) => d === 'none'),
      uniqueDisplays: [...new Set(displays)],
    };
  });
  console.log('Mobile vertical lines visibility:', vLineVisibility);

  // Capture About on mobile
  const mobileAbout = await mobilePage.$('#about');
  if (mobileAbout) {
    await mobileAbout.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(1000);
    await mobileAbout.screenshot({ path: path.join(QA_DIR, 'about_mobile_390.png') });
    fs.copyFileSync(path.join(QA_DIR, 'about_mobile_390.png'), path.join(ARTIFACTS_DIR, 'about_mobile_390.png'));
    console.log('Saved about_mobile_390.png');
  }

  // Capture Why Automate on mobile
  const mobileWhy = await mobilePage.$('#why');
  if (mobileWhy) {
    await mobileWhy.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(1000);
    await mobileWhy.screenshot({ path: path.join(QA_DIR, 'why_automate_mobile_390.png') });
    fs.copyFileSync(path.join(QA_DIR, 'why_automate_mobile_390.png'), path.join(ARTIFACTS_DIR, 'why_automate_mobile_390.png'));
    console.log('Saved why_automate_mobile_390.png');
  }

  // Check end square positions on mobile
  const squarePositions = await mobilePage.evaluate(() => {
    const squares = Array.from(document.querySelectorAll('.section-end-square')).slice(0, 4);
    return squares.map((sq) => {
      const rect = sq.getBoundingClientRect();
      const style = window.getComputedStyle(sq);
      return {
        width: rect.width,
        height: rect.height,
        leftComputed: style.left,
        rightComputed: style.right,
      };
    });
  });
  console.log('Mobile square positions sample:', squarePositions);

  await mobileContext.close();
  await browser.close();

  const results = {
    errors,
    overflowData,
    vLineVisibility,
    squarePositions,
  };

  fs.writeFileSync(path.join(QA_DIR, 'results.json'), JSON.stringify(results, null, 2));
  console.log('QA run completed successfully!');
}

capture().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});

