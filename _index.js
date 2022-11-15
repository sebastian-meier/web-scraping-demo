const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config();

puppeteer
  .launch()
  .then(async (browser) => {
    const page = await browser.newPage();
    await page.setExtraHTTPHeaders({
      'scrape-agent': 'Hello my name is....',
    });

    const subPage = await browser.newPage();
    await page.goto(process.env.SCRAPE_URL, {waitUntil: 'networkidle2'});

    const base = "main>article>.grid.grid-children-narrow.layout-stack>div>ul>li";

    await page.waitForSelector(base);
    const groups = await page.$$(base);

    for (let gi = 0; gi < groups.length; gi += 1) {
      title = await groups[gi].$eval(
        'h2',
        (el) => el.textContent
      );
      console.log(title);

      const problems = await groups[gi].$$('ul>li');
      for (let pi = 0; pi < problems.length; pi += 1) {
        await subPage.goto();
      }
    }

    await page.close();
    await browser.close();
  });