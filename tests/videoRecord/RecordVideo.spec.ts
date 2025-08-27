import { test, chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Aalai Home page Actions with video recording', async () => {
  const browser = await chromium.launch({ headless: false });

  // make sure videos folder exists
  const folder = path.join(__dirname, 'videos');
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  // timestamp for this run
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');

  // create context with video recording
  const context = await browser.newContext({
    recordVideo: { dir: folder, size: { width: 1280, height: 720 } }
  });

  const page = await context.newPage();

  // steps
  await page.goto('http://185.100.212.76:9940/');
  await page.click("text=Login");
  await page.fill('#Username-Login', 'admin');
  await page.fill('#Password-Login', 'admin123');
  await page.click('button[type=submit]');
  await page.waitForTimeout(3000);

  // close → saves video
const video = page.video();
if (video) {
  const videoPath = await video.path();
  const newPath = path.join(folder, `AalaiTest_${timestamp}.webm`);
  fs.renameSync(videoPath, newPath);
  console.log(`🎥 Video saved: ${newPath}`);
}});
