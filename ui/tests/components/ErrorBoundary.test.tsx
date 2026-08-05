import React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "../../src/common/components/ErrorBoundary";

const ThrowingComponent = () => {
  throw new Error("boom");
};

describe("ErrorBoundary", () => {
  it("renders fallback UI when child throws", () => {
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText("Unexpected UI Error")).toBeInTheDocument();
    expect(screen.getByText("boom")).toBeInTheDocument();
  });
});
