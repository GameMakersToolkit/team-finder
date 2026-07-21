import {useContext, useEffect, useState} from "react";
import {JamSpecificContext} from "../../../common/components/JamSpecificStyling.tsx";

const JAM_START = new Date(1784739600 * 1000);
const SUBMISSIONS_CLOSE = new Date(1785085200 * 1000);

export const SiteIntro = () => {
    const theme = useContext(JamSpecificContext)
    const now = new Date();

    const countdown = now < JAM_START
        ? {target: JAM_START, label: "The jam starts in", visible: true}
        : {target: SUBMISSIONS_CLOSE, label: "Submissions close in", visible: now < SUBMISSIONS_CLOSE};

    return (<div className="mb-8 sm:mb-8">
            <img
                className="m-auto mb-2"
                src={theme.logoLargeUrl}
                width={"50%"}
                style={{maxWidth: "480px"}}
                alt={theme.name + " Team Finder logo"}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2">
                <div className="flex flex-col justify-center mb-4 sm:m-0">
                    <p className="text-center">{`Welcome to the ${theme.name} Team Finder!`}</p>
                    {countdown.visible && <p className="text-center">Create a post or search below to find a team.</p>}
                </div>

                <div className="text-center">
                    {countdown.visible && <CountdownSection countdownTarget={new Date(countdown.target)} label={countdown.label}/>}
                    {!countdown.visible && <p className="text-center">Create a post or search below to find a team.</p>}
                </div>
            </div>
    </div>);
}

const CountdownSection = ({countdownTarget, label}: {countdownTarget: Date, label: string}) => {
    const [countdown, setCountdown] = useState(getCountdownComponents(countdownTarget, Date.now()))

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(getCountdownComponents(countdownTarget, Date.now()));
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
            <p className="text-center mb-2">{label}:</p>
            <div className="flex justify-evenly bg-[var(--theme-countdown-base)] border[var(--theme-countdown-base)] border-2 rounded-xl mx-4 px-2 py-3 text-4xl">
                {countdown.days > 0 && <>
                    <div className="flex flex-col justify-evenly">
                        <span>{`${countdown.days.toString().padStart(2, '0')}`}</span>
                        <span className="text-[0.6rem] leading-3">days</span>
                    </div>
                    <span>:</span>
                </>}

                {(countdown.days > 0 || countdown.hours > 0) && <>
                    <div className="flex flex-col justify-evenly">
                        <span>{`${countdown.hours.toString().padStart(2, '0')}`}</span>
                        <span className="text-[0.6rem] leading-3">hours</span>
                    </div>
                    <span>:</span>
                </>}

                {(countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0) && <>
                    <div className="flex flex-col justify-evenly">
                        <span>{`${countdown.minutes.toString().padStart(2, '0')} `}</span>
                        <span className="text-[0.6rem] leading-3">minutes</span>
                    </div>
                <span>:</span>
                </>}

                <div className="flex flex-col justify-evenly">
                    <span>{`${countdown.seconds.toString().padStart(2, '0')} `}</span>
                    <span className="text-[0.6rem] leading-3">seconds</span>
                </div>
            </div>
        </>)
}

const getCountdownComponents = (countdownTarget: Date, date_now: number) => {
    const diffMs = countdownTarget.getTime() - date_now;
    const absDiffMs = Math.abs(diffMs);

    return {
        days: Math.floor(absDiffMs / (1000 * 60 * 60 * 24)),
        hours: Math.floor((absDiffMs / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((absDiffMs / (1000 * 60)) % 60),
        seconds: Math.floor((absDiffMs / 1000) % 60)
    };
}
