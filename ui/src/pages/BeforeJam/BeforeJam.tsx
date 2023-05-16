import React, {useEffect, useState} from "react";
import { importMetaEnv } from "../../utils/importMeta";
import { getCountdownComponents } from "../../utils/countdown";

const jamName = importMetaEnv().VITE_JAM_NAME;

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
          alt={`${jamName} Team Finder`}
        />

        <h1 className="text-3xl my-4 text-center font-bold px-2">{`The ${jamName} Team Finder opens soon!`}</h1>
        <h2 className="text-2xl my-2 text-center px-2">Check back in:</h2>
        <h2 className="text-xl my-2 text-center px-2">{getCountdown(time)}</h2>
      </div>
    </div>
  );
}

const getCountdown = (time: number) => {
  const components = getCountdownComponents(time);

  // Display the result in the element with id="demo"
  return <>
    {components.days > 0 && (<span className="mr-4">{components.days.toString()}d</span>)}
    <span className="mr-4">{components.hours.toString().padStart(2, '0')}h</span>
    <span className="mr-4">{components.minutes.toString().padStart(2, '0')}m</span>
    <span className="mr-4">{components.seconds.toString().padStart(2, '0')}s</span>
  </>;
}
