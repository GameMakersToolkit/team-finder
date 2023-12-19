import type { Tool } from "./tool";

const toolIcons: Record<string, any> = import.meta.glob("../assets/tool-icons-assets/*.svg", { eager: true });

export function getToolIcon(tool: Tool) {
  return toolIcons[`../assets/tool-icons-assets/${tool}.svg`].default;
}
