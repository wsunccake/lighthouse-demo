import puppeteer from 'puppeteer';
import { startFlow } from 'lighthouse';
import { writeFileSync } from 'fs';

async function captureReport() {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--remote-debugging-port=9222'],
    });
    const page = await browser.newPage();
    const flow = await startFlow(page);
    const url = 'https://web.dev/';

    // Phase 1 - Navigate to the landing page
    await flow.navigate(url, { name: `navigate (${page.url()})` });

    // Phase 2 - Interact with the page
    await flow.startTimespan({ name: `interact (${page.url()})` });

    await page.click('button[search-open]');
    const searchBox = await page.waitForSelector('devsite-search[search-active] input');
    await searchBox.type('CLS');
    await searchBox.press('Enter');
    const link = await page.waitForSelector('devsite-content a[href="https://web.dev/articles/cls"]');

    await flow.endTimespan();

    // Phase 3 - Analyze the new state.
    await flow.snapshot({ name: `snapshot (${page.url()})` });

    // Phase 4 - Navigate to the article.
    await flow.navigate(async () => {
        await link.click();
    });

    await browser.close();

    const reportPath = "user-flow";
    writeFileSync(`${reportPath}.html`, await flow.generateReport());
    writeFileSync(`${reportPath}.json`, JSON.stringify(await flow.createFlowResult(), null, 2));
};

captureReport();
