import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { importMetaEnv } from "./importMeta";

Sentry.init({
  dsn: importMetaEnv().VITE_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],

  tracesSampleRate: 0.2,
});
