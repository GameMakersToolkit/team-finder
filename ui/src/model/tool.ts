import { getToolIcon } from "./toolIcons";

export const allTools = [
  "UNITY",
  "CONSTRUCT",
  "GAME_MAKER_STUDIO",
  "GODOT",
  "TWINE",
  "BITSY",
  "UNREAL",
  "RPG_MAKER",
  "PICO_8",
] as const;

export type Tool = typeof allTools[number];

export const isTool = (input: string): input is Tool =>
  (allTools as readonly string[]).includes(input);

export interface ToolInfo {
  friendlyName: string;
  icon: string;
}

export const toolInfoMap: Record<Tool, ToolInfo> = {
  UNITY: {
    friendlyName: "Unity",
    icon: getToolIcon("UNITY"),
  },
  CONSTRUCT: {
    friendlyName: "Construct",
    icon: getToolIcon("CONSTRUCT"),
  },
  GAME_MAKER_STUDIO: {
    friendlyName: "Game Maker",
    icon: getToolIcon("GAME_MAKER_STUDIO"),
  },
  GODOT: {
    friendlyName: "Godot",
    icon: getToolIcon("GODOT"),
  },
  TWINE: {
    friendlyName: "Twine",
    icon: getToolIcon("TWINE"),
  },
  BITSY: {
    friendlyName: "Bitsy",
    icon: getToolIcon("BITSY"),
  },
  UNREAL: {
    friendlyName: "Unreal",
    icon: getToolIcon("UNREAL"),
  },
  RPG_MAKER: {
    friendlyName: "RPG Maker",
    icon: getToolIcon("RPG_MAKER"),
  },
  PICO_8: {
    friendlyName: "PICO-8",
    icon: getToolIcon("PICO_8"),
  },
};
