import * as React from "react";
import {CustomSelectOption} from "../../pages/home/components/common/CustomSelect.tsx";

export const OptionsListDisplay: React.FC<{
    optionsToDisplay: string[];
    totalOptions: CustomSelectOption[];
    label: React.ReactNode;
    className?: string;
}> = ({optionsToDisplay, totalOptions, label, className}) => {
    if (optionsToDisplay.length == 0) {
        return null;
    }

    return (
        <dl className={"flex gap-[8px] flex-wrap self-baseline items-baseline text-lg " + className}>
            <dt className={`self-center mr-1`}>{label}</dt>
            {optionsToDisplay.map((option) => {
                const info = totalOptions.filter(s => s.value == option)[0];
                return (
                    <dd
                        key={option}
                        className={`py-1 border-2 border-[color:var(--skill-color)] bg-[color:var(--skill-color)] rounded-xl flex items-center px-2 sm:px-1}`}
                    >
                        <span className="flex text-sm">{info?.label || "?"}</span>
                    </dd>
                );
            })}
        </dl>
    );
};
