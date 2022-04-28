import type { Tool } from "./tool";

const toolIcons = import.meta.globEager("./tool-icons-assets/*.svg");

export function getToolIcon(tool: Tool) {
  return toolIcons[`./tool-icons-assets/${tool}.svg`].default;
}
