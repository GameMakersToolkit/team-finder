import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          include: [
            'tests/unit/**/*.{test,spec}.{ts,tsx}',
            'tests/**/*.unit.{test,spec}.{ts,tsx}',
          ],
          name: 'unit',
          environment: 'node',
        },
      },
      {
        test: {
          include: [
            'tests/browser/**/*.{test,spec}.{ts,tsx}',
            'tests/**/*.browser.{test,spec}.{ts,tsx}',
          ],
          name: 'browser',
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [
              { browser: 'chromium' },
            ],
          },
        },
      },
    ],
  },
})
