import { writeFileSync } from "fs";
import puppeteer from "puppeteer";
import { startFlow } from "lighthouse";

async function captureReport() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const flow = await startFlow(page, { name: "Squoosh snapshots" });

    const url = "https://squoosh.app/";
    await page.goto(url, { waitUntil: "networkidle0" });

    // Wait for first demo-image button, then open it.
    const demoImageSelector = 'ul[class*="demos"] button';
    await page.waitForSelector(demoImageSelector);
    await flow.snapshot({ stepName: "Page loaded" });
    await page.click(demoImageSelector);

    // Wait for advanced settings button in UI, then open them.
    const advancedSettingsSelector = 'form label[class*="option-reveal"]';
    await page.waitForSelector(advancedSettingsSelector);
    await flow.snapshot({ stepName: "Demo loaded" });
    await page.click(advancedSettingsSelector);

    await flow.snapshot({ stepName: "Advanced settings opened" });

    browser.close();

    const report = await flow.generateReport();
    const reportPath = "snapshot.html";
    writeFileSync(reportPath, report);
}

captureReport();
