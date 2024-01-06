import type { Skill } from "./skill";

const skillIcons: Record<string, any> = import.meta.glob("../assets/skill-icons-assets/*.svg", { eager: true });

export function getSkillIcon(skill: Skill) {
  // TODO: This should be either imported using the correct type or properly type checked
  return skillIcons[`../assets/skill-icons-assets/${skill}.svg`].default;
}
