import React from 'react';
import {JamSpecificStyling} from '../../../common/components/JamSpecificStyling.tsx';
import {Onboarding} from '../../jamhome/components/Onboarding.tsx';
import {SiteIntro} from '../../jamhome/components/SiteIntro.tsx';

export const PreviewPage = () => {
    return (
        <JamSpecificStyling>
            <main>
                <Onboarding />
                <SiteIntro />
                <div className="h-[100px]">&nbsp;</div>
            </main>
        </JamSpecificStyling>
    )
}