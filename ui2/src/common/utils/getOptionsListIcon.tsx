import {ReactSVG} from "react-svg";

const toolIcons: Record<string, any> = import.meta.glob("../../assets/icons/tool/*.svg", { eager: true });
const skillIcons: Record<string, any> = import.meta.glob("../../assets/icons/skill/*.svg", { eager: true });

const transparent = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const Spacer = () => <img src={transparent} width={512} height={512} alt="" />;

export const getOptionsListIcon = (name: string, iconType: string) => {

    const iconRecord = iconType == "skill"
        ? skillIcons[`../../assets/icons/skill/${name}.svg`]
        : toolIcons[`../../assets/icons/tool/${name}.svg`]

    return <ReactSVG
        src={iconRecord.default}
        title={name}
        loading={Spacer}
        fallback={Spacer}
        wrapper={"span"}
        style={{
            width: 20,
            height: 20,
        }}
    />
}
