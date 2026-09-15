import * as React from "react";

export const Maintenance: React.FC = () => {
  return (
    <main className="c-maintenance-page">
      <section className="c-maintenance-card" role="status" aria-live="polite">
        <p className="c-maintenance-eyebrow mono">GMTK Team Finder</p>
        <h1 className="c-maintenance-title">Website down for maintenance</h1>
        <p className="c-maintenance-copy">We are making a few updates right now. Please check back soon.</p>
      </section>
    </main>
  );
};
