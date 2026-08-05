import React from "react";

export const LoadingSpinner: React.FC<{ label?: string; className?: string }> = ({
  label = "Loading...",
  className = "",
}) => {
  return (
    <div className={`w-full text-center py-8 ${className}`} role="status" aria-live="polite">
      <span className="inline-block w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      <span>{label}</span>
    </div>
  );
};
