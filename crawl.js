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
