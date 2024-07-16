import { test, expect } from "@jest/globals";
import { normalizeURL } from "./crawl.js";

test("normalizeURL", () => {
  expect(normalizeURL("https://example.com/")).toBe("example.com/");
  expect(normalizeURL("https://EXAMPLE.com")).toBe("example.com/");
  expect(normalizeURL("http://example.com")).toBe("example.com/");
  expect(normalizeURL("http://example.com/a/")).toBe("example.com/a/");
  expect(normalizeURL("http://example.com/a/b")).toBe("example.com/a/b");
});
