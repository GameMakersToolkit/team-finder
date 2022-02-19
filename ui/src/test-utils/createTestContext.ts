import { QueryClient } from "react-query";

export interface TestContext {
  queryClient: QueryClient;
  initialToken?: string | null;
}

interface TestContextOptions {
  initialToken: string | null;
}

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
  const initialToken =
    options?.initialToken !== undefined ? options.initialToken : "TEST.TOKEN";
  return {
    queryClient,
    initialToken,
  };
}
