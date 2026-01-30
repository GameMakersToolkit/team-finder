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
    name: "--theme-tile-bg",
    description: "Background",
    currentValue: theme.styles["--theme-tile-bg"],
    ctx: "skill",
  },
  {
    name: "--theme-tile-border",
    description: "Outline",
    currentValue: theme.styles["--theme-tile-border"],
    ctx: "skill",
  },
  {
    name: "--skill-color-looking-for",
    description: "Badge background",
    currentValue: theme.styles["--skill-color-looking-for"],
    ctx: "skill",
  },
  {
    name: "--skill-color-looking-for-text",
    description: "Text colour",
    currentValue: theme.styles["--skill-color-looking-for-text"],
    ctx: "skill",
  },
  {
    name: "--skill-color-possessed",
    description: "Badge background",
    currentValue: theme.styles["--skill-color-possessed"],
    ctx: "skill",
  },
  {
    name: "--skill-color-possessed-text",
    description: "Text colour",
    currentValue: theme.styles["--skill-color-possessed-text"],
    ctx: "skill",
  },
  {
    name: "--skill-color-engines",
    description: "Badge background",
    currentValue: theme.styles["--skill-color-engines"],
    ctx: "skill",
  },
  {
    name: "--skill-color-engines-text",
    description: "Text colour",
    currentValue: theme.styles["--skill-color-engines-text"],
    ctx: "skill",
  },
  {
    name: "--skill-color-languages",
    description: "Badge background",
    currentValue: theme.styles["--skill-color-languages"],
    ctx: "skill",
  },
  {
    name: "--skill-color-languages-text",
    description: "Text colour",
    currentValue: theme.styles["--skill-color-languages-text"],
    ctx: "skill",
  },
  {
    name: "--skill-color-timezones",
    description: "Badge background",
    currentValue: theme.styles["--skill-color-timezones"],
    ctx: "skill",
  },
  {
    name: "--skill-color-timezones-text",
    description: "Text colour",
    currentValue: theme.styles["--skill-color-timezones-text"],
    ctx: "skill",
  },
  {
    name: "--theme-text",
    description: "Text colour",
    currentValue: theme.styles["--theme-text"],
    ctx: "common",
  },
];
