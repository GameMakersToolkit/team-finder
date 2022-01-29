import * as React from "react";
import classnames from "classnames";

export const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className, ...props }) => (
  <button
    className={classnames(
      "block text-trueWhite bg-primary-dark py-2 px-4 focus:outline-none focus-visible:outline-none focus-visible:ring focus-visible:ring-primary active:opacity-75 disabled:opacity-25",
      className
    )}
    {...props}
  >
    {children}
  </button>
);
