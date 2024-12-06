import { writeFileSync } from "fs";
import puppeteer from "puppeteer";
import { startFlow, desktopConfig } from "lighthouse";

async function captureReport() {
    const browser = await puppeteer.launch({
        headless: false,
        args: ["--remote-debugging-port=9222"],
    });

    const page = await browser.newPage();
    desktopConfig.settings.screenEmulation = {
        disabled: false,
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        mobile: false,
    };

    const flow = await startFlow(page, {
        name: "Squoosh snapshots",
        config: desktopConfig,
    });

    const url = "https://squoosh.app/";
    await page.goto(url, { waitUntil: "networkidle0" });

    const demoImageSelector = 'ul[class*="demos"] button';
    await page.waitForSelector(demoImageSelector);
    await flow.snapshot({ stepName: "Page loaded" });
    await page.click(demoImageSelector);

    const advancedSettingsSelector = 'form label[class*="option-reveal"]';
    await page.waitForSelector(advancedSettingsSelector);
    await flow.snapshot({ stepName: "Demo loaded" });
    await page.click(advancedSettingsSelector);

    await flow.snapshot({ stepName: "Advanced settings opened" });

    browser.close();

    const report = await flow.generateReport();
    const reportPath = "snapshot-desktop.html";
    writeFileSync(reportPath, report);
}

captureReport();
