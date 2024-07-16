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
    if (url.href?.startsWith("http")) {
      urls.push(url.href);
    } else {
      urls.push(baseURL + url.href);
    }
  }
  return urls;
}

async function crawl(baseURL) {
  try {
    const res = await fetch(baseURL);
    if (res.status >= 400) {
      throw new Error(`error fetching ${baseURL} ${res.status}`);
    }
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("text/html")) {
      throw new Error(`not an html page ${baseURL}`);
    }

    return res.text();
  } catch (error) {
    console.log(error.message);
  }
}

export async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
  if (isNotSameDomain(currentURL, baseURL)) {
    return pages;
  }
  const cleanedUrl = normalizeURL(currentURL);

  if (pages[cleanedUrl] > 0) {
    pages[cleanedUrl]++;
    return pages;
  }

  pages[cleanedUrl] = 1;

  console.log("fetching", currentURL);
  let html = "";
  try {
    html = await crawl(currentURL);
  } catch (error) {
    console.log(error.message);
    return pages;
  }

  const urls = getURLsFromHTML(html, baseURL);

  for (const url of urls) {
    pages = await crawlPage(baseURL, url, pages);
  }
  return pages;
}

function isNotSameDomain(url1, url2) {
  const url1Object = new URL(url1);
  const url2Object = new URL(url2);
  return url1Object.hostname !== url2Object.hostname;
}
