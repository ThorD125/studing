const puppeteer = require('puppeteer');

async function run() {
    // Launch a headless browser
    const browser = await puppeteer.launch();

    // Open a new page
    const page = await browser.newPage();

    // Navigate to the specified page
    await page.goto('https://www.example.com');

    // Take a screenshot
    await page.screenshot({ path: 'screenshot.png' });

    // Close the browser
    await browser.close();
}

run();
