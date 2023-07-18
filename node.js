const pptr = require("puppeteer");
const pptrCore = require("puppeteer-core");
const puppeteerBrowsers = require("@puppeteer/browsers");
const fs = require("fs");
const path = require("path");
const { default: puppeteer } = require("puppeteer");

(async () => {
  console.log(pptr.executablePath());

  const cacheDir = path.join(__dirname, "tmp");
  try {
    fs.rmdirSync(cacheDir);
  } catch (err) {}
  fs.mkdirSync(cacheDir, { recursive: true });

  const install = await puppeteerBrowsers.install({
    cacheDir,
    browser: puppeteerBrowsers.Browser.CHROME,
    buildId: pptrCore.PUPPETEER_REVISIONS.chrome,
  });

  const executablePath = puppeteerBrowsers.computeExecutablePath({
    browser: install.browser,
    buildId: install.buildId,
    cacheDir,
  });

  const browser = await pptr.launch({ executablePath, headless: "new" });
  const page = await browser.newPage();
  await page.goto("https://example.com");
  await page.screenshot({ path: "example.png" });
  await browser.close();
})();
