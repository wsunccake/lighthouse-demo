import puppeteer from 'puppeteer';
import { startFlow, desktopConfig } from 'lighthouse';
import { writeFileSync } from 'fs';

async function captureReport() {
    const browser = await puppeteer.launch({
        headless: false,
        args: ['--remote-debugging-port=9222', '--window-size=1920,1080'],
    });
    const page = await browser.newPage();
    desktopConfig.settings.screenEmulation = {
        disabled: false,
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1,
        mobile: false,
    };

    const flow = await startFlow(page, { config: desktopConfig, });
    const url = 'https://web.dev/';

    // Phase 1 - Navigate
    await flow.navigate(url, { stepName: 'navigate' });
    // await page.waitForNetworkIdle(5000);

    // Phase 2 - Interact
    await flow.startTimespan({ stepName: 'interact' });

    await page.click('button[search-open]', { delay: 100 });
    const searchBox = await page.waitForSelector('devsite-search[search-active] input');
    await searchBox.type('CLS');
    await searchBox.press('Enter');
    const link = await page.waitForSelector('devsite-content a[href="https://web.dev/articles/cls"]');

    await flow.endTimespan();

    // Phase 3 - Analyze
    await flow.snapshot({ name: 'snapshot' });

    // Phase 4 - Navigate
    await flow.navigate(async () => {
        await link.click();
    });

    await browser.close();

    const reportPath = "user-flow";
    writeFileSync(`${reportPath}.html`, await flow.generateReport());
    writeFileSync(`${reportPath}.json`, JSON.stringify(await flow.createFlowResult(), null, 2));
};

captureReport();
