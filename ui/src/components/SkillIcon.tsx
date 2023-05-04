import * as React from "react";
import { ReactSVG, Props as ReactSVGProps } from "react-svg";
import { Skill, skillInfoMap } from "../model/skill";

const transparent =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const Spacer = () => <img src={transparent} width={512} height={512} alt="" />;

interface Props extends Pick<ReactSVGProps, "aria-hidden" | "className"> {
  skill: Skill;
}

export const SkillIcon = ({ skill, ...props}: Props) => (
    <ReactSVG
        {...props}
        src={skillInfoMap[skill].icon}
        title={skillInfoMap[skill].friendlyName}
        loading={Spacer}
        fallback={Spacer}
    />
)

// export const SkillIcon: React.FC<Props> = ({ skill, ...props }) => (
//   <ReactSVG
//     {...props}
//     src={skillInfoMap[skill].icon}
//     title={skillInfoMap[skill].friendlyName}
//     loading={Spacer}
//     fallback={Spacer}
//   />
// );
