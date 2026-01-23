import { Jam } from "../../../../common/components/JamSpecificStyling.tsx";

export const getPreviewThemeFields = (theme: Jam) => [
  {
    name: "--theme-background",
    description: "Background colour of the entire site",
    currentValue: theme.styles["--theme-background"],
    ctx: "common",
  },
  {
    name: "--theme-primary",
    description: "Primary colour of your jam page",
    currentValue: theme.styles["--theme-primary"],
    ctx: "common",
  },
  {
    name: "--theme-accent",
    description: "Accent colour of your jame page",
    currentValue: theme.styles["--theme-accent"],
    ctx: "common",
  },
  {
    name: "--theme-tile-bg",
    description: "Background colour for each post tile (in case your background colour clashes)",
    currentValue: theme.styles["--theme-tile-bg"],
    ctx: "common",
  },
  {
    name: "--gradient-start",
    description: "The starting (outside edge) colour of the gradient at the top/bottom of the site",
    currentValue: theme.styles["--gradient-start"],
    ctx: "common",
  },
  {
    name: "--gradient-end",
    description: "The ending (inside edge) colour of the gradient at the top/bottom of the site",
    currentValue: theme.styles["--gradient-end"],
    ctx: "common",
  },
  {
    name: "--skill-color-looking-for",
    description: "'Looking For' skill badge background colour",
    currentValue: theme.styles["--skill-color-looking-for"],
    ctx: "skill",
  },
  {
    name: "--skill-color-looking-for-text",
    description: "'Looking For' skill text colour",
    currentValue: theme.styles["--skill-color-looking-for-text"],
    ctx: "skill",
  },
  {
    name: "--skill-color-possessed",
    description: "'Skills Possessed' skill badge background colour",
    currentValue: theme.styles["--skill-color-possessed"],
    ctx: "skill",
  },
  {
    name: "--skill-color-possessed-text",
    description: "'Skills Possessed' skill text colour",
    currentValue: theme.styles["--skill-color-possessed-text"],
    ctx: "skill",
  },
  {
    name: "--skill-color-engines",
    description: "'Preferred Engines' skill badge background colour",
    currentValue: theme.styles["--skill-color-engines"],
    ctx: "skill",
  },
  {
    name: "--skill-color-engines-text",
    description: "'Preferred Engines' skill text colour",
    currentValue: theme.styles["--skill-color-engines-text"],
    ctx: "skill",
  },
  {
    name: "--skill-color-languages",
    description: "'Languages' skill badge background colour",
    currentValue: theme.styles["--skill-color-languages"],
    ctx: "skill",
  },
  {
    name: "--skill-color-languages-text",
    description: "'Languages' skill text colour",
    currentValue: theme.styles["--skill-color-languages-text"],
    ctx: "skill",
  },
  {
    name: "--skill-color-timezones",
    description: "'Timezones' skill badge background colour",
    currentValue: theme.styles["--skill-color-timezones"],
    ctx: "skill",
  },
  {
    name: "--skill-color-timezones-text",
    description: "'Timezones' skill text colour",
    currentValue: theme.styles["--skill-color-timezones-text"],
    ctx: "skill",
  },
];
