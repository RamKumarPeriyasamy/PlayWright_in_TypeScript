import { test, chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const folder = path.join(__dirname, 'videos', timestamp.split('T')[0]);
if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });

const resolutions = [
  { name: '720p', width: 1280, height: 720 },
  { name: '1080p', width: 1920, height: 1080 },
  { name: '4K', width: 3840, height: 2160 }
];

for (const res of resolutions) {
  test(`Aalai Home page Actions at ${res.name}`, async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext({
      viewport: { width: res.width, height: res.height },
      recordVideo: { dir: folder, size: { width: res.width, height: res.height } }
    });
    const page = await context.newPage();

    // --- Steps ---
    await page.goto('http://185.100.212.76:9940/');
    await page.waitForTimeout(2000);
    await page.click("text=Login");
    await page.fill('#Username-Login', 'admin');
    await page.fill('#Password-Login', 'admin123');
    await page.waitForTimeout(2000);
    await page.click('text=Forgot password?');
    await page.waitForTimeout(2000);
    await page.click('text=Understood');
    await page.click('button[type=submit]');
    await page.waitForTimeout(3000);

    // close and save
    await context.close();
    await browser.close();

    const videoPath = await page.video()?.path();
    if (videoPath) {
      const newPath = path.join(folder, `AalaiTest_${timestamp}_${res.name}.webm`);
      fs.renameSync(videoPath, newPath);
      console.log(`✅ Saved: ${newPath}`);
    }
  });
}
