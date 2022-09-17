import React from "react";
import { importMetaEnv } from "../../utils/importMeta";

const jamName = importMetaEnv().VITE_JAM_NAME;
const nextYear = new Date().getFullYear() + 1

export const AfterJam: React.FC = () => {
  return (
    <div className="container max-w-screen-xxl h-[100vh]">
      <div style={{
        width: "100%",
        margin: 0,
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
      }}>
        <img
          className="block"
          style={{margin: "0 auto"}}
          src="/logos/header.png"
          width={400}
          alt={`${jamName} Team Finder`}
        />

        <h1 className="text-3xl my-4 text-center font-bold px-2">Thanks for using the Team Finder!</h1>

        <p className="mb-2 text-center px-2">{`The ${jamName} has now ended, and the Team Finder is no longer active.`}</p>
        <p className="mb-2 text-center px-2">Thanks so much for using the Team Finder. We really hope you found a good team and enjoyed the game jam!</p>
        <p className="mb-2 text-center px-2">{`The Team Finder will return in ${nextYear} with next year's jam.`}</p>
      </div>
    </div>
  );
}
