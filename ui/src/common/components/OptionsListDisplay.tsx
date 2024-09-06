import * as React from "react";
import {CustomSelectOption} from "../../pages/jamhome/components/common/CustomSelect.tsx";

export const OptionsListDisplay: React.FC<{
    optionsToDisplay: string[];
    totalOptions: CustomSelectOption[];
    label: React.ReactNode;
    className?: string;
}> = ({optionsToDisplay, totalOptions, label, className}) => {
    if (optionsToDisplay.length == 0) {
        return null;
    }

    // Ensure consistency in display order
    optionsToDisplay.sort()

    return (
        <dl className={"c-options-list-display " + className}>
            <dt className="c-options-list-display__label">{label}</dt>
            {optionsToDisplay.map((option) => {
                const info = totalOptions.filter(s => s.value == option)[0];
                return (
                    <dd key={option} className="c-options-list-display__pill border-[color:var(--skill-color)] bg-[color:var(--skill-color)] text-[color:var(--skill-text-color)] fill-[color:var(--skill-text-color)]">
                        <span className="flex text-xs gap-[4px]">{info?.label || "?"}</span>
                    </dd>
                );
            })}
        </dl>
    );
};
