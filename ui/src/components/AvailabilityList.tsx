import * as React from "react";
import {Availability, availabilityInfoMap} from "../model/availability";
import cx from "classnames";

// Not actually a list, currently only displays one at a time - oh well
export const AvailabilityList: React.FC<{
    availability: Availability;
    label: React.ReactNode;
    className?: string;
    showText: boolean
}> = ({availability, label, className, showText}) => {
    if (availability.length == 0) {
        return null;
    }

    return (
        <dl className={cx("flex gap-1 flex-wrap text-lg", className)}>
            <dt className={`py-1 ${showText ? "mr-1" : "block w-full sm:w-fit"}`}>{label}</dt>
            <dd
                key={availability}
                className={`py-1 border-2 border-[color:var(--availability-color)] flex items-center ${showText ? "px-2 sm:px-1" : "px-1"}`}
            >
                {showText && <span className="text-sm">{availabilityInfoMap[availability].friendlyName}</span>}
            </dd>
        </dl>
    );
};
