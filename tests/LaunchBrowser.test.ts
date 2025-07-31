import { test, chromium } from '@playwright/test';

test('open Aalai Dashboard', async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto('http://185.100.212.76:9940/');
  await page.waitForTimeout(3000);
  await browser.close();
});
