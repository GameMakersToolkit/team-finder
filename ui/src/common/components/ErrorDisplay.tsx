import React from "react";

export const ErrorDisplay: React.FC<{
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({
  title = "Something went wrong",
  message,
  actionLabel,
  onAction,
}) => {
  return (
    <main className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-2xl font-semibold mb-2">{title}</h1>
      <p className="mb-4">{message}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          className="px-4 py-2 rounded-md bg-[var(--theme-accent-dark)] text-white"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </main>
  );
};
