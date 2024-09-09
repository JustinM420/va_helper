const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function findAllUrlsOnPath(baseURL, targetPath) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`${baseURL}${targetPath}`);

  // Extract all href attributes from anchor tags
  const urls = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a'));
    return anchors.map(anchor => anchor.href);
  });

  console.log("Extracted URLs:", urls); // Log extracted URLs

  // Filter URLs that are within the specified path
  const filteredUrls = urls.filter(url => url.startsWith(baseURL));

  console.log("Filtered URLs:", filteredUrls); // Log filtered URLs

  await browser.close();
  return filteredUrls;
}

async function saveUrlsToFile(urls, filename) {
  const filePath = path.join(__dirname, '../public', filename);
  if (urls.length > 0) {
    fs.writeFileSync(filePath, urls.join('\n'));
    console.log(`URLs saved to ${filePath}`);
  } else {
    console.log("No URLs to save.");
  }
}

// Example usage
const baseURL = 'https://www.knowva.ebenefits.va.gov'; // Corrected the base URL by removing the trailing slash
const targetPath = '/'; // Replace with the path you want to crawl
const filename = 'urls.txt'; // The name of the file to save the URLs to

findAllUrlsOnPath(baseURL, targetPath)
  .then(urls => saveUrlsToFile(urls, filename))
  .catch(err => console.error(err));
