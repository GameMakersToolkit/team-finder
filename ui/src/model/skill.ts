const skillIcons = import.meta.globEager("./skill-icons/*.svg");

export const allSkills = [
  "ART_2D",
  "ART_3D",
  "CODE",
  "DESIGN_PRODUCTION",
  "SOUND_MUSIC",
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
    icon: skillIcons["./skill-icons/ART_2D.svg"].default,
  },
  ART_3D: {
    friendlyName: "3D Art",
    icon: skillIcons["./skill-icons/ART_3D.svg"].default,
  },
  CODE: {
    friendlyName: "Code",
    icon: skillIcons["./skill-icons/CODE.svg"].default,
  },
  DESIGN_PRODUCTION: {
    friendlyName: "Design & Production",
    icon: skillIcons["./skill-icons/DESIGN_PRODUCTION.svg"].default,
  },
  OTHER: {
    friendlyName: "Other",
    icon: skillIcons["./skill-icons/OTHER.svg"].default,
  },
  SOUND_MUSIC: {
    friendlyName: "Sound & Music",
    icon: skillIcons["./skill-icons/SOUND_MUSIC.svg"].default,
  },
  TEAM_LEAD: {
    friendlyName: "Team Lead",
    icon: skillIcons["./skill-icons/TEAM_LEAD.svg"].default,
  },
  TESTING_SUPPORT: {
    friendlyName: "Testing & Support",
    icon: skillIcons["./skill-icons/TESTING_SUPPORT.svg"].default,
  },
};
