import * as React from "react";
import cx from "classnames";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary";
}

export const Button: React.FC<Props> = ({
  children,
  className,
  variant = "default",
  ...props
}) => {
  return (
    <button
      className={cx(
        "py-2 px-8 shadow-md text-lg",
        {
          "bg-lightbg-highlight hover:bg-lightbg": variant === "default",
          "bg-primary-highlight hover:bg-primary text-darkbg": variant === "primary",
          "opacity-50": props.disabled,
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
