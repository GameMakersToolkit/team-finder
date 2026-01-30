import { Jam } from "../../../../common/components/JamSpecificStyling.tsx";

export const getPreviewThemeFields = (theme: Jam) => [
  {
    name: "--theme-background",
    description: "Default background colour",
    currentValue: theme.styles["--theme-background"],
    ctx: "common",
  },
  {
    name: "--theme-primary",
    description: "Primary theme colour",
    currentValue: theme.styles["--theme-primary"],
    ctx: "common",
  },
  {
    name: "--theme-accent",
    description: "Accent theme colour",
    currentValue: theme.styles["--theme-accent"],
    ctx: "common",
  },
  {
    name: "--gradient-start",
    description: "Outside edge colour of header/footer gradient",
    currentValue: theme.styles["--gradient-start"],
    ctx: "common",
  },
  {
    name: "--gradient-end",
    description: "Inside edge colour of header/footer gradient",
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
  {
    name: "--theme-countdown-base",
    description: "Countdown base",
    currentValue: theme.styles["--theme-countdown-base"],
    ctx: "common",
  },
  {
    name: "--theme-countdown-border",
    description: "Countdown border",
    currentValue: theme.styles["--theme-countdown-border"],
    ctx: "common",
  },
];
