import { useEffect, useState } from "react";

const jamName = import.meta.env.VITE_JAM_NAME;
const jamStartDate = new Date(import.meta.env.VITE_JAM_START);
const jamEndDate = new Date(import.meta.env.VITE_JAM_END);

// Set the date we're counting down to
export const SiteIntro = () => {
  return (
      <div className="mb-8 sm:mb-8">
          <img
              className="m-auto mb-2"
              src="/logos/jam-logo.webp"
              width={"300px"}
              alt={jamName + " Team Finder logo"}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2">
              <div className="flex flex-col justify-center mb-4 sm:m-0">
                  <p className="text-center">{`Welcome to the ${jamName} Team Finder!`}</p>
                  <p className="text-center">Create a post or search below to find a team.</p>
                  <p>&nbsp;</p>
                  <p className="text-center">The jam will run from<br /><span className="font-bold">August 16th 2024 at 6:00 PM (BST)</span> to<br /><span className="font-bold">August 20th 2024 at 6:00 PM (BST)</span></p>
              </div>

              <div className="text-center">
                  <CountdownSection />
              </div>
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
    return (
        <>
            <p className="text-center mb-2">We hope you enjoyed the jam!</p>
        </>
    )
  }

  return (
      <>
      <p className="text-center mb-2">The jam {countdown.reference}s in:</p>
      <div className="flex justify-evenly bg-red-600 border-red-600 border-2 rounded-xl mx-4 px-2 py-3 text-3xl">
          {countdown.days > 0 && <><span>{`${countdown.days.toString().padStart(2, '0')}`}<span className="block text-sm italic">days</span></span><span className="pt-1">:</span></>}
          {(countdown.days > 0 || countdown.hours > 0) && <><span>{`${countdown.hours.toString().padStart(2, '0')}`}<span className="block text-sm italic">hours</span></span><span className="pt-1">:</span></>}
          {(countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0) && <><span>{`${countdown.minutes.toString().padStart(2, '0')} `}<span className="block text-sm italic">minutes</span></span><span className="pt-1">:</span></>}
          <span>{`${countdown.seconds.toString().padStart(2, '0')} `}<span className="block text-sm italic">seconds</span></span>
      </div>
    </>
  )
}

const getCountdownComponents = (time: number) => {
    // Find the distance between now and the countdown date
    let distance = jamStartDate.getTime() - time;
    let reference = "start";
    if (distance < 0) {
        distance = jamEndDate.getTime() - time;
        reference = "end"
    }

    // Time calculations for days, hours, minutes and seconds
    const weeks =   Math.floor(distance / (1000 * 60 * 60 * 24 * 7));
    const days =    Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours =   Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return {weeks, days, hours, minutes, seconds, reference};
}
