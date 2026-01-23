import React, {useContext, useEffect, useState} from 'react';
import { Jam, JamSpecificContext } from "../../../../common/components/JamSpecificStyling.tsx";
import {BaseFieldLabel} from './BaseFieldLabel.tsx';
import {BaseFieldColourInput} from './BaseFieldColourInput.tsx';
import { getPreviewCacheKey } from "../../../../common/components/JamPreviewStyling.tsx";

export type ThemeField = {
    name: string,
    description: string,
    currentValue: string
}

export const CommonFields = ({themeFields, setThemeFields}) => {
    const theme = useContext(JamSpecificContext)
    const [iframeState, setIframeState] = useState<number>(0)

    useEffect(() => {
        const previewThemeCacheKey = getPreviewCacheKey(theme.jamId);
        const styles = {}
        themeFields.forEach(field => styles[field.name] = field.currentValue)
        const previewTheme: Jam = {...theme, styles: styles} as Jam
        localStorage.setItem(previewThemeCacheKey, JSON.stringify(previewTheme))
        setIframeState(Math.random());
    }, [themeFields])

    return (
        <>
            <h3 className="text-2xl text-center mb-4">Common / Site-wide styles</h3>
            <div className="flex justify-center mb-32">
                <div className="w-[33%]">
                    {themeFields.filter(f => f.ctx == "common").map(field => (
                        <div className="flex justify-around mb-4">
                            <BaseFieldLabel field={field}/>
                            <BaseFieldColourInput
                                field={field}
                                themeFields={themeFields}
                                setThemeFields={setThemeFields}
                            />
                        </div>
                    ))}
                </div>
                <div className="w-[66%]">
                    <div className="px-8 m-auto h-full">
                        <div className="w-full h-full">
                            <iframe
                                id="preview-page"
                                key={iframeState}
                                src={`/${theme.jamId}/admin/styling/preview-page`}
                                className="w-[200%] h-[200%]"
                                style={{
                                    transform: "scale(0.5)",
                                    transformOrigin: "0 0"
                                }}
                            >
                            </iframe>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
