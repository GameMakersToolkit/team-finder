import {CustomSelectOption} from "../../pages/home/components/common/CustomSelect.tsx";
import {ReactSVG} from "react-svg";

const skillIcons: Record<string, any> = import.meta.glob("../../assets/icons/skill/*.svg", { eager: true });

const transparent = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const Spacer = () => <img src={transparent} width={512} height={512} alt="" />;

export const skills: CustomSelectOption[] = [
    {
        value: "ART_2D",
        label: (<>{getSkillIcon("ART_2D")} 2D Art</>),
    },
    {
        value: "ART_3D",
        label: (<>{getSkillIcon("ART_3D")} 3D Art</>),
    },
    {
        value: "CODE",
        label: (<>{getSkillIcon("CODE")} Code</>),
    },
    {
        value: "DESIGN_PRODUCTION",
        label: (<>{getSkillIcon("DESIGN_PRODUCTION")} Design & Production</>),
    },
    {
        value: "OTHER",
        label: (<>{getSkillIcon("OTHER")} Other</>),
    },
    {
        value: "SFX",
        label: (<>{getSkillIcon("SFX")} SFX</>),
    },
    {
        value: "MUSIC",
        label: (<>{getSkillIcon("MUSIC")} Music</>),
    },
    {
        value: "TEAM_LEAD",
        label: (<>{getSkillIcon("TEAM_LEAD")} Team Lead</>),
    },
    {
        value: "TESTING_SUPPORT",
        label: (<>{getSkillIcon("TESTING_SUPPORT")} Testing & Support</>),
    },
];

function getSkillIcon(skill: string) {
    return <ReactSVG
        src={skillIcons[`../../assets/icons/skill/${skill}.svg`].default}
        title={skill}
        loading={Spacer}
        fallback={Spacer}
        style={{
            width: 20,
            height: 20,
        }}
    />
}

