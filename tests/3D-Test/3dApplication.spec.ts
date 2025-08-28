import { test, chromium } from '@playwright/test';

test('Automate Three.js scene with OrbitControls', async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  // Go to your 3D app
  await page.goto('http://185.100.212.76:8400/'); 

  // Login
  await page.fill('//input[@type="email"]', 'ramkumar@testui.com');
  await page.fill('input[placeholder="Password"]', '123456');
  await page.click('#form-submit');
  await page.waitForTimeout(4000);

  // Wait for canvas (Three.js app should be ready)
  const canvas = page.locator('canvas');
  await canvas.waitFor({ state: 'visible' });
  await page.waitForTimeout(4000)
  // ---- Orbit controls simulation (drag rotation) ----
  await page.mouse.move(400, 300);
  await page.mouse.down();
  await page.waitForTimeout(4000)
  await page.mouse.move(700, 350, { steps: 20 }); // smooth drag
  await page.mouse.up();
  await page.waitForTimeout(4000)

  // ---- Zoom simulation (scroll on canvas) ----
  await page.mouse.move(600, 400);
  await page.mouse.wheel(0, -500);
  await page.waitForTimeout(4000) // zoom in
  await page.waitForTimeout(1000);
  await page.mouse.wheel(0, 500);
  await page.waitForTimeout(4000)  // zoom out

  // ---- Take screenshot ----
  await page.screenshot({ path: 'threejs-automation.png' });

  await browser.close();
});

