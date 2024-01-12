import { useEffect, useState } from "react";
import { importMetaEnv } from "../../../common/utils/importMeta.ts";

const jamName = importMetaEnv().VITE_JAM_NAME;
const jamStartDate = new Date(importMetaEnv().VITE_JAM_START);

// Set the date we're counting down to
export const SiteIntro = () => {
  return (
      <div className="mb-8 sm:mb-8">
          <div className="inline-block w-full sm:w-1/2 pb-8">
            <img
              className="m-auto pt-8 px-16 pb-4"
              src="/logos/full.png"
              width={"300px"}
              alt={jamName + " Team Finder logo"}
            />
            <p className="text-center">{`Welcome to the ${jamName} Team Finder!`}</p>
            <p className="text-center">Create a post or search below to find a team.</p>
          </div>
          <div className="inline-block w-full sm:w-1/2 text-center">
            <CountdownSection />
          </div>
      </div>
  );
}

const CountdownSection = () => {
  const [countdown, setCountdown] = useState(getCountdownComponents(Date.now()))

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdownComponents(Date.now()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (
    countdown.days <= 0 &&
    countdown.hours <= 0 &&
    countdown.minutes <= 0 &&
    countdown.seconds <= 0
  ) {
    countdown.days = 0
    countdown.hours = 0
    countdown.minutes = 0
    countdown.seconds = 0
  }

  return (
      <>
      <div className="bg-red-600 border-red-600 border-2 rounded-xl inline-block p-3">
          {countdown.days > 0 && <span className="text-4xl mr-8">{`${countdown.days.toString().padStart(2, '0')}`}</span>}
          {(countdown.days > 0 || countdown.hours > 0) && <span className="text-4xl mr-8">{`${countdown.hours.toString().padStart(2, '0')}`}</span>}
          {(countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0) && <span className="text-4xl mr-8">{`${countdown.minutes.toString().padStart(2, '0')} `}</span>}
          <span className="text-4xl">{`${countdown.seconds.toString().padStart(2, '0')} `}</span>
      </div>
      <p className="text-center py-3">
        {countdown.days > 0 && <span className="mr-4 font-bold text-xl">Days</span>}
        {(countdown.days > 0 || countdown.hours > 0) && <span className="mr-4 font-bold text-xl">Hours</span>}
        {(countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0) && <span className="mr-4 font-bold text-xl">Minutes</span>}
        <span className=" font-bold text-xl">Seconds</span>
      </p>
      <p className="text-center">Left until the jam starts!</p>
    </>
  )
}

const getCountdownComponents = (time: number) => {
    // Find the distance between now and the countdown date
    const distance = jamStartDate.getTime() - time;

    // Time calculations for days, hours, minutes and seconds
    const weeks =   Math.floor(distance / (1000 * 60 * 60 * 24 * 7));
    const days =    Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours =   Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return {weeks, days, hours, minutes, seconds};
}
