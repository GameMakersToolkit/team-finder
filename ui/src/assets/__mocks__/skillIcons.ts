import type { Skill } from "../../model/skill";

export function getSkillIcon(skill: Skill) {
  return `/testassets/skill-icons/${skill}.svg`;
}
