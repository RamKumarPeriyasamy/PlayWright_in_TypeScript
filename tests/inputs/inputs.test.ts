import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test';
import { asyncWrapProviders } from 'async_hooks';

let browser: Browser;
let context: BrowserContext;
let page: Page;

test.beforeAll(async () => {
  // Launch browser in non-headless mode for debugging
  browser = await chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();

  // Navigate to the login page
  await page.goto('http://185.100.212.76:9940/login');
});

test('Enter your full name', async () => {
  // === Different ways to fill the input field ===
  // 1. Easiest & most common:
  // await page.locator('#Username-Login').fill('Periyasamy');
  // 2. Alternative: using page.type() (types slower, simulates real typing)
  // await page.type("#Username-Login", "ramkumar P");
  // 3. Using element handle (safer if element may not exist)
  // const name = await page.$('#Username-Login');
  // if (name) await name.type("ramkumar p");
  // 4. If the element exists, type into it , Type only if element exists
    const name = await page.$('#Username-Login'); 
    await name?.type("Ramkumar P");
    await page.locator('#Password-Login').fill('Periyasamy123');
    await page.waitForTimeout(4000);
  });


//Append function wrightng     
test('Append a text and press keyboard tab', async () => {
  const join = await page.$("#Username-Login");
  await join?.focus();
  await page.keyboard.press("End");
  await join?.type("eriyasamy");
//   await page.keyboard.press("Tab"); // optional: move to next field
  await page.waitForTimeout(3000);
});

//inside value visiblity in teminal
test('what is inside the text box' , async () =>{
    const text = await page.getAttribute("#Username-Login","value");
    console.log(text); //this value returns works 
    await page.waitForTimeout(3000);
});

//clear all text from tex box 
test('clear the text' , async () => {
    await page.fill("#Username-Login" , "");
    await page.fill( "#Password-Login" , "")
    await page.waitForTimeout(3000);
})

test('clear all screen' , async ()=> {
 
  
})

 
test.afterAll(async () => {
  await page.close();
  await context.close();
  await browser.close();// Close the browser after all tests
});
