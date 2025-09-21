import React from 'react';
import {Onboarding} from '../../jamhome/components/Onboarding.tsx';
import {SiteIntro} from '../../jamhome/components/SiteIntro.tsx';
import { JamPreviewStyling } from "../../../common/components/JamPreviewStyling.tsx";

export const PreviewPage = () => {
    return (
        <JamPreviewStyling>
            <main>
                <Onboarding />
                <SiteIntro />
                <div className="h-[100px]">&nbsp;</div>
            </main>
        </JamPreviewStyling>
    )
}
