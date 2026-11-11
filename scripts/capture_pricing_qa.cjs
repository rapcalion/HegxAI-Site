const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.resolve('C:/Users/aksha/.gemini/antigravity/brain/5af10971-c60a-4ba3-8f1f-63b2fa953de2');
const QA_DIR = path.join(OUTPUT_DIR, 'pricing_qa');
if (!fs.existsSync(QA_DIR)) {
  fs.mkdirSync(QA_DIR, { recursive: true });
}

async function capture() {
  console.log('Launching browser for pricing QA capture...');
  const browser = await chromium.launch({ headless: true });

  // 1. DESKTOP 1920 x 1080
  console.log('--- Desktop 1920px ---');
  const deskContext = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const deskPage = await deskContext.newPage();
  await deskPage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await deskPage.waitForTimeout(500);

  const pricingSection = await deskPage.$('#pricing');
  if (pricingSection) {
    await deskPage.evaluate(() => {
      document.querySelector('#pricing')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await deskPage.waitForTimeout(600);

    const deskMetrics = await deskPage.evaluate(() => {
      const topCream = document.querySelector('.pricing-card-cream .pricing-card-top');
      const topDark = document.querySelector('.pricing-card-dark .pricing-card-top');
      const priceCream = document.querySelector('.pricing-card-cream .pricing-price-inner');
      const priceDark = document.querySelector('.pricing-card-dark .pricing-price-inner');
      const featCream = document.querySelector('.pricing-card-cream .pricing-card-features');
      const featDark = document.querySelector('.pricing-card-dark .pricing-card-features');

      return {
        creamTopPadding: topCream ? window.getComputedStyle(topCream).padding : null,
        darkTopPadding: topDark ? window.getComputedStyle(topDark).padding : null,
        creamPricePadding: priceCream ? window.getComputedStyle(priceCream).padding : null,
        darkPricePadding: priceDark ? window.getComputedStyle(priceDark).padding : null,
        creamFeatPadding: featCream ? window.getComputedStyle(featCream).padding : null,
        darkFeatPadding: featDark ? window.getComputedStyle(featDark).padding : null,
      };
    });
    console.log('Desktop Computed Metrics:', JSON.stringify(deskMetrics, null, 2));

    const pDesk1 = path.join(QA_DIR, 'pricing_desktop_1920.png');
    const pDesk2 = path.join(OUTPUT_DIR, 'pricing_desktop_1920.png');
    await pricingSection.screenshot({ path: pDesk1 });
    fs.copyFileSync(pDesk1, pDesk2);
    console.log('Saved pricing_desktop_1920.png');
  }
  await deskContext.close();

  // 2. MOBILE 390 x 844
  console.log('--- Mobile 390px ---');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(500);

  const mobilePricing = await mobilePage.$('#pricing');
  if (mobilePricing) {
    await mobilePage.evaluate(() => {
      document.querySelector('#pricing')?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    await mobilePage.waitForTimeout(500);

    // 2A. Starter Tab Active
    await mobilePage.click('button:has-text("Starter")');
    await mobilePage.waitForTimeout(300);

    const mMetrics = await mobilePage.evaluate(() => {
      const top = document.querySelector('.pricing-card-cream .pricing-card-top');
      const price = document.querySelector('.pricing-card-cream .pricing-price-inner');
      const feat = document.querySelector('.pricing-card-cream .pricing-card-features');
      const title = document.querySelector('.pricing-card-cream .pricing-card-title');
      const desc = document.querySelector('.pricing-card-cream .pricing-card-desc');
      const featItem = document.querySelector('.pricing-card-cream .pricing-card-features li span:last-child');
      const cta = document.querySelector('.pricing-card-cream .pricing-cta-bar');

      return {
        topPadding: top ? window.getComputedStyle(top).padding : null,
        pricePadding: price ? window.getComputedStyle(price).padding : null,
        featPadding: feat ? window.getComputedStyle(feat).padding : null,
        titleFontSize: title ? window.getComputedStyle(title).fontSize : null,
        descFontSize: desc ? window.getComputedStyle(desc).fontSize : null,
        featFontSize: featItem ? window.getComputedStyle(featItem).fontSize : null,
        ctaFontSize: cta ? window.getComputedStyle(cta).fontSize : null,
      };
    });
    console.log('Mobile Computed Metrics (Starter):', JSON.stringify(mMetrics, null, 2));

    const pMob1 = path.join(QA_DIR, 'pricing_mobile_390_starter.png');
    const pMob2 = path.join(OUTPUT_DIR, 'pricing_mobile_390_starter.png');
    await mobilePricing.screenshot({ path: pMob1 });
    fs.copyFileSync(pMob1, pMob2);
    console.log('Saved pricing_mobile_390_starter.png');

    // 2B. Growth Tab Active
    await mobilePage.click('button:has-text("Growth")');
    await mobilePage.waitForTimeout(300);

    const pMobGrowth1 = path.join(QA_DIR, 'pricing_mobile_390_growth.png');
    const pMobGrowth2 = path.join(OUTPUT_DIR, 'pricing_mobile_390_growth.png');
    await mobilePricing.screenshot({ path: pMobGrowth1 });
    fs.copyFileSync(pMobGrowth1, pMobGrowth2);
    console.log('Saved pricing_mobile_390_growth.png');
  }
  await mobileContext.close();

  await browser.close();
  console.log('All QA captures complete.');
}

capture().catch((err) => {
  console.error('QA capture error:', err);
  process.exit(1);
});

