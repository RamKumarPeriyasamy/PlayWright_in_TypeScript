import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';
import usersToCreate from '../data/usersToCreate2.json';

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

  // ---------- Helper: Delete User Function ----------
  const deleteUser = async (role: string, username: string): Promise<boolean> => {
    console.log(`Attempting to delete: ${username} from ${role}`);
    const section = page.locator(`h3:text("${role}")`).locator('..');
    const row = section.locator('tr', { 
      has: page.locator('td').filter({ hasText: new RegExp(`^${username}$`, 'i') }) 
    });

    if (await row.count() === 0) {
      console.log(`⚠️ Skipping: ${username} not found in ${role}`);
      return false;
    }

    // Handle confirmation dialog safely
    page.once('dialog', async dialog => {
      console.log('Delete confirmation:', dialog.message());
      try {
        await dialog.accept();
      } catch {
        console.log('⚠️ Dialog already handled, skipping.');
      }
    });

    // Click the correct Delete button
    await row.locator('button:has-text("Delete")').first().click();

    // Wait for API call (optional)
    await page.waitForResponse(res => res.url().includes('/users') && res.status() === 200, { timeout: 7000 }).catch(() => null);

    // Small wait before reload
    await page.waitForTimeout(500);
    await page.reload();
    await page.waitForLoadState('networkidle');

    // Verify user is gone
    const stillThere = await section.locator('tr', { has: page.locator('td').filter({ hasText: new RegExp(`^${username}$`, 'i') }) }).count();
    return stillThere === 0;
  };

  // ---------- CREATE USERS ----------
  test('Create multiple users from JSON', async () => {
    test.setTimeout(10000 + usersToCreate.length * 10000);

    for (const [index, user] of usersToCreate.entries()) {
      console.log(`Creating user ${index + 1}/${usersToCreate.length}: ${user.username}`);

      // Check if user already exists in that role section
      const section = page.locator(`h3:text("${user.role}")`).locator('..');
      const existingRow = section.locator('tr', { 
        has: page.locator('td').filter({ hasText: new RegExp(`^${user.username}$`, 'i') }) 
      });

      if (await existingRow.count() > 0) {
        console.log(`⚠️ Skipping: ${user.username} already exists in ${user.role}`);
        continue; // Skip this user
      }

     await page.locator('#ADUsername').fill('');
      await page.locator('#ADPassword').fill('');
      await page.locator('#ADUsername').fill(user.username);
      await page.locator('#ADPassword').fill(user.password);


      // Select role
      const roleDropdown = page.locator('#option-AdminCreate');
      await roleDropdown.selectOption({ label: user.role });

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

      await page.waitForTimeout(500);
    }
  });

  // ---------- DELETE USERS ----------
  test('Delete multiple users from JSON', async () => {
    test.setTimeout(10000 + usersToCreate.length * 7000);
    await page.goto('http://185.100.212.76:9940/admin');
    await page.waitForLoadState('networkidle');

    for (const [index, user] of usersToCreate.entries()) {
      console.log(`Deleting user ${index + 1}/${usersToCreate.length}: ${user.username}`);
      const isDeleted = await deleteUser(user.role, user.username);

      if (isDeleted) {
        console.log(`🗑️ Deleted user: ${user.username}`);
      } else {
        console.log(`⚠️ Skipped or failed to delete: ${user.username}`);
        try {
          await page.screenshot({ path: `screenshots/delete-fail-${user.username}.png` });
        } catch {
          console.log('⚠️ Could not take screenshot (page closed).');
        }
      }

      await page.waitForTimeout(300);
    }
  });

});
