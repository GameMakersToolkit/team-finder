import * as React from "react";
import { render, RenderResult } from "@testing-library/react";
import { createTestContext, TestContext } from "./createTestContext";
import { QueryClientProvider } from "react-query";

export function renderWithContext(
  element: React.ReactElement,
  context: TestContext = createTestContext()
): RenderResult {
  return render(
    <QueryClientProvider client={context.queryClient}>
      {element}
    </QueryClientProvider>
  );
}
