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
          "bg-lightbg hover:bg-lightbg-highlight": variant === "default",
          "bg-primary hover:bg-primary-highlight text-darkbg": variant === "primary",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
