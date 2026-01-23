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
    description: "--skill-color-looking-for",
    currentValue: theme.styles["--skill-color-looking-for"],
    ctx: "skill",
  },
  {
    name: "--skill-color-looking-for-text",
    description: "--skill-color-looking-for-text",
    currentValue: theme.styles["--skill-color-looking-for-text"],
    ctx: "skill",
  },
  {
    name: "--skill-color-possessed",
    description: "--skill-color-possessed",
    currentValue: theme.styles["--skill-color-possessed"],
    ctx: "skill",
  },
  {
    name: "--skill-color-possessed-text",
    description: "--skill-color-possessed-text",
    currentValue: theme.styles["--skill-color-possessed-text"],
    ctx: "skill",
  },
  {
    name: "--skill-color-engines",
    description: "--skill-color-engines",
    currentValue: theme.styles["--skill-color-engines"],
    ctx: "skill",
  },
  {
    name: "--skill-color-engines-text",
    description: "--skill-color-engines-text",
    currentValue: theme.styles["--skill-color-engines-text"],
    ctx: "skill",
  },
  {
    name: "--skill-color-languages",
    description: "--skill-color-languages",
    currentValue: theme.styles["--skill-color-languages"],
    ctx: "skill",
  },
  {
    name: "--skill-color-languages-text",
    description: "--skill-color-languages-text",
    currentValue: theme.styles["--skill-color-languages-text"],
    ctx: "skill",
  },
  {
    name: "--skill-color-timezones",
    description: "--skill-color-timezones",
    currentValue: theme.styles["--skill-color-timezones"],
    ctx: "skill",
  },
  {
    name: "--skill-color-timezones-text",
    description: "--skill-color-timezones-text",
    currentValue: theme.styles["--skill-color-timezones-text"],
    ctx: "skill",
  },
];
