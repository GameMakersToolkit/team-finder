import React from "react";
import {ReactSVG} from "react-svg";

const icons: Record<string, any> = import.meta.glob("../../assets/icons/team-sizes/*.svg", { eager: true });

const transparent = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const Spacer = () => <img src={transparent} width={512} height={512} alt="" />;

export const TeamSizeIcon: React.FC<{size: number}> = ({size}) => {
    const clampedSize = Math.min(Math.max(size, 1), 3);

    return (
        <ReactSVG
            src={icons[`../../assets/icons/team-sizes/${clampedSize}.svg`].default}
            loading={Spacer}
            fallback={Spacer}
            style={{
                width: 28,
                height: 28,
            }}
            className="inline-block mr-4"
        />
    )
}
