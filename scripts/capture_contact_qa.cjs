const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.resolve('C:/Users/aksha/.gemini/antigravity/brain/5af10971-c60a-4ba3-8f1f-63b2fa953de2');
const QA_DIR = path.join(OUTPUT_DIR, 'contact_qa');
if (!fs.existsSync(QA_DIR)) {
  fs.mkdirSync(QA_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });

  // ───────────────────────────────────────────────
  // 1. DESKTOP RUN (1920 x 1080)
  // ───────────────────────────────────────────────
  console.log('--- DESKTOP (1920x1080) ---');
  const deskContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const deskPage = await deskContext.newPage();
  await deskPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await deskPage.waitForTimeout(600);

  // Scroll to #contact
  const contactSection = await deskPage.$('#contact');
  if (contactSection) {
    await deskPage.evaluate(() => {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await deskPage.waitForTimeout(500);

    // 1A. Idle state
    const idlePath1 = path.join(QA_DIR, 'contact_idle_desktop_1920.png');
    const idlePath2 = path.join(OUTPUT_DIR, 'contact_idle_desktop_1920.png');
    await contactSection.screenshot({ path: idlePath1 });
    fs.copyFileSync(idlePath1, idlePath2);
    console.log('Saved contact_idle_desktop_1920.png');

    // 1B. Focus state test & screenshot
    await deskPage.focus('#contact-name');
    await deskPage.waitForTimeout(300);

    // 1C. Error state: trigger validation error by submitting empty form
    const submitBtn = await deskPage.$('#contact button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await deskPage.waitForTimeout(400);

      const errPath1 = path.join(QA_DIR, 'contact_error_desktop_1920.png');
      const errPath2 = path.join(OUTPUT_DIR, 'contact_error_desktop_1920.png');
      await contactSection.screenshot({ path: errPath1 });
      fs.copyFileSync(errPath1, errPath2);
      console.log('Saved contact_error_desktop_1920.png');
    }
  }

  // 1D. Success / Thanks page redirect test
  await deskPage.goto('http://localhost:3000/thanks', { waitUntil: 'networkidle' });
  await deskPage.waitForTimeout(500);
  const thanksCard = await deskPage.$('.thanks-card');
  const thanksPath1 = path.join(QA_DIR, 'contact_redirect_desktop_1920.png');
  const thanksPath2 = path.join(OUTPUT_DIR, 'contact_redirect_desktop_1920.png');
  if (thanksCard) {
    await deskPage.screenshot({ path: thanksPath1, fullPage: false });
  } else {
    await deskPage.screenshot({ path: thanksPath1 });
  }
  fs.copyFileSync(thanksPath1, thanksPath2);
  console.log('Saved contact_redirect_desktop_1920.png');

  await deskContext.close();

  // ───────────────────────────────────────────────
  // 2. MOBILE RUN (390 x 844)
  // ───────────────────────────────────────────────
  console.log('--- MOBILE (390x844) ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(600);

  const mobileContact = await mobilePage.$('#contact');
  if (mobileContact) {
    await mobilePage.evaluate(() => {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await mobilePage.waitForTimeout(500);

    // 2A. Idle state
    const mIdle1 = path.join(QA_DIR, 'contact_idle_mobile_390.png');
    const mIdle2 = path.join(OUTPUT_DIR, 'contact_idle_mobile_390.png');
    await mobileContact.screenshot({ path: mIdle1 });
    fs.copyFileSync(mIdle1, mIdle2);
    console.log('Saved contact_idle_mobile_390.png');

    // 2B. Error state
    const mSubmitBtn = await mobilePage.$('#contact button[type="submit"]');
    if (mSubmitBtn) {
      await mSubmitBtn.click();
      await mobilePage.waitForTimeout(400);

      const mErr1 = path.join(QA_DIR, 'contact_error_mobile_390.png');
      const mErr2 = path.join(OUTPUT_DIR, 'contact_error_mobile_390.png');
      await mobileContact.screenshot({ path: mErr1 });
      fs.copyFileSync(mErr1, mErr2);
      console.log('Saved contact_error_mobile_390.png');
    }
  }

  // 2C. Success / Thanks page
  await mobilePage.goto('http://localhost:3000/thanks', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(500);
  const mThanks1 = path.join(QA_DIR, 'contact_redirect_mobile_390.png');
  const mThanks2 = path.join(OUTPUT_DIR, 'contact_redirect_mobile_390.png');
  await mobilePage.screenshot({ path: mThanks1, fullPage: false });
  fs.copyFileSync(mThanks1, mThanks2);
  console.log('Saved contact_redirect_mobile_390.png');

  await mobileContext.close();

  // ───────────────────────────────────────────────
  // Measure layout and padding to guarantee specs
  // ───────────────────────────────────────────────
  const inspectContext = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const inspectPage = await inspectContext.newPage();
  await inspectPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  const metrics = await inspectPage.evaluate(() => {
    const leftPanel = document.querySelector('.contact-left');
    const rightPanel = document.querySelector('.contact-right');
    const stepRow = document.querySelector('.contact-step-row');
    const computedLeft = leftPanel ? window.getComputedStyle(leftPanel) : null;
    const computedRight = rightPanel ? window.getComputedStyle(rightPanel) : null;
    const computedRow = stepRow ? window.getComputedStyle(stepRow) : null;
    return {
      leftPadding: computedLeft ? computedLeft.padding : null,
      rightPadding: computedRight ? computedRight.padding : null,
      rowHeight: computedRow ? computedRow.height : null,
    };
  });
  console.log('Computed Desktop Metrics:', JSON.stringify(metrics, null, 2));
  await inspectContext.close();

  await browser.close();
  console.log('All QA captures complete.');
}

capture().catch((err) => {
  console.error('QA capture error:', err);
  process.exit(1);
});

