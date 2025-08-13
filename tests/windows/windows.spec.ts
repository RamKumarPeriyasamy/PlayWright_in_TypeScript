import { test, expect } from '@playwright/test';

test.describe("windows handling", () => {
    test("Home Page", async ({ page }) => {
        await page.goto("http://185.100.212.76:9940/login");
        const title = await page.title();
        console.log("Page title:", title);
        expect(title).toContain("Dashboard"); 
    });
});

test.describe("window Handeling" , () => {
    
});