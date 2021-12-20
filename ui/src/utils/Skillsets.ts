export interface Skillset {
  id: string;
  name: string;
}

export const skillsets: Skillset[] = [
  { id: "ART_2D",             name: "2D Art" },
  { id: "ART_3D",             name: "3D Art" },
  { id: "CODE",               name: "Code" },
  { id: "DESIGN_PRODUCTION",  name: "Design/\nProduction" },
  { id: "SOUND_MUSIC",        name: "Sound/\nMusic" },
  { id: "TESTING_SUPPORT",    name: "Testing/\nSupport" },
  { id: "TEAM_LEAD",          name: "Team Lead" },
  { id: "OTHER",              name: "Other" },
];

/**
 * Convert between enum representation from DB and human-readable string
 */
export const getSkillsets = (skillsPossessed: string[]): Skillset[] => {
  return skillsPossessed.map(skillPossessed =>
      skillsets.filter(skill => skill.id === skillPossessed)[0]
  );
};
