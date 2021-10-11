import { QueryClient } from "react-query";

export interface TestContext {
  queryClient: QueryClient;
}

// This is fine for now - I expect it won't be empty for long
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface TestContextOptions {}

export function createTestContext(
  options?: TestContextOptions,
  overrides: Partial<TestContext> = {}
): TestContext {
  const queryClient =
    overrides.queryClient ??
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
  return {
    queryClient,
  };
}
