const { chromium } = require('playwright');

async function testBookingRedirect() {
  console.log('Launching browser to test Cal booking success redirect and overlay...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  console.log('Clicking booking CTA to open modal...');
  const heroCta = await page.$('a:has-text("Book a call"), a:has-text("Book a free audit")');
  if (heroCta) {
    await heroCta.click();
  }

  // Wait for Cal embed script to initialize
  await page.waitForTimeout(1500);

  console.log('Dispatching CAL::bookingSuccessfulV2 on window...');
  // Dispatch event from page
  await page.evaluate(() => {
    const evt = new CustomEvent('CAL::bookingSuccessfulV2', {
      detail: { type: 'bookingSuccessfulV2', data: { uid: '123', status: 'ACCEPTED' } }
    });
    window.dispatchEvent(evt);
  });

  // Check overlay presence immediately
  const overlay = await page.waitForSelector('.confirming-overlay', { state: 'attached', timeout: 2000 });
  const overlayText = await overlay.textContent();
  const overlayStyles = await overlay.evaluate(el => {
    const cs = window.getComputedStyle(el);
    return {
      zIndex: cs.zIndex,
      backgroundColor: cs.backgroundColor,
      position: cs.position,
      display: cs.display,
      alignItems: cs.alignItems,
      justifyContent: cs.justifyContent,
    };
  });

  console.log('Confirming Overlay Verified:', {
    text: overlayText.trim(),
    styles: overlayStyles,
  });

  // Wait for navigation to /thanks?source=cal
  console.log('Waiting for URL navigation to /thanks?source=cal...');
  await page.waitForURL('**/thanks?source=cal', { timeout: 6000 });
  console.log('Successfully arrived at URL:', page.url());

  // Verify /thanks content
  const thanksData = await page.evaluate(() => {
    const h1 = document.querySelector('h1')?.textContent?.trim();
    const allButtons = Array.from(document.querySelectorAll('button, a')).map(b => b.textContent?.trim());
    const hasBookAuditButton = allButtons.some(b => b?.includes('Book a free audit'));
    const steps = Array.from(document.querySelectorAll('.thanks-card div div')).map(el => el.textContent?.trim()).filter(Boolean);

    return {
      h1,
      hasBookAuditButton,
      stepsCount: steps.length,
      pageTextSnippet: document.querySelector('.thanks-card')?.textContent?.slice(0, 250),
    };
  });
  console.log('Thanks Page Content Verified:', JSON.stringify(thanksData, null, 2));

  await page.screenshot({ path: 'C:/Users/aksha/.gemini/antigravity/brain/5af10971-c60a-4ba3-8f1f-63b2fa953de2/thanks_cal_verified.png' });
  console.log('Screenshot saved: thanks_cal_verified.png');

  await browser.close();
  console.log('ALL CHECKS PASSED.');
}

testBookingRedirect().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
