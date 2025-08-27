import { test, chromium } from '@playwright/test';

test('Aalai Home page Actions', async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://185.100.212.76:9940/');
  await page.waitForTimeout(3000);
  await page.click("text=Login");
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshot.png' });
  await browser.close();
});
