const { chromium } = require('playwright');

async function testContactForm() {
  console.log('Testing contact form submit redirect to /thanks?source=form...');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.querySelector('#contact')?.scrollIntoView());
  await page.waitForTimeout(3500); // Wait past honeypot time limit (3000ms)

  await page.fill('#contact-name', 'Vinni Sharma');
  await page.fill('#contact-email', 'shubhamhegxcorp@gmail.com');
  await page.fill('#contact-company', 'Acme Corp');
  await page.fill('#contact-message', 'Automate data entry across platforms');

  const submitBtn = await page.$('#contact button[type="submit"]');
  await submitBtn.click();

  await page.waitForURL('**/thanks?source=form', { timeout: 6000 });
  console.log('Successfully arrived at:', page.url());

  const formThanksData = await page.evaluate(() => {
    const h1 = document.querySelector('h1')?.textContent?.trim();
    const allButtons = Array.from(document.querySelectorAll('button, a')).map(b => b.textContent?.trim());
    const hasBookAuditButton = allButtons.some(b => b?.includes('Book a free audit'));
    return {
      h1,
      hasBookAuditButton,
      pageSnippet: document.querySelector('.thanks-card')?.textContent?.slice(0, 200),
    };
  });

  console.log('Form Thanks Content:', JSON.stringify(formThanksData, null, 2));
  await page.screenshot({ path: 'C:/Users/aksha/.gemini/antigravity/brain/5af10971-c60a-4ba3-8f1f-63b2fa953de2/thanks_form_verified.png' });
  console.log('Screenshot saved: thanks_form_verified.png');

  await browser.close();
  console.log('Contact form test PASSED.');
}

testContactForm().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});

