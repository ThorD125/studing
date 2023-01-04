const puppeteer = require('puppeteer');

async function run() {
    // Launch a headless browser
    const browser = await puppeteer.launch();

    // Open a new page
    const page = await browser.newPage();

    // Set up a request interception
    await page.setRequestInterception(true);
    page.on('request', request => {
        // Generate a random background color
        const bgColor = '#' + Math.floor(Math.random() * 16777215).toString(16);

        // Modify the response of the page by adding a custom header and a style element
        request.respond({
            headers: {
                'x-custom-header': 'my value'
            },
            body: `
        <html>
          <head>
            <style>
              body {
                background-color: ${bgColor};
              }
            </style>
          </head>
          <body>
            ${request.response().body()}
          </body>
        </html>
      `
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
