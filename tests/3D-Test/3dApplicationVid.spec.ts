import { test, chromium } from '@playwright/test';
import path from 'path';

test('Automate Three.js scene with OrbitControls + Video Recording', async () => {
  // 📂 Save videos in "videos" folder
  const videoDir = path.join(__dirname, 'videos');

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: videoDir }   // 🎥 enable video recording
  });
  const page = await context.newPage();

  // 🌐 Go to your 3D app
  await page.goto('http://185.100.212.76:8400/'); 

  // 🔑 Login
  await page.fill('//input[@type="email"]', 'ramkumar@testui.com');
  await page.fill('input[placeholder="Password"]', '123456');
  await page.click('#form-submit');
  await page.waitForTimeout(3000);

  // 🎨 Wait for 3D canvas
  const canvas = page.locator('canvas');
  await canvas.waitFor({ state: 'visible' });

  // 🎥 Orbit (drag rotate)
  await page.mouse.move(400, 300);
  await page.mouse.down();
  await page.mouse.move(700, 350, { steps: 20 });
  await page.mouse.up();
  await page.waitForTimeout(2000);

  // 🔍 Zoom in/out
  await page.mouse.move(600, 400);
  await page.mouse.wheel(0, -500);
  await page.waitForTimeout(2000);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(2000);

  // 📸 Screenshot
  await page.screenshot({ path: 'threejs-automation.png' });

  // ✅ Close browser (video will be saved here)
  await context.close();
  await browser.close();

  // 🎞️ Rename video with timestamp
  const video = page.video();
  if (video) {
    const videoPath = await video.path();
    const newPath = path.join(videoDir, `threejs-automation-${Date.now()}.webm`);
    const fs = require('fs');
    fs.renameSync(videoPath, newPath);
    console.log(`🎥 Video saved at: ${newPath}`);
  }
});
