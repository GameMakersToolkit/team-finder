import * as React from "react";
import { Link } from "react-router-dom";
import { useJams } from "../../api/jam.ts";
import { Jam } from "../../common/models/jam.ts";

const getJamStartTime = (start: string | number): number => {
  return typeof start === "number" ? start : Date.parse(start);
};

const getJamEndTime = (end: string | number): number => {
  return typeof end === "number" ? end : Date.parse(end);
};

export const Index: React.FC = () => {
  const { data: jams } = useJams();

  return (
    <>
      <main className="c-index-page">
        <section className="c-index-hero">
          <p className="c-index-hero__eyebrow">Open community platform</p>
          <h1 className="c-index-hero__title">
            <span className="block mono-header">FIND YOUR</span>
            <span className="block mono-header">JAM TEAM</span>
          </h1>
          <p className="c-index-hero__body">
            The Team Finder helps game jam participants (like you!) discover jams, find teammates, and start building games together!
          </p>
          <div className="c-index-hero__actions">
            <a href="#active-jams" className="button-link-container">Browse Active Jams</a>
            <a href="#upcoming-jams" className="button-link-container">See Upcoming Jams</a>
          </div>
        </section>

        <section className="c-index-feature-grid" aria-label="Why Team Finder">
          <article className="c-index-feature-card">
            <h2>Discover</h2>
            <p>Explore open jam communities and jump straight into their Team Finder pages.</p>
          </article>
          <article className="c-index-feature-card">
            <h2>Connect</h2>
            <p>Meet collaborators with the right skills, tools, and availability for your team.</p>
          </article>
          <Link className="" target="_blank" key={"Contact Support"} to={`https://discord.com/users/427486675409829898`}>
          <article className="c-index-feature-card">
            <h2>Share Your Jam</h2>
            <p>
              Want your jam listed here? Reach out to <span className="font-bold">@Dotwo</span> on discord and we can add it for your community.
            </p>
          </article>
          </Link>
        </section>

        {jams ? <JamInfo jams={jams} /> : <p className="text-center text-lg">Loading jams...</p>}
      </main>

      <footer className="c-index-footer">
        <span className="c-index-footer__item">&#x2190; Like this site? Consider donating $1!</span>
        <span className="c-index-footer__item">Proudly open source since 2021</span>
        <a
          className="c-index-footer__item c-index-footer__link"
          href="https://github.com/GameMakersToolkit/team-finder"
          target="_blank"
          rel="noreferrer"
        >
          View the project on GitHub
        </a>
      </footer>
    </>
  );
};

const NoJamsMessage: React.FC<{ label: string }> = ({ label }) => (
  <div className="c-index-empty-state">No {label} jams at the moment.</div>
);

const JamInfo: React.FC<{ jams: Jam[] }> = ({ jams }) => {
  const now = Date.now();
  const exampleJam = jams.find(jam => jam.jamId === "example-jam");
  const nonFinishedJams = jams
    .filter(jam => jam.jamId !== "example-jam")
    .filter(jam => getJamEndTime(jam.end) >= now);

  const activeJams = nonFinishedJams
    .filter(jam => getJamStartTime(jam.start) <= now)
    .filter(jam => jam.jamId !== exampleJam?.jamId);

  const upcomingJams = nonFinishedJams
    .filter(jam => getJamStartTime(jam.start) > now)
    .filter(jam => jam.jamId !== exampleJam?.jamId);

  return (
    <>
      <section id="active-jams" className="c-index-jam-section">
        <h3 className="mono-header c-index-section-title">Active Jams</h3>
        <div className="c-index-jam-grid">
          {activeJams.length === 0
            ? <NoJamsMessage label="active" />
            : activeJams.map(jam => <JamTile key={jam.jamId} jam={jam} />)}
        </div>
      </section>

      <section id="upcoming-jams" className="c-index-jam-section">
        <h3 className="mono-header c-index-section-title">Starting Soon</h3>
        <div className="c-index-jam-grid">
          {upcomingJams.length === 0
            ? <NoJamsMessage label="upcoming" />
            : upcomingJams.map(jam => <JamTile key={jam.jamId} jam={jam} />)}
        </div>
      </section>

      {exampleJam && (
        <section className="c-index-jam-section">
          <h3 className="mono-header c-index-section-title">Not Sure Where To Start?</h3>
          <p className="text-center mb-4">Try the example jam page to see how Team Finder works.</p>
          <div className="c-index-jam-grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3">
          <div className="hidden lg:block">&nbsp;</div>
          <div className="c-index-example-wrapper">
            <JamTile jam={exampleJam} />
          </div>
          </div>
        </section>
      )}
    </>
  );
};

const JamTile: React.FC<{ jam: Jam }> = ({ jam }) => {
  return (
    <Link to={`/${jam.jamId}`} className="c-index-jam-link">
      <section
        className="c-index-jam-tile"
        style={{
          backgroundImage: `linear-gradient(${jam.styles["--gradient-start"]}, ${jam.styles["--gradient-end"]})`
        }}
      >
        <img src={jam.logoStackedUrl} alt={jam.name} className="c-index-jam-tile__logo" />
        <h4 className="c-index-jam-tile__title">{jam.name}</h4>
      </section>
    </Link>
  );
};
