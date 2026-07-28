import { useEffect, useState } from "react";

export type CountdownData = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const getCountdownComponents = (countdownTarget: Date, date_now: number): CountdownData => {
    const diffMs = countdownTarget.getTime() - date_now;
    const absDiffMs = Math.abs(diffMs);

    return {
        days: Math.floor(absDiffMs / (1000 * 60 * 60 * 24)),
        hours: Math.floor((absDiffMs / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((absDiffMs / (1000 * 60)) % 60),
        seconds: Math.floor((absDiffMs / 1000) % 60)
    };
}

export const Countdown = ({ countdownTarget, label }: { countdownTarget: Date; label: string }) => {
    const [countdown, setCountdown] = useState(getCountdownComponents(countdownTarget, Date.now()))

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(getCountdownComponents(countdownTarget, Date.now()));
        }, 1000);

        return () => clearInterval(interval);
    }, [countdownTarget]);

    const zeroed = countdown.days <= 0 && countdown.hours <= 0 && countdown.minutes <= 0 && countdown.seconds <= 0;

    return (
        <>
            <p className="text-center mb-2">{label}:</p>
            <div className="flex justify-evenly bg-[var(--theme-countdown-base)] border[var(--theme-countdown-base)] border-2 rounded-xl mx-4 px-2 py-3 text-4xl">
                {!zeroed && countdown.days > 0 && <>
                    <div className="flex flex-col justify-evenly">
                        <span>{`${countdown.days.toString().padStart(2, '0')}`}</span>
                        <span className="text-[0.6rem] leading-3">days</span>
                    </div>
                    <span>:</span>
                </>}

                {!zeroed && (countdown.days > 0 || countdown.hours > 0) && <>
                    <div className="flex flex-col justify-evenly">
                        <span>{`${countdown.hours.toString().padStart(2, '0')}`}</span>
                        <span className="text-[0.6rem] leading-3">hours</span>
                    </div>
                    <span>:</span>
                </>}

                {!zeroed && (countdown.days > 0 || countdown.hours > 0 || countdown.minutes > 0) && <>
                    <div className="flex flex-col justify-evenly">
                        <span>{`${countdown.minutes.toString().padStart(2, '0')} `}</span>
                        <span className="text-[0.6rem] leading-3">minutes</span>
                    </div>
                    <span>:</span>
                </>}

                <div className="flex flex-col justify-evenly">
                    <span>{`${(zeroed ? 0 : countdown.seconds).toString().padStart(2, '0')} `}</span>
                    <span className="text-[0.6rem] leading-3">seconds</span>
                </div>
            </div>
        </>
    )
}
