import React, {useEffect, useState} from "react";
import { importMetaEnv } from "../../utils/importMeta";

const jamName = importMetaEnv().VITE_JAM_NAME;

// Set the date we're counting down to
const jamStartDate = new Date(importMetaEnv().VITE_JAM_START);

export const BeforeJam: React.FC = () => {

  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

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
          alt={"GMTK Game Jam 2022 Team Finder"}
        />

        <h1 className="text-3xl my-4 text-center font-bold px-2">{`The ${jamName} Team Finder opens soon!`}</h1>
        <h2 className="text-2xl my-2 text-center px-2">Check back in:</h2>
        <h2 className="text-xl my-2 text-center px-2">{getCountdown(time)}</h2>
        {/*<p className="mb-2 text-center px-2">{`The Team Finder will return in ${nextYear} with next year's jam.`}</p>*/}
      </div>
    </div>
  );
}

const getCountdown = (time: number) => {
  // Find the distance between now and the countdown date
  const distance = jamStartDate.getTime() - time;

  // Time calculations for days, hours, minutes and seconds
  const weeks =   Math.floor(distance / (1000 * 60 * 60 * 24 * 7));
  const days =    Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours =   Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  return <>
    {weeks > 0 && (<span className="mr-4">{weeks.toString()}w</span>)}
    {days > 0 && (<span className="mr-4">{days.toString()}d</span>)}
    <span className="mr-4">{hours.toString().padStart(2, '0')}h</span>
    <span className="mr-4">{minutes.toString().padStart(2, '0')}m</span>
    <span className="mr-4">{seconds.toString().padStart(2, '0')}s</span>
  </>;
}
