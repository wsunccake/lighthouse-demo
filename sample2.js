import puppeteer from "puppeteer";
import lighthouse from "lighthouse";
import { writeFileSync } from "fs";

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--remote-debugging-port=9222"],
    });

    try {
        const options = {
            logLevel: "info",
            output: "html",
            port: 9222,
            formFactor: "desktop",
            screenEmulation: {
                disabled: false,
                width: 1920,
                height: 1080,
                deviceScaleFactor: 1,
                mobile: false,
            },
        };

        const url = "https://www.google.com";
        const runnerResult = await lighthouse(url, options);

        console.log("Report is done for", runnerResult.lhr.finalUrl);
        console.log(
            "Performance score was",
            runnerResult.lhr.categories.performance.score * 100
        );

        console.log("Lighthouse Scores:");
        for (const [category, data] of Object.entries(
            runnerResult.lhr.categories
        )) {
            console.log(`${category.toUpperCase()}: ${data.score * 100}`);
        }

        const reportPath = "sample2";
        writeFileSync(`${reportPath}.html`, runnerResult.report, "utf-8");
        const jsonReport = JSON.stringify(runnerResult.lhr, null, 2);
        writeFileSync(`${reportPath}.json`, jsonReport, "utf-8");

        console.log(`Reports saved as ${reportPath}.html and ${reportPath}.json`);
    } catch (error) {
        console.error("Error running Lighthouse:", error);
    } finally {
        await browser.close();
    }
})();
