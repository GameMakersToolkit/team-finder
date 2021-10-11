import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { importMeta } from "./importMeta";

Sentry.init({
  dsn: importMeta().env.VITE_SENTRY_DSN,
  integrations: [new Integrations.BrowserTracing()],

  tracesSampleRate: 0.2,
});
