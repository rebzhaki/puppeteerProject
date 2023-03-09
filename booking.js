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

  // Get the total number of pages
  const numPages = await page.evaluate(() => {
    const pages = document.querySelectorAll("div.eef2c3ca89 > ol > li");
    return pages.length;
  });

  console.log(`Scraping ${numPages} pages...`);

  const data = [];

  for (let i = 1; i <= numPages; i++) {
    let docs = await page.$$eval(
      ".a826ba81c4.fe821aea6c.fa2f36ad22.afd256fc79.d08f526e0d.ed11e24d01.ef9845d4b3.da89aeb942",
      (elements) =>
        elements.map((e) => ({
          // ratings: e.querySelectorAll(".e4755bbd60", (element) =>
          //   element.getAttribute("aria-label")
          // ),

          title: e.querySelector(".fcab3ed991.a23c043802").innerText,
          distanceFromCenter: e.querySelector(
            "div.a1fbd102d9 > span > span > span"
          ).innerText,
          distancefrombeach: e.querySelector(".a196e30dac").innerText,
          description: e.querySelector(".d8eab2cf7f").innerText,
          reviews: e.querySelector(".d8eab2cf7f:nth-child(2)").innerText,
        }))
    );
    data.push(docs);
    await page.click("div.eef2c3ca89 > ol > li");
  }

  fs.writeFile("bookings.json", JSON.stringify(data), (err) => {
    if (err) throw err;
    console.log("File Saved");
  });

  // await page.screenshot({ path: "results.png", fullPage: true });

  await browser.close();
})();
