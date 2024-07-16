import { JSDOM } from "jsdom";

export function normalizeURL(url) {
  const urlObject = new URL(url);
  return urlObject.hostname + urlObject.pathname;
}

export function getURLsFromHTML(htmlBody, baseURL) {
  const dom = new JSDOM(htmlBody);
  const allUrls = dom.window.document.querySelectorAll("a");
  const urls = [];
  for (const url of allUrls) {
    if (url.href.startsWith("http")) {
      urls.push(url.href);
    } else {
      urls.push(baseURL + url.href);
    }
  }
  return urls;
}

async function crawl(baseURL) {
  try {
    fetch(baseURL).then(async (res) => {
      if (res.status >= 400) {
        throw new Error(`error fetching ${baseURL} ${res.status}`);
      }
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("text/html")) {
        throw new Error(`not an html page ${baseURL}`);
      }
      console.log("fetching", baseURL);
      return res.text();
    });
  } catch (error) {
    console.log(error.message);
  }
}

export async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
  if (!isSameDomain(baseURL, currentURL)) {
    return pages;
  }
  const cleanedUrl = normalizeURL(baseURL);
  if (pages[cleanedUrl]) {
    pages[cleanedUrl]++;
    return pages;
  } else {
    pages[cleanedUrl] = 1;
  }

  let html = "";
  try {
    html = await crawl(baseURL);
  } catch (error) {
    console.log(error.message);
  }

  const urls = getURLsFromHTML(html, baseURL);
  for (const url of urls) {
    pages = await crawlPage(baseURL, url, pages);
  }
  return pages;
}

function isSameDomain(url1, url2) {
  const url1Object = new URL(url1);
  const url2Object = new URL(url2);
  return url1Object.hostname === url2Object.hostname;
}
