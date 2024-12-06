import { writeFileSync } from "fs";
// import open from "open";
import puppeteer from "puppeteer";
import { startFlow } from "lighthouse";

async function captureReport() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    const flow = await startFlow(page, { name: "Single Navigation" });
    const url = "https://web.dev/performance-scoring/";
    await flow.navigate(url);

    await browser.close();

    const report = await flow.generateReport();
    const reportPath = "navigation.html";
    writeFileSync(reportPath, report);
    // open(reportPath, { wait: false });
}

captureReport();
