import * as React from "react";

export const PageContainer: React.FC = ({ children }) => (
  <div className="container mx-auto px-2 max-w-screen-md">{children}</div>
);
