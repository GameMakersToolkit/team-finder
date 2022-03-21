import type { Skill } from "./skill";

const skillIcons = import.meta.globEager("./skill-icons/*.svg");

export function getSkillIcon(skill: Skill) {
  return skillIcons[`./skill-icons-assets/${skill}.svg`].default;
}
