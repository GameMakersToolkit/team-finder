import { describe, expect, it } from "vitest";
import { sanitizeHtmlToPlainText } from "../../src/common/utils/sanitizeHtml";

describe("sanitizeHtmlToPlainText", () => {
  it("removes script tags and keeps text", () => {
    const input = "<p>Hello</p><script>alert('xss')</script><p>World</p>";
    expect(sanitizeHtmlToPlainText(input)).toBe("HelloWorld");
  });

  it("handles empty input", () => {
    expect(sanitizeHtmlToPlainText("")).toBe("");
  });
});
