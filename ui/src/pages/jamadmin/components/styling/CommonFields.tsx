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

export const CommonFields = () => {
    const theme = useContext(JamSpecificContext)
    const [iframeStateRef, setIframeStateRef] = useState<Document>()
    const [iframeState, setIframeState] = useState<number>(0)
    const [themeFields, setThemeFields] = useState(getThemeFields(theme))

    useEffect(() => {
        setIframeStateRef((document.getElementById("preview-page") as HTMLIFrameElement)!!.contentWindow!!.document)
    }, [])

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
                    <form>
                        {themeFields.map(field => (
                            <div className="flex justify-around mb-4">
                                <BaseFieldLabel field={field}/>
                                <BaseFieldColourInput
                                    field={field}
                                    themeFields={themeFields}
                                    setThemeFields={setThemeFields}
                                    document={iframeStateRef!}
                                />
                            </div>
                        ))}
                    </form>
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

function getThemeFields(theme: Jam): ThemeField[] {
    return [
        {
            name: "--theme-background",
            description: "Background colour of the entire site",
            currentValue: theme.styles["--theme-background"],
        },
        {
            name: "--theme-primary",
            description: "Primary colour of your jam page",
            currentValue: theme.styles["--theme-primary"],
        },
        {
            name: "--theme-accent",
            description: "Accent colour of your jame page",
            currentValue: theme.styles["--theme-accent"],
        },
        {
            name: "--theme-tile-bg",
            description: "Background colour for each post tile (in case your background colour clashes)",
            currentValue: theme.styles["--theme-tile-bg"],
        },
        {
            name: "--gradient-start",
            description: "The starting (outside edge) colour of the gradient at the top/bottom of the site",
            currentValue: theme.styles["--gradient-start"],
        },
        {
            name: "--gradient-end",
            description: "The ending (inside edge) colour of the gradient at the top/bottom of the site",
            currentValue: theme.styles["--gradient-end"],
        },
    ];
}
