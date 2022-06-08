import * as React from "react";
import {Tool, toolInfoMap} from "../model/tool";
import cx from "classnames";
import {ToolIcon} from "./ToolIcon";

export const ToolList: React.FC<{
    tools: Tool[];
    label: React.ReactNode;
    className?: string;
    showText: boolean;
    labelOnNewLine?: boolean;
}> = ({tools, label, className, showText, labelOnNewLine}) => {
    if (tools.length == 0) {
        return null;
    }

    return (
        <dl className={cx("flex gap-1 flex-wrap text-lg", className)}>
            <dt className={`py-1 ${labelOnNewLine ?  "block w-full" : "mr-1"}`}>{label}</dt>
            {tools.map((tool) => {
                const info = toolInfoMap[tool];
                return (
                    <dd
                        key={tool}
                        className={`py-1 border-2 border-[color:var(--tool-color)] flex items-center ${showText ? "px-2 sm:px-1" : "px-1"}`}
                    >
                        <ToolIcon
                            tool={tool}
                            className={`w-5 text-[color:var(--tool-color)] ${showText && "mr-1"}`}
                            aria-hidden={true}
                        />
                        {showText && <span className="text-sm">{info.friendlyName}</span>}
                    </dd>
                );
            })}
        </dl>
    );
};
