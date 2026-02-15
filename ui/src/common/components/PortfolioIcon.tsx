import React from "react";
import {ReactSVG} from "react-svg";

const icons: Record<string, any> = import.meta.glob("../../assets/icons/sites/*.svg", { eager: true });

const transparent = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
const Spacer = () => <img src={transparent} width={12} height={12} alt="" />;

export const PortfolioIcon: React.FC<{site: string}> = ({site}) => {
    return (
        <ReactSVG
            src={icons[`../../assets/icons/sites/${site}.svg`].default}
            loading={Spacer}
            fallback={Spacer}
            className="h-full w-full flex justify-center items-center icon--small"
        />
    )
}
