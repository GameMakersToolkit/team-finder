import {CustomSelectOption} from "../../pages/home/components/common/CustomSelect.tsx";
import {getOptionsListIcon} from "../utils/getOptionsListIcon.tsx";

export const tools: CustomSelectOption[] = [
    {
        value: "UNITY",
        label: (<>{getOptionsListIcon("UNITY", "tool")} Unity</>),
    },
    {
        value: "CONSTRUCT",
        label: (<>{getOptionsListIcon("CONSTRUCT", "tool")} Construct</>),
    },
    {
        value: "GAME_MAKER_STUDIO",
        label: (<>{getOptionsListIcon("GAME_MAKER_STUDIO", "tool")} Game Maker</>),
    },
    {
        value: "GODOT",
        label: (<>{getOptionsListIcon("GODOT", "tool")} Godot</>),
    },
    {
        value: "TWINE",
        label: (<>{getOptionsListIcon("TWINE", "tool")} Twine</>),
    },
    {
        value: "BITSY",
        label: (<>{getOptionsListIcon("BITSY", "tool")} Bitsy</>),
    },
    {
        value: "UNREAL",
        label: (<>{getOptionsListIcon("UNREAL", "tool")} Unreal</>),
    },
    {
        value: "RPG_MAKER",
        label: (<>{getOptionsListIcon("RPG_MAKER", "tool")} RPG Maker</>),
    },
    {
        value: "PICO_8",
        label: (<>{getOptionsListIcon("PICO_8", "tool")} PICO-8</>),
    },
    {
        value: "OTHER",
        label: (<>{getOptionsListIcon("UNKNOWN", "tool")} Other/Not listed</>),
    },
];


