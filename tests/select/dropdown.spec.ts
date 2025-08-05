import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';

test.describe("how to handle Select" , () => {
    
    let browser: Browser;
    let context: BrowserContext;
    let page: Page;

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

    test("Select a dropdown based on value", async () => {
        await page.waitForTimeout(3000);
        await page.locator('#ADUsername').fill('reena');
        await page.locator('#ADPassword').fill('reena123');
        const role = page.locator("#option-AdminCreate"); // Use locator instead of page.$
        await role.selectOption("Backend Developer");
    //     const msg = await page.locator("option-AdminCreate");
    //     await expect(msg).toBeVisible();  // Assert success
        await page.click('#createUser-AdminCreate');
        await page.click('#createUser-AdminCreate');
        const element = await page.$("#createUser-AdminCreate")
        await element?.click();
        await page.waitForTimeout(3000);
    });

    test("" , async () => {
         
    })

    test.afterAll(async () => {
        await browser.close();
    });
});
