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
