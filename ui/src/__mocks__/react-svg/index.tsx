import * as React from "react";
import type { Props } from "react-svg";

export const ReactSVG: React.FC<Props> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { loading, fallback, ...remainingProps } = props;
  return <svg {...remainingProps} />;
};
