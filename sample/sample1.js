import { launch } from "chrome-launcher";
import lighthouse from "lighthouse";
import { writeFileSync } from "fs";

(async () => {
  const chrome = await launch({ chromeFlags: ["--headless"] });
  const options = { logLevel: "info", output: "html", port: chrome.port };
  const runnerResult = await lighthouse("https://www.google.com", options);

  console.log("Report is done for", runnerResult.lhr.finalUrl);
  console.log(
    "Performance score was",
    runnerResult.lhr.categories.performance.score * 100
  );

  const reportPath = "sample1";
  writeFileSync(`${reportPath}.html`, runnerResult.report, "utf-8");
  const jsonReport = JSON.stringify(runnerResult.lhr, null, 2);
  writeFileSync(`${reportPath}.json`, jsonReport, "utf-8");
  console.log("Reports saved as report.html and report.json");

  await chrome.kill();
})();
