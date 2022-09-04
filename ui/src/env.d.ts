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
  // String of when the event starts and website automatically becomes active
  VITE_JAM_START: string;

  // String of when the event ends and website automatically becomes inactive
  VITE_JAM_END: string;

  // Sentry.io DSN URL for analytics tracking
  VITE_SENTRY_DSN: string;
}
