import { test, chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Aalai Home page Actions with video recording', async () => {
  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-'); // e.g. 2025-08-26T10-30-05

  // create a dated folder for recordings
  const folder = path.join(__dirname, 'videos', timestamp.split('T')[0]); 
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    recordVideo: { dir: folder }  // store in folder first
  });
  const page = await context.newPage();

  await page.goto('http://185.100.212.76:9940/');
  await page.waitForTimeout(5000);
  await page.click("text=Login");
  await page.fill('#Username-Login', 'admin');
  await page.fill('#Password-Login', 'admin123');
  await page.waitForTimeout(2000);
  await page.click('text=Forgot password?');
  await page.waitForTimeout(2000);
  await page.click('text=Understood');
  await page.click('button[type=submit]');
  await page.waitForTimeout(3000);
  // close and save video
  await context.close();
  await browser.close();

  // rename with custom name + timestamp
  const video = page.video();
  if (video) {
    const videoPath = await video.path();
    const newPath = path.join(folder, `AalaiTest_${timestamp}.webm`);
    fs.renameSync(videoPath, newPath);
    console.log(`🎥 Video saved: ${newPath}`);
  }
});
