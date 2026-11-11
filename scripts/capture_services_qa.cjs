const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

async function run() {
  const artifactDir = "C:\\Users\\aksha\\.gemini\\antigravity\\brain\\5af10971-c60a-4ba3-8f1f-63b2fa953de2";
  const browser = await chromium.launch({ headless: true });

  try {
    // 1. Desktop 1920x1080
    const desktopContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 1,
      hasTouch: false,
    });
    const desktopPage = await desktopContext.newPage();
    console.log("Navigating to http://localhost:3000/services on Desktop...");
    await desktopPage.goto("http://localhost:3000/services", { waitUntil: "networkidle" });
    await desktopPage.waitForTimeout(1000);

    // Scroll through the page to trigger all ScrollTrigger animations naturally
    await desktopPage.evaluate(async () => {
      const scrollStep = 500;
      const totalHeight = document.body.scrollHeight;
      for (let y = 0; y < totalHeight; y += scrollStep) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 600));
    });

    // Capture Full Page Desktop Screenshot
    const desktopShotPath = path.join(artifactDir, "services_desktop_1920.png");
    await desktopPage.screenshot({ path: desktopShotPath, fullPage: true });
    console.log("Saved full desktop screenshot:", desktopShotPath);

    // Hover over the first service card to capture hover state
    const firstCard = await desktopPage.$(".service-solution-card");
    if (firstCard) {
      await firstCard.scrollIntoViewIfNeeded();
      await desktopPage.waitForTimeout(400);
      await firstCard.hover();
      await desktopPage.waitForTimeout(600);
      const hoverShotPath = path.join(artifactDir, "services_card_hover_1920.png");
      await firstCard.screenshot({ path: hoverShotPath });
      console.log("Saved card hover screenshot:", hoverShotPath);
    }

    // Nav Links Verification
    const navLinks = await desktopPage.evaluate(() => {
      const links = Array.from(document.querySelectorAll("nav[aria-label='Primary'] a"));
      return links.map(a => ({
        text: a.textContent.trim(),
        href: a.getAttribute("href"),
        classes: a.className,
        hasActiveClass: a.classList.contains("is-active"),
      }));
    });
    console.log("Desktop Nav Links on /services:", JSON.stringify(navLinks, null, 2));

    await desktopContext.close();

    // 2. Mobile 390x844
    const mobileContext = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const mobilePage = await mobileContext.newPage();
    console.log("Navigating to http://localhost:3000/services on Mobile 390px...");
    await mobilePage.goto("http://localhost:3000/services", { waitUntil: "networkidle" });
    await mobilePage.waitForTimeout(1000);

    // Scroll through mobile page to trigger ScrollTriggers
    await mobilePage.evaluate(async () => {
      const scrollStep = 400;
      const totalHeight = document.body.scrollHeight;
      for (let y = 0; y < totalHeight; y += scrollStep) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 600));
    });

    // Mobile layout & overflow check
    const mobileMetrics = await mobilePage.evaluate(() => {
      const body = document.body;
      const html = document.documentElement;
      const overflow = body.scrollWidth > window.innerWidth || html.scrollWidth > window.innerWidth;
      
      return {
        viewportWidth: window.innerWidth,
        bodyScrollWidth: body.scrollWidth,
        hasOverflow: overflow,
      };
    });
    console.log("Mobile Metrics:", JSON.stringify(mobileMetrics, null, 2));

    // Capture Full Page Mobile Screenshot
    const mobileShotPath = path.join(artifactDir, "services_mobile_390.png");
    await mobilePage.screenshot({ path: mobileShotPath, fullPage: true });
    console.log("Saved full mobile screenshot:", mobileShotPath);

    await mobileContext.close();
    console.log("QA capture completed successfully!");
  } catch (err) {
    console.error("Error during QA capture:", err);
  } finally {
    await browser.close();
  }
}

run();
