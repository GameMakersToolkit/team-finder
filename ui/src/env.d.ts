interface ImportMetaEnv {
  /** REQUIRED ENVIRONMENT VARIABLES */
  // URL of the API which serves data
  VITE_API_URL: string;

  // Human-readable name of the Discord group running this event (e.g. 'GTMK')
  VITE_DISCORD_NAME: string;

  // Invite URL for users to join your discord server
  VITE_DISCORD_INVITE_URL: string;

  // Human-readable name of the game jam being run
  VITE_JAM_NAME: string;

  // URL of the game jame for people to join/view
  VITE_JAM_URL: string;

  /** OPTIONAL ENVIRONMENT VARIABLES */
  // Sentry.io DSN URL for analytics tracking
  VITE_SENTRY_DSN: string;
}
