import { test, chromium, expect } from '@playwright/test';
import path from 'path';

const filepath1 = path.resolve('./videos/hello1.webm'); // use correct path resolution

test('File Upload Function', async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    recordVideo: {
      dir: './videos/fileupload/',
      size: { width: 1280, height: 720 },
    },
  });

  const page = await context.newPage();
  await page.goto('https://www.sendgb.com/');
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(filepath1);
  await expect(page.locator('text=hello1.webm')).toBeVisible();
  
  // Optional: click upload or send button if needed
  // await page.getByRole('button', { name: 'Send' }).click();

  // Optional: wait for upload completion
  // await expect(page.locator('text=Upload complete')).toBeVisible();

  // Close browser (optional)
  await browser.close();
});
