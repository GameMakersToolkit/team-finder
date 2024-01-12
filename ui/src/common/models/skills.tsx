import {CustomSelectOption} from "../../pages/home/components/common/CustomSelect.tsx";
import {getOptionsListIcon} from "../utils/getOptionsListIcon.tsx";


export const skills: CustomSelectOption[] = [
    {
        value: "ART_2D",
        label: (<>{getOptionsListIcon("ART_2D", "skill")} 2D Art</>),
    },
    {
        value: "ART_3D",
        label: (<>{getOptionsListIcon("ART_3D", "skill")} 3D Art</>),
    },
    {
        value: "CODE",
        label: (<>{getOptionsListIcon("CODE", "skill")} Code</>),
    },
    {
        value: "DESIGN_PRODUCTION",
        label: (<>{getOptionsListIcon("DESIGN_PRODUCTION", "skill")} Design & Production</>),
    },
    {
        value: "OTHER",
        label: (<>{getOptionsListIcon("OTHER", "skill")} Other</>),
    },
    {
        value: "SFX",
        label: (<>{getOptionsListIcon("SFX", "skill")} SFX</>),
    },
    {
        value: "MUSIC",
        label: (<>{getOptionsListIcon("MUSIC", "skill")} Music</>),
    },
    {
        value: "TEAM_LEAD",
        label: (<>{getOptionsListIcon("TEAM_LEAD", "skill")} Team Lead</>),
    },
    {
        value: "TESTING_SUPPORT",
        label: (<>{getOptionsListIcon("TESTING_SUPPORT", "skill")} Testing & Support</>),
    },
];
