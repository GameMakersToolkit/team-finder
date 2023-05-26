import { getSkillIcon } from "./skillIcons";

export const allSkills = [
  "ART_2D",
  "ART_3D",
  "CODE",
  "DESIGN_PRODUCTION",
  "MUSIC",
  "SFX",
  "TESTING_SUPPORT",
  "TEAM_LEAD",
  "OTHER",
] as const;

export type Skill = typeof allSkills[number];

export const isSkill = (input: string): input is Skill =>
  (allSkills as readonly string[]).includes(input);

export interface SkillInfo {
  friendlyName: string;
  icon: string;
}

export const skillInfoMap: Record<Skill, SkillInfo> = {
  ART_2D: {
    friendlyName: "2D Art",
    icon: getSkillIcon("ART_2D"),
  },
  ART_3D: {
    friendlyName: "3D Art",
    icon: getSkillIcon("ART_3D"),
  },
  CODE: {
    friendlyName: "Code",
    icon: getSkillIcon("CODE"),
  },
  DESIGN_PRODUCTION: {
    friendlyName: "Design & Production",
    icon: getSkillIcon("DESIGN_PRODUCTION"),
  },
  OTHER: {
    friendlyName: "Other",
    icon: getSkillIcon("OTHER"),
  },
  SFX: {
    friendlyName: "SFX",
    icon: getSkillIcon("SFX"),
  },
  MUSIC: {
    friendlyName: "Music",
    icon: getSkillIcon("MUSIC"),
  },
  TEAM_LEAD: {
    friendlyName: "Team Lead",
    icon: getSkillIcon("TEAM_LEAD"),
  },
  TESTING_SUPPORT: {
    friendlyName: "Testing & Support",
    icon: getSkillIcon("TESTING_SUPPORT"),
  },
};
