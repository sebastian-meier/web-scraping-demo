const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config();

if (!fs.existsSync('./data')) {
  fs.mkdirSync('./data');
}

puppeteer
  .launch()
  .then(async (browser) => {
    const page = await browser.newPage();
    await page.goto(process.env.SCRAPE_URL, {waitUntil: 'networkidle2'});
    
    const disruptions = {};

    const base = "main>article>.grid.grid-children-narrow.layout-stack>div>ul>li";
    await page.waitForSelector(base);

    const groups = await page.$$(base);

    for (let gi = 0; gi < groups.length; gi += 1) {
      title = await groups[gi].$eval(
        'h2',
        (el) => el.textContent
      );

      const problems = await groups[gi].$$('ul>li');
      
      disruptions[title] = problems.length;
    }

    const d = new Date();
    fs.writeFileSync(
      `./data/${d.getFullYear()}-${d.getMonth()}-${d.getDate()}.json`,
      JSON.stringify(disruptions),
      'utf-8'
    );

    await page.close();
    await browser.close();

  });
