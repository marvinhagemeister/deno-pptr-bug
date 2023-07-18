import * as pptr from "npm:puppeteer";
import * as pptrCore from "npm:puppeteer-core";
import * as puppeteerBrowsers from "npm:@puppeteer/browsers";
import * as fs from "node:fs";
import * as path from "node:path";
import * as denoPath from "https://deno.land/std@0.194.0/path/mod.ts";

(async () => {
  console.log(pptr.executablePath());

  const cacheDir = path.join(
    path.dirname(denoPath.fromFileUrl(import.meta.url)),
    "tmp",
  );
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
