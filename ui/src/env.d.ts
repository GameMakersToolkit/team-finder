/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** REQUIRED ENVIRONMENT VARIABLES */
    // URL of the API which serves data
    VITE_API_URL: string;


    /** OPTIONAL ENVIRONMENT VARIABLES */
    // String of when the event starts and website automatically becomes active
    VITE_JAM_START: string;

    // String of when the event ends and website automatically becomes inactive
    VITE_JAM_END: string;

    // Sentry.io DSN URL for analytics tracking
    VITE_SENTRY_DSN: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
