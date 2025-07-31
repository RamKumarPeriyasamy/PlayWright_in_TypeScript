import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';

let browser: Browser;
let context: BrowserContext;
let page: Page;

test.beforeAll(async () => {
  // Launch browser in non-headless mode for debugging
  browser = await chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();
  await page.goto('http://185.100.212.76:9940/login');
});

 test('Login with valid credentials should succeed', async () => {
  await page.locator('#Username-Login').fill('admin');
  await page.locator('#Password-Login').fill('admin123');
  await page.click('#submit-Login');
  const errorMessage = page.locator('text="Invalid credentials"');
  const errorAppears = await errorMessage.isVisible({ timeout: 5000 }).catch(() => false);
  if (errorAppears) {
    const errorMsg = await errorMessage.textContent();
    throw new Error(`Login failed: ${errorMsg}`);
  }
  await expect(page).toHaveURL(/admin/); 
});

 test('dialog implementation' , async () => {
  //Create New User
  await page.waitForTimeout(3000);
  await page.locator('#Username-AdminCreate').fill('reena');
  await page.locator('#Password-AdminCreate').fill('reena123');
  await page.click('#createUser-AdminCreate');
  const element = await page.$("#createUser-AdminCreate")
  await element?.click();
  await page.waitForTimeout(3000);

  await page.waitForTimeout(3000);
  await page.locator('#Username-AdminCreate').fill('rahul');
  await page.locator('#Password-AdminCreate').fill('reena123');
  await page.click('#createUser-AdminCreate');
  const element2 = await page.$("#createUser-AdminCreate")
  await element2?.click();
  await page.waitForTimeout(3000);

  //Change Admin Password
  await page.locator('#oldPassword-Admin').fill('admin123');
  await page.locator('#newPassword-Admin').fill('admin1234');
  await page.click('#ChangePassword-Admin');
  const elementpass = await page.$("#ChangePassword-Admin");
  await elementpass?.click();
  await page.waitForTimeout(3000);

  //Delete Function 
   page.once('dialog', async dialog => {
    console.log(`Dialog message: ${dialog.message()}`);
    await dialog.accept(); // Use dismiss() for cancel
  });
  const row = page.locator('tr', { has: page.locator('td', { hasText: 'reena' }) })
                   .filter({ has: page.locator('td', { hasText: 'developer' }) });
  await row.locator('button:has-text("Delete")').click();
  await page.waitForTimeout(2000); 
 })

 test('sample for type dialog component' , async () => {
     
 }) 
