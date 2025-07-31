import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';
import usersToCreate from '../data/usersToCreate.json';
import usersToDelete from '../data/userToDelete.json';

let browser: Browser;
let context: BrowserContext;
let page: Page;

test.describe.serial('User Management Flow', () => {

  // ---------- Setup & Teardown ----------
  test.beforeAll(async () => {
    browser = await chromium.launch({ headless: false, args: ['--start-maximized'] });
    context = await browser.newContext({ viewport: null });
    page = await context.newPage();

    // Login once
    await page.goto('http://185.100.212.76:9940/login');
    await page.locator('#Username-Login').fill('admin');
    await page.locator('#Password-Login').fill('admin1234');
    await page.click('#submit-Login');
    await expect(page).toHaveURL(/admin/);
    await page.goto('http://185.100.212.76:9940/admin');
    await page.waitForLoadState('networkidle');
  });

  test.afterAll(async () => {
    await browser.close();
  });

  // ---------- Helper: Dialog Handling ----------
  const setupDialogHandler = (label: string) => {
    page.on('dialog', async dialog => {
      console.log(`${label} Dialog: ${dialog.message()}`);
      try {
        await dialog.accept();
      } catch {
        console.log(`⚠️ Dialog already handled: ${dialog.message()}`);
      }
    });
  };

  // ---------- CREATE USERS ----------
  test('Create multiple users from JSON', async () => {
    test.setTimeout(10000 + usersToCreate.length * 10000);
    setupDialogHandler('Creation');

    for (const [index, user] of usersToCreate.entries()) {
      console.log(`Creating user ${index + 1}/${usersToCreate.length}: ${user.username}`);

      await page.locator('#Username-AdminCreate').clear();
      await page.locator('#Password-AdminCreate').clear();
      await page.locator('#Username-AdminCreate').fill(user.username);
      await page.locator('#Password-AdminCreate').fill(user.password);

      const [response] = await Promise.all([
        page.waitForResponse(res => res.url().includes('/users') && res.status() === 200, { timeout: 5000 }).catch(() => null),
        page.click('#createUser-AdminCreate')
      ]);

      const rowLocator = page.locator(`tr:has(td:has-text("${user.username}"))`);
      const isCreated = await rowLocator.waitFor({ state: 'attached', timeout: 7000 }).then(() => true).catch(() => false);

      if (isCreated) {
        console.log(`✅ Created user: ${user.username}`);
      } else {
        console.log(`❌ FAILED to create: ${user.username}`);
        if (response) console.log(`API Response: ${await response.text()}`);
        await page.screenshot({ path: `screenshots/create-fail-${user.username}.png` });
      }

      await page.waitForTimeout(1000);
    }
  });

  // ---------- DELETE USERS ----------
  test('Delete multiple users from JSON', async () => {
    test.setTimeout(10000 + usersToDelete.length * 7000);
    await page.goto('http://185.100.212.76:9940/admin');
    await page.waitForLoadState('networkidle');
    setupDialogHandler('Deletion');

    for (const [index, user] of usersToDelete.entries()) {
      console.log(`Deleting user ${index + 1}/${usersToDelete.length}: ${user.username}`);

      const rowLocator = page.locator('tr', { has: page.locator(`td:has-text("${user.username}")`) });

      if (!(await rowLocator.count())) {
        console.log(`⚠️ ${user.username} not found. Skipping.`);
        continue;
      }

      await rowLocator.locator('button:has-text("Delete")').first().click();

      const isDeleted = await page.locator('tr', { has: page.locator(`td:has-text("${user.username}")`) })
        .waitFor({ state: 'detached', timeout: 7000 })
        .then(() => true)
        .catch(() => false);

      if (isDeleted) {
        console.log(`🗑️ Deleted user: ${user.username}`);
      } else {
        console.log(`❌ FAILED to delete: ${user.username}`);
        try {
          await page.screenshot({ path: `screenshots/delete-fail-${user.username}.png` });
        } catch {
          console.log('⚠️ Could not take screenshot (page closed).');
        }
      }

      await page.waitForTimeout(500);
    }
  });

});
