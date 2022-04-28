import type { Tool } from "../tool";

export function getToolIcon(tool: Tool) {
  return `/testassets/tool-icons/${tool}.svg`;
}
