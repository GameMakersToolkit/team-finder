import type { Tool } from "./tool";

const toolIcons: Record<string, any> = import.meta.glob("./tool-icons-assets/*.svg", { eager: true });

export function getToolIcon(tool: Tool) {
  return toolIcons[`./tool-icons-assets/${tool}.svg`].default;
}
