import React, {useContext, useEffect, useState} from 'react';
import {JamSpecificContext} from '../../../../common/components/JamSpecificStyling.tsx';
import {BaseFieldLabel} from './BaseFieldLabel.tsx';
import {BaseFieldColourInput} from './BaseFieldColourInput.tsx';

export const CommonFields = () => {
    const theme = useContext(JamSpecificContext)
    const [iframeStateRef, setIframeStateRef] = useState<Document>()

    useEffect(() => {
        setIframeStateRef((document.getElementById("preview-page") as HTMLIFrameElement)!!.contentWindow!!.document)
    }, [])

    const themeFields = [
        {name: "--theme-background", description: "Background colour of the entire site"},
        {name: "--theme-primary", description: "Primary colour of your jam page"},
        {name: "--theme-accent", description: "Accent colour of your jame page"},
        {
            name: "--theme-tile-bg",
            description: "Background colour for each post tile (in case your background colour clashes)"
        },
        {
            name: "--gradient-start",
            description: "The starting (outside edge) colour of the gradient at the top/bottom of the site"
        },
        {
            name: "--gradient-end",
            description: "The ending (inside edge) colour of the gradient at the top/bottom of the site"
        },
    ]

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
                                    initialValue={theme.styles[field.name] || "#FFFFFF"}
                                    document={iframeStateRef}
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
