import type { Tool } from "../../model/tool";

export function getToolIcon(tool: Tool) {
  return `/testassets/tool-icons/${tool}.svg`;
}
