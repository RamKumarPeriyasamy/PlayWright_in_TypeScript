import { test, chromium } from '@playwright/test';

test('Run 3D App in Dark Mode & Light Mode', async () => {
  const browser = await chromium.launch({ headless: false });

  // Dark Mode
  const darkContext = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    colorScheme: 'dark'  
  });
  const darkPage = await darkContext.newPage();
  await darkPage.goto('http://185.100.212.76:8400/');
  await darkPage.screenshot({ path: 'dark-mode.png' });
  await darkPage.waitForTimeout(3000);
  await darkContext.close();

  // Light Mode
  const lightContext = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    colorScheme: 'light'  
  });
  const lightPage = await lightContext.newPage();
  await lightPage.goto('http://185.100.212.76:8400/');
  await lightPage.screenshot({ path: 'light-mode.png' });
  await lightPage.waitForTimeout(3000);
  await lightContext.close();
 
  await browser.close();
});
