import * as React from "react";
import { ReactSVG, Props as ReactSVGProps } from "react-svg";
import { Tool, toolInfoMap } from "../model/tool";

const transparent =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const Spacer = () => <img src={transparent} width={512} height={512} alt="" />;

interface Props extends Omit<ReactSVGProps, "ref"> {
  tool: Tool;
}
export const ToolIcon: React.FC<Props> = ({ tool, ...props }) => (
  <ReactSVG
    {...props}
    src={toolInfoMap[tool].icon}
    loading={Spacer}
    fallback={Spacer}
    style={{
      width: 20,
      height: 20,
    }}
  />
);
