import { test, chromium , expect } from '@playwright/test';

test('Aalai Admin Dashboard Action', async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    recordVideo: {
      dir: "./videos/",
      size:{
         width: 1280,
         height: 720
      }
    }
  });
  const page = await context.newPage();

  await page.goto('http://185.100.212.76:9940/');
  await page.waitForTimeout(2000)
  await page.click("text=Login");
  await page.fill("input[name='username']", 'admin');
  await page.waitForTimeout(2000);
  await page.fill("input[name='password']", 'admin123');
  await page.click("text=Access Portal");
  await page.waitForTimeout(4000);
  await page.getByPlaceholder('Username').fill('ram');
  await page.getByPlaceholder('Password').nth(0).fill('ramkumarp123');
  await page.selectOption('select', 'engineer');
  await page.waitForTimeout(2000);
  await page.click("text=Create User");//create 
  await page.waitForTimeout(3000);
  // Find the row containing 'enguser'
  const userRow = page.locator('tr', { hasText: 'ram4g' });
  await expect(userRow).toBeVisible();
  await browser.close();
}); 


//video
//video size pre-define
//visibility Check