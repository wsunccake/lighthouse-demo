import { writeFileSync } from "fs";
import puppeteer from "puppeteer";
import { startFlow, desktopConfig } from "lighthouse";

async function captureReport() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--remote-debugging-port=9222'],
    });

    const page = await browser.newPage();
    desktopConfig.settings.screenEmulation = {
        disabled: false,
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        mobile: false,
    };

    const flow = await startFlow(page, { name: 'Timespan', config: desktopConfig, });
    const url = "https://example.com";

    await flow.startTimespan();

    await page.goto(url);
    await page.click("a");
    await page.waitForNetworkIdle(2000);

    await flow.endTimespan();
    await browser.close();

    const report = await flow.generateReport();
    const reportPath = "timespan-desktop.html";
    writeFileSync(reportPath, report);
};

captureReport();
