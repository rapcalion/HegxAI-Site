const { chromium } = require('playwright');

async function testMetrics() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
  });
  const page = await context.newPage();

  // Measure CLS
  await page.addInitScript(() => {
    window.clsScore = 0;
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          window.clsScore += entry.value;
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Scroll through entire page to trigger all ScrollTriggers
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 400;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 50);
    });
  });

  await page.waitForTimeout(1000);

  const cls = await page.evaluate(() => window.clsScore);
  console.log('Mobile CLS Score after full page scroll:', cls);

  await browser.close();
}

testMetrics().catch(console.error);

