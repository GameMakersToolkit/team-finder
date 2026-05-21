import React from "react";
import { Link } from "react-router-dom";
import { PortfolioIcon } from "./PortfolioIcon.tsx";
import { getPortfolioLink } from "./PortfolioSites.ts";

export const OptionalPortfolioLinks: React.FC<{ portfolioLinks: string[] }> = ({ portfolioLinks }) => {
  const PortfolioLink: React.FC<{ icon: any, url: string, label: string }> = ({ icon, url, label }) => {
    return (
      <Link to={url} className="text-xs flex">
        <span className="mr-1">
          <PortfolioIcon site={icon} override_classes={undefined} />
        </span>
        {label}
      </Link>
    );
  };

  return (
    <div className="mt-2 flex flex-row flex-wrap justify-unset gap-y-1 gap-x-2 fill-[var(--theme-accent-dark)]">
      {portfolioLinks.map((link: string) => {
        const data = getPortfolioLink(link);
        if (!data || !data.label) return <></>;
        return (
          <PortfolioLink key={`portfolio-link--${data.url}`} icon={data.icon} url={data.url} label={data.label} />);
      })}
    </div>
  );
};
