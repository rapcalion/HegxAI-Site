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

  await deskPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await deskPage.waitForTimeout(600);

  // Check computed token values
  const computedTokens = await deskPage.evaluate(() => {
    const rootStyle = window.getComputedStyle(document.documentElement);
    const aboutHLine = document.querySelector('#about .section-h-line');
    const aboutVLine = document.querySelector('#about .section-v-line');
    const aboutSquare = document.querySelector('#about .section-end-square');
    const whyHLine = document.querySelector('#why .section-h-line');
    const whySquare = document.querySelector('#why .section-end-square');
    const heroLine = document.querySelector('.hero-strip-bar')?.previousElementSibling;
    const navLine = document.querySelector('.hegxai-desktop-nav-grid div[style*="height: 1px"]');

    return {
      gridLineToken: rootStyle.getPropertyValue('--grid-line').trim(),
      gridLineDarkToken: rootStyle.getPropertyValue('--grid-line-dark').trim(),
      gridSquareToken: rootStyle.getPropertyValue('--grid-square').trim(),
      gridSquareDarkToken: rootStyle.getPropertyValue('--grid-square-dark').trim(),
      aboutHLineBg: aboutHLine ? window.getComputedStyle(aboutHLine).backgroundColor : null,
      aboutVLineBg: aboutVLine ? window.getComputedStyle(aboutVLine).backgroundColor : null,
      aboutSquareBg: aboutSquare ? window.getComputedStyle(aboutSquare).backgroundColor : null,
      whyHLineBg: whyHLine ? window.getComputedStyle(whyHLine).backgroundColor : null,
      whySquareBg: whySquare ? window.getComputedStyle(whySquare).backgroundColor : null,
      heroLineBg: heroLine ? window.getComputedStyle(heroLine).backgroundColor : null,
      navLineBg: navLine ? window.getComputedStyle(navLine).backgroundColor : null,
    };
  });
  console.log('Computed Token & Element Styles:', JSON.stringify(computedTokens, null, 2));

  // A. About + Features boundary (desktop 1920)
  console.log('Capturing About + Features boundary (desktop 1920)...');
  const aboutEl = await deskPage.$('#about');
  const featuresEl = await deskPage.$('#features');
  if (aboutEl && featuresEl) {
    const aboutBox = await aboutEl.boundingBox();
    if (aboutBox) {
      const boundaryY = aboutBox.y + aboutBox.height;
      await deskPage.evaluate((y) => window.scrollTo({ top: y - 450, behavior: 'instant' }), boundaryY);
      await deskPage.waitForTimeout(1000);

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

  // B. Dark section (Why Automate) (desktop 1920)
  console.log('Capturing Why Automate dark section (desktop 1920)...');
  const whyEl = await deskPage.$('#why');
  if (whyEl) {
    await whyEl.scrollIntoViewIfNeeded();
    await deskPage.waitForTimeout(1000);
    const whyBox = await whyEl.boundingBox();
    if (whyBox) {
      await deskPage.screenshot({
        path: path.join(QA_DIR, 'dark_section_desktop_1920.png'),
        clip: whyBox,
      });
      fs.copyFileSync(path.join(QA_DIR, 'dark_section_desktop_1920.png'), path.join(ARTIFACTS_DIR, 'dark_section_desktop_1920.png'));
      console.log('Saved dark_section_desktop_1920.png');
    }
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

  // A. About + Features boundary (mobile 390)
  console.log('Capturing About + Features boundary (mobile 390)...');
  const mobAbout = await mobilePage.$('#about');
  if (mobAbout) {
    const mobAboutBox = await mobAbout.boundingBox();
    if (mobAboutBox) {
      const boundaryY = mobAboutBox.y + mobAboutBox.height;
      await mobilePage.evaluate((y) => window.scrollTo({ top: y - 400, behavior: 'instant' }), boundaryY);
      await mobilePage.waitForTimeout(1000);

      await mobilePage.screenshot({
        path: path.join(QA_DIR, 'boundary_about_features_mobile_390.png'),
        clip: {
          x: 0,
          y: 0,
          width: 390,
          height: 800,
        },
      });
      fs.copyFileSync(path.join(QA_DIR, 'boundary_about_features_mobile_390.png'), path.join(ARTIFACTS_DIR, 'boundary_about_features_mobile_390.png'));
      console.log('Saved boundary_about_features_mobile_390.png');
    }
  }

  // B. Dark section (Why Automate) (mobile 390)
  console.log('Capturing Why Automate dark section (mobile 390)...');
  const mobWhy = await mobilePage.$('#why');
  if (mobWhy) {
    await mobWhy.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(1000);
    const whyTopDoc = await mobilePage.evaluate(() => {
      const el = document.querySelector('#why');
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      return rect.top + window.scrollY;
    });

    if (whyTopDoc !== null) {
      // Scroll so the top horizontal line and section bar of Why Automate are visible
      await mobilePage.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), whyTopDoc);
      await mobilePage.waitForTimeout(1000);

      await mobilePage.screenshot({
        path: path.join(QA_DIR, 'dark_section_mobile_390.png'),
        clip: {
          x: 0,
          y: 0,
          width: 390,
          height: 800,
        },
      });
      fs.copyFileSync(path.join(QA_DIR, 'dark_section_mobile_390.png'), path.join(ARTIFACTS_DIR, 'dark_section_mobile_390.png'));
      console.log('Saved dark_section_mobile_390.png');
    }
  }

  await mobileContext.close();
  await browser.close();
  console.log('All QA captures completed successfully!');
}

capture().catch((err) => {
  console.error('Error during capture:', err);
  process.exit(1);
});
