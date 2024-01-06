import * as React from "react";
import {Availability, availabilityInfoMap} from "../../model/availability";
import cx from "classnames";

// Not actually a list, currently only displays one at a time - oh well
export const AvailabilityList: React.FC<{
    availability: Availability;
    label: React.ReactNode;
    className?: string;
    showText: boolean;
    labelOnNewLine?: boolean;
}> = ({availability, label, className, showText, labelOnNewLine}) => {
    if (availability.length == 0) {
        return null;
    }

    return (
        <dl className={cx("text-lg", className)}>
            <dt className={`py-1 ${labelOnNewLine ?  "block w-full" : "mr-1"}`}>{label}</dt>
            <dd
                key={availability}
                className={`py-1`}
            >
                {showText && <span className="text-sm">{availabilityInfoMap[availability].friendlyName}</span>}
            </dd>
        </dl>
    );
};
