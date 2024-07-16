export function normalizeURL(url) {
  const urlObject = new URL(url);
  return urlObject.hostname + urlObject.pathname;
}
