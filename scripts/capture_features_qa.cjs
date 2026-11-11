const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.resolve('C:/Users/aksha/.gemini/antigravity/brain/5af10971-c60a-4ba3-8f1f-63b2fa953de2');
const QA_DIR = path.join(OUTPUT_DIR, 'features_qa');
if (!fs.existsSync(QA_DIR)) {
  fs.mkdirSync(QA_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching browser for Features visual QA capture...');
  const browser = await chromium.launch({ headless: true });

  // 1. DESKTOP 1920 x 1080
  console.log('--- Desktop 1920px ---');
  const deskContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const deskPage = await deskContext.newPage();
  await deskPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await deskPage.waitForTimeout(1000);

  // Scroll to features section
  await deskPage.evaluate(() => {
    document.querySelector('#features')?.scrollIntoView({ behavior: 'instant', block: 'center' });
  });
  await deskPage.waitForTimeout(1000);

  const featuresEl = await deskPage.$('#features');
  if (!featuresEl) {
    console.error('Could not find #features section');
    await browser.close();
    return;
  }

  // Feature 1 at rest (1920)
  console.log('Capturing Feature 1 at rest (1920)...');
  await deskPage.screenshot({
    path: path.join(OUTPUT_DIR, 'features_desktop_1920_feature1.png'),
    clip: await featuresEl.boundingBox(),
  });
  await deskPage.screenshot({
    path: path.join(QA_DIR, 'features_desktop_1920_feature1.png'),
    clip: await featuresEl.boundingBox(),
  });

  // Switch to Feature 2
  console.log('Clicking Next to Feature 2...');
  const nextBtn = await deskPage.$('button[aria-label="Next feature"]');
  if (nextBtn) {
    await nextBtn.click();
    await deskPage.waitForTimeout(1200); // Wait for transition to complete
    console.log('Capturing Feature 2 at rest (1920)...');
    await deskPage.screenshot({
      path: path.join(OUTPUT_DIR, 'features_desktop_1920_feature2.png'),
      clip: await featuresEl.boundingBox(),
    });
    await deskPage.screenshot({
      path: path.join(QA_DIR, 'features_desktop_1920_feature2.png'),
      clip: await featuresEl.boundingBox(),
    });

    // Switch to Feature 3
    console.log('Clicking Next to Feature 3...');
    await nextBtn.click();
    await deskPage.waitForTimeout(1200); // Wait for transition to complete
    console.log('Capturing Feature 3 at rest (1920)...');
    await deskPage.screenshot({
      path: path.join(OUTPUT_DIR, 'features_desktop_1920_feature3.png'),
      clip: await featuresEl.boundingBox(),
    });
    await deskPage.screenshot({
      path: path.join(QA_DIR, 'features_desktop_1920_feature3.png'),
      clip: await featuresEl.boundingBox(),
    });

    // Mid-transition capture: click Prev and capture after ~100ms
    console.log('Triggering transition for mid-transition capture...');
    const prevBtn = await deskPage.$('button[aria-label="Previous feature"]');
    if (prevBtn) {
      await prevBtn.click();
      await deskPage.waitForTimeout(100); // Mid-transition window (fade/slide out)
      console.log('Capturing mid-transition (1920)...');
      await deskPage.screenshot({
        path: path.join(OUTPUT_DIR, 'features_desktop_1920_transition.png'),
        clip: await featuresEl.boundingBox(),
      });
      await deskPage.screenshot({
        path: path.join(QA_DIR, 'features_desktop_1920_transition.png'),
        clip: await featuresEl.boundingBox(),
      });
    }
  }

  await deskContext.close();

  // 2. MOBILE 390 x 844
  console.log('--- Mobile 390px ---');
  const mobContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mobPage = await mobContext.newPage();
  await mobPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobPage.waitForTimeout(1000);

  await mobPage.evaluate(() => {
    document.querySelector('#features')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await mobPage.waitForTimeout(1000);

  const mobFeaturesEl = await mobPage.$('#features');
  if (mobFeaturesEl) {
    console.log('Capturing Mobile at 390...');
    await mobPage.screenshot({
      path: path.join(OUTPUT_DIR, 'features_mobile_390.png'),
      clip: await mobFeaturesEl.boundingBox(),
    });
    await mobPage.screenshot({
      path: path.join(QA_DIR, 'features_mobile_390.png'),
      clip: await mobFeaturesEl.boundingBox(),
    });
  }

  await mobContext.close();
  await browser.close();
  console.log('Features QA capture finished successfully.');
}

capture().catch((err) => {
  console.error('Features QA capture failed:', err);
  process.exit(1);
});

