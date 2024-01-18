import * as React from "react";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "primary";
}

export const Button: React.FC<Props> = ({
    children,
    className,
    variant = "default",
    ...props
}) => {
    let classes = "py-2 px-8 shadow-md text-lg"
    if (variant === "default") classes += "bg-lightbg-highlight hover:bg-lightbg"
    if (variant === "primary") classes += "bg-primary-highlight hover:bg-primary text-darkbg"
    if (props.disabled) classes += "opacity-50"

    return (
        <button
            className={classes + " " + className}
            {...props}
        >
            {children}
        </button>
    );
};
