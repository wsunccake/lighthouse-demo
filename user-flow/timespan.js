import { writeFileSync } from "fs";
import puppeteer from "puppeteer";
import { startFlow } from "lighthouse";

async function captureReport() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--remote-debugging-port=9222'],
    });

    const page = await browser.newPage();
    const flow = await startFlow(page, { name: 'Timespan' });
    const url = "https://example.com";

    await flow.startTimespan();

    await page.goto(url);
    await page.click("a");
    await page.waitForNetworkIdle(2000);

    await flow.endTimespan();
    await browser.close();

    const report = await flow.generateReport();
    const reportPath = "timespan.html";
    writeFileSync(reportPath, report);
};

captureReport();
