import { JSDOM } from "jsdom";

function normalizeURL(url) {
  const urlObject = new URL(url);
  return urlObject.hostname + urlObject.pathname;
}

function getURLsFromHTML(htmlBody, baseURL) {
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

async function crawlPage(baseURL) {
  try {
    fetch(baseURL).then(async (res) => {
      if (res.status >= 400) {
        console.error("error fetching", baseURL, res.status);
        return;
      }
      if (!res.headers.get("content-type").includes("text/html")) {
        console.log("not an html page", baseURL);
        return;
      }
      console.log("fetching", baseURL);
      console.log(await res.text());
    });
  } catch (error) {
    console.error(error);
  }
}
