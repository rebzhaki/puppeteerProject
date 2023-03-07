import puppeteer from "puppeteer";
import fs from "fs";

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Configure the navigation timeout
  await page.setDefaultNavigationTimeout(0);
  // await page.goto("https://www.booking.com/index.en-gb.html");
  // const searchData = await page.$(".ce45093752");
  // await searchData.type("Malindi Beach, Kenya");

  // await page.screenshot({ path: "search.png", fullPage: true });
  // await searchData.press("Enter");

  // await page.screenshot({ path: "clicked.png", fullPage: true });
  // await page.waitForNavigation({ delay: 100000 });

  // await page.waitForSelector(".efdb2b543b", {
  //   waitUntil: "load",
  //   timeout: 0,
  // });

  await page.goto("https://www.booking.com/searchresults.html?ss=diani");

  await page.setViewport({ width: 1080, height: 1024 });

  await page.setJavaScriptEnabled(true);

  await page.screenshot({ path: "results1.png", fullPage: true });
  const docs = await page.$$eval(
    ".a826ba81c4.fe821aea6c.fa2f36ad22.afd256fc79.d08f526e0d.ed11e24d01.ef9845d4b3.da89aeb942",
    (elements) =>
      elements.map((e) => ({
        title: e.querySelector(".fcab3ed991.a23c043802").innerText,
        distancefrombeach: e.querySelector(".a196e30dac").innerText,
        description: e.querySelector(".d8eab2cf7f").innerText,
      }))
  );

  // console.log("docs", docs);
  fs.writeFile("newbookings.json", JSON.stringify(docs), (err) => {
    if (err) throw err;
    console.log("File Saved");
  });

  await page.screenshot({ path: "results.png", fullPage: true });

  await browser.close();
})();
