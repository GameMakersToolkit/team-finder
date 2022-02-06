import * as React from "react";
import { render, RenderResult } from "@testing-library/react";
import { QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { createTestContext, TestContext } from "./createTestContext";

export function renderWithContext(
  element: React.ReactElement,
  context: TestContext = createTestContext()
): RenderResult {
  return render(
    <QueryClientProvider client={context.queryClient}>
      <MemoryRouter>{element}</MemoryRouter>
    </QueryClientProvider>
  );
}
