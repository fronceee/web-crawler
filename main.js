import { crawlPage } from "./crawl.js";

async function main() {
  if (process.argv.length < 3) {
    console.log("no url provided");
  } else if (process.argv.length > 3) {
    console.log("too many arguments");
  } else {
    const url = process.argv[2];
    console.log("starting crawl for", url);
    const crawlPages = await crawlPage(url);
    console.log("crawl complete", crawlPages);
  }
}
main();
