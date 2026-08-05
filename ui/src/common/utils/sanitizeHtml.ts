export function sanitizeHtmlToPlainText(input: string): string {
  if (!input) {
    return "";
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(input, "text/html");

  doc.querySelectorAll("script, style, iframe, object, embed").forEach((node) => {
    node.remove();
  });

  return doc.body.textContent ?? "";
}
