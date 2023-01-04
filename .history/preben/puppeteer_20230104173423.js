const puppeteer = require('puppeteer');

async function run() {
    // Launch a headless browser
    const browser = await puppeteer.launch();

    // Open a new page
    const page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', request => {
        // Modify the response of the page by adding a custom header and a style element
        request.respond({
            headers: {
                'x-custom-header': 'my value'
            },
        });
    });
    // Navigate to the specified page
    await page.goto('https://preben.net/mockexam/challenge5.php');

    // Take a screenshot
    await page.screenshot({ path: 'screenshot.png' });

    // Close the browser
    await browser.close();
}

run();
