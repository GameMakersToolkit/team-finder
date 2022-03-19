import * as React from "react";
import cx from "classnames";

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className, ...props }) => {
  return (
    <button
      className={cx(
        "bg-lightbg hover:bg-lightbg-highlight py-2 px-8 shadow-md text-lg",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
