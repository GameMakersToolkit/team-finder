import {useContext, useEffect, useState} from "react";
import {JamSpecificContext} from "../../../common/components/JamSpecificStyling.tsx";

// Set the date we're counting down to
export const SiteIntro = () => {
    const theme = useContext(JamSpecificContext)

    return (<div className="mb-8 sm:mb-8">
            <img
                className="m-auto mb-2"
                src={theme.logoLargeUrl}
                width={"50%"}
                alt={theme.name + " Team Finder logo"}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="flex flex-col justify-center mb-4 sm:m-0">
                    <p className="text-center">{`Welcome to the ${theme.name} Team Finder!`}</p>
                    <p className="text-center">Create a post or search below to find a team.</p>
                </div>

                <div className="text-center">
                    <CountdownSection startDate={new Date(theme.start)}/>
                </div>
            </div>
        </div>);
}

const CountdownSection = ({startDate}) => {
    const [countdown, setCountdown] = useState(getCountdownComponents(startDate, Date.now()))

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(getCountdownComponents(startDate, Date.now()));
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (countdown.days <= 0 && countdown.hours <= 0 && countdown.minutes <= 0 && countdown.seconds <= 0) {
        countdown.days = 0
        countdown.hours = 0
        countdown.minutes = 0
        countdown.seconds = 0
    }

    return (<>
            <p className="text-center mb-2">The jam starts in:</p>
            <div className="flex justify-evenly bg-red-600 border-red-600 border-2 rounded-xl mx-4 px-2 py-3 text-4xl">
                {countdown.days > 0 && <>
                    <span>{`${countdown.days.toString().padStart(2, '0')}`}</span><span>:</span></>}
                {(countdown.days > 0 || countdown.hours > 0) && <>
                    <span>{`${countdown.hours.toString().padStart(2, '0')}`}</span><span>:</span></>}
                {(countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0) && <>
                    <span>{`${countdown.minutes.toString().padStart(2, '0')} `}</span><span>:</span></>}
                <span>{`${countdown.seconds.toString().padStart(2, '0')} `}</span>
            </div>
        </>)
}

const getCountdownComponents = (jamStartDate: Date, time: number) => {
    // Find the distance between now and the countdown date
    const distance = jamStartDate.getTime() - time;

    // Time calculations for days, hours, minutes and seconds
    const weeks = Math.floor(distance / (1000 * 60 * 60 * 24 * 7));
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    return {weeks, days, hours, minutes, seconds};
}
