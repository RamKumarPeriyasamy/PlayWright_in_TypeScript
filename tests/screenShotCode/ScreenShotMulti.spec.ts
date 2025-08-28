import { test, chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Aalai Home page Actions with multiple screenshots', async () => {
  // change this to 'light' or 'dark'
  const theme: 'light' | 'dark' = 'dark';

  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    colorScheme: theme,  //apply theme here
  });
  const page = await context.newPage();

  // make sure screenshots folder exists
  const folder = path.join(__dirname, `screenshots-${theme}`);
  if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder, { recursive: true });
  }

  // Step 1: Open Home Page
  await page.goto('http://185.100.212.76:9940/');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(folder, 'step1-home.png') });

  // Step 2: Click Login
  await page.click("text=Login");
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(folder, 'step2-login.png') });
  
  // Step 3: Fill username
  await page.fill('#Username-Login', 'admin');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(folder, 'step3-username.png') });
   
  // Step 4: Fill password
  await page.fill('#Password-Login', 'admin123');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(folder, 'step4-password.png') });
  
  // Step 5: Forgot password
  await page.click('text=Forgot password?');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(folder, 'step5-forgot-password.png') });

  // Step 6: Click Understood
  await page.click('text=Understood');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(folder, 'step6-understood.png') });

  // Step 7: Submit/Login
  await page.click('button[type=submit]');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(folder, 'step7-dashboard.png') });

  await browser.close();
});
