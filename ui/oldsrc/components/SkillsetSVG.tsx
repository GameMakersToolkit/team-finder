import * as React from "react";
import { ReactSVG, Props as ReactSVGProps } from "react-svg";

const transparent = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const Spacer = () => <img src={transparent} width={512} height={512} alt="" />;

interface Props extends Omit<ReactSVGProps, "ref"> {
  skillsetId: string;
}
export const SkillsetSVG: React.FC<Props> = ({ skillsetId, ...props }) => (
  <ReactSVG {...props} src={`/SkillsetIcons/${skillsetId}.svg`} loading={Spacer} fallback={Spacer} />
);
