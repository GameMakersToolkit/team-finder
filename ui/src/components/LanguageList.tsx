import * as React from "react";
import {Language, languageInfoMap} from "../model/language";
import cx from "classnames";

export const LanguageList: React.FC<{
    languages: Language[];
    label: React.ReactNode;
    className?: string;
    showText: boolean
}> = ({languages, label, className, showText}) => {
    if (languages.length == 0) {
        return null;
    }

    return (
        <dl className={cx("flex gap-1 flex-wrap text-lg", className)}>
            <dt className={`py-1 ${showText ? "mr-1" : "block w-full sm:w-fit"}`}>{label}</dt>
            {languages.map((language) => {
                const info = languageInfoMap[language];
                return (
                    <dd
                        key={language}
                        className={`py-1 border-2 border-[color:var(--language-color)] flex items-center ${showText ? "px-2 sm:px-1" : "px-1"}`}
                    >
                        {showText && <span className="text-sm">{info.friendlyName}</span>}
                    </dd>
                );
            })}
        </dl>
    );
};
