import React from "react";
import { JamInsights } from "./JamInsights.tsx";

export const Overview: React.FC = () => {
  return (
    <section>
      <h2>Overview</h2>
      <p className="mb-4">Quick health and moderation stats for this jam.</p>
      <JamInsights />
    </section>
  );
};
