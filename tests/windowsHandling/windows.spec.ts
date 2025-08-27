import { test, expect } from '@playwright/test';

test.describe("windows handling", () => {
  test("Home Page", async ({ page }) => {
    await page.goto("http://185.100.212.76:9940/login");
    const title = await page.title();
    console.log("Page title:", title);
    expect(title).toContain("Dashboard");
  });
});

test.describe("window handling", () => {
  test("Handle new window", async ({ page, context }) => {
    await page.goto("http://185.100.212.76:9940/login");

    // wait for new window after clicking
    const [newWindow] = await Promise.all([
      context.waitForEvent("page"),
      page.click("#home") // replace #home with your actual selector
    ]);

    // wait until the new window loads
    await newWindow.waitForLoadState();

    // verify new window URL
    expect(newWindow.url()).toContain("test");

    // (optional) verify title too
    const newTitle = await newWindow.title();
    console.log("New window title:", newTitle);
  });
});


// import { Browser, BrowserContext, Page, chromium } from "playwright";

// describe("Window handling", () => {

//     let browser: Browser;
//     let context: BrowserContext;
//     let page: Page;
//     beforeAll(async () => {
//         browser = await chromium.launch({
//             headless: false
//         });
//         context = await browser.newContext()
//         page = await context.newPage();
//         await page.goto("https://letcode.in/windows")
//     })

//     test("Home Page", async () => {
//         console.log(await page.title());
//         expect(await page.title()).toBe("Window handling - LetCode");
//     })

//     xtest("Single page handling", async () => {
//         const [newWindow] = await Promise.all([
//             context.waitForEvent("page"),
//             await page.click("#home")
//         ])
//         await newWindow.waitForLoadState();
//         expect(newWindow.url()).toContain("test");
//         await newWindow.click('"Log in"');
//         await newWindow.waitForNavigation();
//         expect(newWindow.url()).toContain("signin");
//         // await newWindow.close();
//         await page.bringToFront();
//         await page.click('"LetXPath"');
//     })
//     test("Multipage handling", async () => {
//         const [multipage] = await Promise.all([
//             context.waitForEvent("page"),
//             await page.click("#multi")
//         ])
//         await multipage.waitForLoadState();
//         const allwindows = page.context().pages();
//         console.log("no.of windows: " + allwindows.length);
//         allwindows.forEach(page => {
//             console.log(page.url());
//         });
//         await allwindows[1].bringToFront();
//         allwindows[1].on("dialog", (dialog) => {
//             console.log('Message: ' + dialog.message());
//             dialog.accept();
//         })
//         await allwindows[1].click("id=accept")

//     })
//     afterAll(async () => {
//         await page.close()
//         await context.close()
//         await browser.close()
//     })
// })

// import { test, expect } from '@playwright/test';

// test.describe("Windows Handling", () => {

//   test("Handle multiple windows/tabs", async ({ page, context }) => {
//     // Go to the main page
//     await page.goto("http://185.100.212.76:9940/login");

//     // Suppose clicking a link opens a new window
//     const [newPage] = await Promise.all([
//       context.waitForEvent('page'), // listen for new page event
//       page.click('a[target="_blank"]') // example selector that opens a new window
//     ]);

//     // Wait until the new page is loaded
//     await newPage.waitForLoadState();

//     // Get title of the new window
//     const newPageTitle = await newPage.title();
//     console.log("New window title:", newPageTitle);

//     // Assertion for the new window
//     expect(newPageTitle).toContain("ExpectedTitle");

//     // Go back to original page and continue
//     const originalTitle = await page.title();
//     console.log("Original window title:", originalTitle);
//     expect(originalTitle).toContain("Dashboard");
//   });

// });
