import { test, chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

// helper to create timestamped folder
function createRunFolder() {
  const baseFolder = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(baseFolder)) {
    fs.mkdirSync(baseFolder, { recursive: true });
  }

  const now = new Date();
  const folderName =
    now.getFullYear() + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    String(now.getDate()).padStart(2, "0") + "_" +
    String(now.getHours()).padStart(2, "0") + "-" +
    String(now.getMinutes()).padStart(2, "0") + "-" +
    String(now.getSeconds()).padStart(2, "0");

  const runFolder = path.join(baseFolder, folderName);
  fs.mkdirSync(runFolder, { recursive: true });
  return runFolder;
}

test('Aalai Home page Actions with structured screenshots', async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // create unique folder for this run
  const runFolder = createRunFolder();

  // Step 1: Open Home Page
  await page.goto('http://185.100.212.76:9940/');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(runFolder, 'step1-home.png') });

  // Step 2: Click Login
  await page.click("text=Login");
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(runFolder, 'step2-login.png') });

  // Step 3: Fill username
  await page.fill('#Username-Login', 'admin');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(runFolder, 'step3-username.png') });

  // Step 4: Fill password
  await page.fill('#Password-Login', 'admin123');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(runFolder, 'step4-password.png') });

  // Step 5: Forgot password
  await page.click('text=Forgot password?');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(runFolder, 'step5-forgot-password.png') });

  // Step 6: Click Understood
  await page.click('text=Understood');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(runFolder, 'step6-understood.png') });

  // Step 7: Submit/Login
  await page.click('button[type=submit]');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(runFolder, 'step7-dashboard.png') });

  await browser.close();
});
