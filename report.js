export function printReport(pages) {
  const sortedPages = sortPages(pages);
  for (const [url, count] of sortedPages) {
    console.log(`found ${count} links on ${url}`);
  }
}

function sortPages(pages) {
  return Object.entries(pages).sort((a, b) => b[1] - a[1]);
}
