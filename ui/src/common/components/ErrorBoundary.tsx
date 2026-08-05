import React from "react";
import { ErrorDisplay } from "./ErrorDisplay.tsx";

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = {
    hasError: false,
    message: "An unexpected UI error occurred.",
  };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || "An unexpected UI error occurred.",
    };
  }

  componentDidCatch(error: Error): void {
    // Keep this console log for production diagnostics in environments without telemetry.
    console.error("Unhandled React error boundary exception", error);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <ErrorDisplay
          title="Unexpected UI Error"
          message={this.state.message}
          actionLabel="Reload"
          onAction={() => window.location.reload()}
        />
      );
    }

    return this.props.children;
  }
}
