const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

const ARTIFACT_DIR = path.resolve('C:/Users/aksha/.gemini/antigravity/brain/5af10971-c60a-4ba3-8f1f-63b2fa953de2/glyph_qa');
if (!fs.existsSync(ARTIFACT_DIR)) {
  fs.mkdirSync(ARTIFACT_DIR, { recursive: true });
}

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });

  // ─── 1. DESKTOP RUN (1920 x 1080) with VIDEO RECORDING ───
  console.log('Starting Desktop run at 1920x1080 with video recording...');
  const videoTempDir = path.join(ARTIFACT_DIR, 'video_raw');
  if (!fs.existsSync(videoTempDir)) fs.mkdirSync(videoTempDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: videoTempDir,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  // Wait for requestIdleCallback / canvas start
  await page.waitForTimeout(1000);

  // Scroll so glyph field is nicely in view
  const glyphField = await page.$('.glyph-field-band');
  if (!glyphField) {
    console.error('GlyphField element not found!');
  } else {
    await glyphField.scrollIntoViewIfNeeded();
  }
  await page.waitForTimeout(500);

  // Measure Desktop Grid & Cell Count
  const desktopMetrics = await page.evaluate(() => {
    const el = document.querySelector('.glyph-field-band');
    const canvas = el?.querySelector('canvas');
    if (!el || !canvas) return null;
    const width = el.clientWidth;
    const height = el.clientHeight;
    const cellSize = 12; // desktop
    const cols = Math.ceil(width / cellSize);
    const rows = Math.ceil(height / cellSize);
    const totalCells = cols * rows;
    return {
      bandWidth: width,
      bandHeight: height,
      cellSize,
      cols,
      rows,
      totalCells,
      canvasWidth: canvas.width,
      canvasHeight: canvas.height
    };
  });
  console.log('Desktop Metrics:', desktopMetrics);

  // Measure FPS over 120 frames in browser
  console.log('Measuring FPS over 120 frames...');
  const fpsData = await page.evaluate(async () => {
    return new Promise((resolve) => {
      let frames = 0;
      const targetFrames = 120;
      const frameTimes = [];
      let lastTime = performance.now();

      function onFrame(now) {
        const delta = now - lastTime;
        lastTime = now;
        frameTimes.push(delta);
        frames++;

        if (frames < targetFrames) {
          requestAnimationFrame(onFrame);
        } else {
          // Exclude first frame spike
          const validDeltas = frameTimes.slice(1);
          const avgDelta = validDeltas.reduce((a, b) => a + b, 0) / validDeltas.length;
          const fps = 1000 / avgDelta;
          const maxDelta = Math.max(...validDeltas);
          const minDelta = Math.min(...validDeltas);
          resolve({ fps: Math.round(fps * 10) / 10, avgDelta: Math.round(avgDelta * 100) / 100, minDelta, maxDelta });
        }
      }

      requestAnimationFrame(onFrame);
    });
  });
  console.log('FPS Performance Result:', fpsData);

  // Capture Still 1: Idle Field
  console.log('Capturing Still 1: Idle Field...');
  if (glyphField) {
    await glyphField.screenshot({ path: path.join(ARTIFACT_DIR, 'glyph_field_idle_1920.png') });
  }

  // Pointer Interaction: Move cursor over field
  console.log('Hovering cursor over glyph field to show ripple and crosshair...');
  const box = await glyphField.boundingBox();
  if (box) {
    const hoverX = box.x + box.width * 0.52;
    const hoverY = box.y + box.height * 0.48;

    // Move smoothly to the point
    await page.mouse.move(box.x + 200, box.y + 100);
    await page.waitForTimeout(100);
    await page.mouse.move(hoverX, hoverY, { steps: 25 });
    await page.waitForTimeout(300); // Allow ripple and crosshair to catch up

    // Capture Still 2: With cursor over field
    console.log('Capturing Still 2: Cursor over field...');
    await glyphField.screenshot({ path: path.join(ARTIFACT_DIR, 'glyph_field_active_cursor_1920.png') });

    // Move cursor around gently for the video recording (simulate natural user interaction)
    for (let i = 0; i < 4; i++) {
      const offsetX = Math.sin(i * 1.5) * 200;
      const offsetY = Math.cos(i * 1.5) * 60;
      await page.mouse.move(hoverX + offsetX, hoverY + offsetY, { steps: 30 });
      await page.waitForTimeout(700);
    }
  }

  // Wait remaining time for ~6-8s total motion demonstration
  await page.waitForTimeout(2000);

  // Close context to finish video
  const video = page.video();
  await context.close();
  const videoPath = await video.path();
  console.log('Raw video saved to:', videoPath);

  // Convert webm to GIF using ffmpeg
  const gifPath = path.join(ARTIFACT_DIR, 'glyph_field_motion.gif');
  console.log('Converting video to optimized GIF via ffmpeg...');
  try {
    execSync(`ffmpeg -y -i "${videoPath}" -t 7 -vf "fps=20,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer" "${gifPath}"`, { stdio: 'inherit' });
    console.log('Successfully created animated GIF:', gifPath);
  } catch (err) {
    console.error('FFmpeg GIF generation failed:', err.message);
  }

  // ─── 2. MOBILE RUN (390 x 844) ───
  console.log('Starting Mobile run at 390x844...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  await mobilePage.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await mobilePage.waitForTimeout(1000);

  const mobileGlyphField = await mobilePage.$('.glyph-field-band');
  if (mobileGlyphField) {
    await mobileGlyphField.scrollIntoViewIfNeeded();
    await mobilePage.waitForTimeout(500);

    const mobileMetrics = await mobilePage.evaluate(() => {
      const el = document.querySelector('.glyph-field-band');
      const canvas = el?.querySelector('canvas');
      if (!el || !canvas) return null;
      const width = el.clientWidth;
      const height = el.clientHeight;
      const cellSize = 14; // mobile
      const cols = Math.ceil(width / cellSize);
      const rows = Math.ceil(height / cellSize);
      const totalCells = cols * rows;
      return {
        bandWidth: width,
        bandHeight: height,
        cellSize,
        cols,
        rows,
        totalCells,
        canvasWidth: canvas.width,
        canvasHeight: canvas.height
      };
    });
    console.log('Mobile Metrics:', mobileMetrics);

    await mobileGlyphField.screenshot({ path: path.join(ARTIFACT_DIR, 'glyph_field_mobile_390.png') });
    console.log('Saved mobile screenshot: glyph_field_mobile_390.png');
  }

  await mobileContext.close();
  await browser.close();

  // Save report summary json
  fs.writeFileSync(path.join(ARTIFACT_DIR, 'metrics.json'), JSON.stringify({
    desktopMetrics,
    fpsData,
    timestamp: new Date().toISOString()
  }, null, 2));

  console.log('QA run complete!');
}

run().catch((err) => {
  console.error('QA script error:', err);
  process.exit(1);
});
