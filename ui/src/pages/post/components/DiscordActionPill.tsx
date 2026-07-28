import React from "react";

const pillBaseClass = "mb-6 px-6 py-2 rounded-xl inline-flex";
const filledClass = "border-[var(--theme-accent-light)] bg-[var(--theme-accent-light)] text-grey-900 font-bold cursor-pointer";
const outlineClass = "border border-[var(--theme-accent-light)] text-[var(--theme-accent-light)] cursor-pointer";

type DiscordActionPillProps = {
    children: React.ReactNode,
    variant?: "filled" | "outline",
}

export const DiscordActionPill: React.FC<DiscordActionPillProps> = ({ children, variant = "filled" }) => {
    const variantClass = variant === "filled" ? filledClass : outlineClass;
    return <span className={`${pillBaseClass} ${variantClass}`}>{children}</span>;
};
