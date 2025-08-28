import { test, chromium , expect } from '@playwright/test';

test('Aalai Admin Dashboard Action', async () => {
  test.setTimeout(120000);
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
  await page.goto('http://185.100.212.76:8400/');
  await page.waitForTimeout(1000);
  await page.fill('input[placeholder="Email"]' , 'ramkumar@testui.com' );
  await page.waitForTimeout(1000);
  await page.fill('input[placeholder="Password"]', '123456');
  await page.waitForTimeout(1000);
  await page.click("#toogle-password")
  await page.waitForTimeout(1000);
  await page.click("#form-submit");
  await page.waitForTimeout(3000);
  await page.click('text=Roof Visibility')
  await page.waitForTimeout(1000);
  await page.click('text=Wall Visibility')
  await page.waitForTimeout(2000);
  await page.mouse.move(600, 400);
  await page.mouse.wheel(0, -500);
  await page.waitForTimeout(2000) 
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(4000) 
  await page.click('#label-button')
  await page.waitForTimeout(2000);
  const numberInputs = page.locator('input[type="number"]');
  await numberInputs.first().fill("33");
  await numberInputs.first().press("Enter");
  await page.waitForTimeout(1000);
  await numberInputs.first().fill("63");
  await numberInputs.first().press("Enter");
  await page.waitForTimeout(1000);
  await numberInputs.first().fill("48");
  await numberInputs.first().press("Enter");
  await page.waitForTimeout(2000);
  

  //DashBoard
  await page.click("button[title='Back to Dashboard']");
  await page.waitForTimeout(3000);
  await page.click("text=+ New project");
  await page.waitForTimeout(2000);

  await page.getByRole('button', { name: 'Untitled' }).dblclick();
  const renameInput = page.locator('input.rename-input');
  await renameInput.fill('ramkumar');
  await page.waitForTimeout(1000);
  await renameInput.press('Enter');
  await page.waitForTimeout(2000);

  await page.click("text=Assets");
  await page.waitForTimeout(2000);
  const menus = ["Fenestration", "Vehicles", "Vehicles", "Workstation", "Workers"];

  for (const menu of menus) {
    await page.click(`text=${menu}`);
    await page.waitForTimeout(2000);
    await page.click("#asset-backButtom");
    await page.waitForTimeout(2000);
}


});