import {CustomSelectOption} from "../../pages/home/components/common/CustomSelect.tsx";
import {ReactSVG} from "react-svg";

const toolIcons: Record<string, any> = import.meta.glob("../../assets/icons/tool/*.svg", { eager: true });

const transparent = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const Spacer = () => <img src={transparent} width={512} height={512} alt="" />;

export const tools: CustomSelectOption[] = [
    {
        value: "UNITY",
        label: (<>{getToolIcon("UNITY")} Unity</>),
    },
    {
        value: "CONSTRUCT",
        label: (<>{getToolIcon("CONSTRUCT")} Construct</>),
    },
    {
        value: "GAME MAKER",
        label: (<>{getToolIcon("GAME_MAKER_STUDIO")} Game Maker</>),
    },
    {
        value: "GODOT",
        label: (<>{getToolIcon("GODOT")} Godot</>),
    },
    {
        value: "TWINE",
        label: (<>{getToolIcon("TWINE")} Twine</>),
    },
    {
        value: "BITSY",
        label: (<>{getToolIcon("BITSY")} Bitsy</>),
    },
    {
        value: "UNREAL",
        label: (<>{getToolIcon("UNREAL")} Unreal</>),
    },
    {
        value: "RPG MAKER",
        label: (<>{getToolIcon("RPG_MAKER")} RPG Maker</>),
    },
    {
        value: "PICO-8",
        label: (<>{getToolIcon("PICO_8")} PICO-8</>),
    },
];


function getToolIcon(tool: string) {
    return <ReactSVG
        src={toolIcons[`../../assets/icons/tool/${tool}.svg`].default}
        title={tool}
        loading={Spacer}
        fallback={Spacer}
        style={{
            width: 20,
            height: 20,
        }}
    />
}
