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
            <div className="grid grid-cols-2 mb-16">
                <div className="grid grid-cols-2">
                    <div className="mb-4">
                        <h4 className="text-xl _text-center mb-2">Jam Theme</h4>
                        <FieldPair field={themeFields[1]} themeFields={themeFields} setThemeFields={setThemeFields} />
                        <FieldPair field={themeFields[2]} themeFields={themeFields} setThemeFields={setThemeFields} />
                    </div>
                    <div className="mb-4">
                        <h4 className="text-xl _text-center mb-2">Header/Footer</h4>
                        <FieldPair field={themeFields[3]} themeFields={themeFields} setThemeFields={setThemeFields} />
                        <FieldPair field={themeFields[4]} themeFields={themeFields} setThemeFields={setThemeFields} />
                    </div>
                    <div className="mb-4">
                        <h4 className="text-xl _text-center mb-2">General</h4>
                        <FieldPair field={themeFields[0]} themeFields={themeFields} setThemeFields={setThemeFields} />
                        <FieldPair field={themeFields[17]} themeFields={themeFields} setThemeFields={setThemeFields} />
                    </div>
                    <div className="mb-4">
                        <h4 className="text-xl _text-center mb-2">Countdown</h4>
                        <FieldPair field={themeFields[18]} themeFields={themeFields} setThemeFields={setThemeFields} />
                        <FieldPair field={themeFields[19]} themeFields={themeFields} setThemeFields={setThemeFields} />
                    </div>
                </div>
                <div className="">
                    <div className="px-8 m-auto h-full">
                        <div className="w-full h-[440px]">
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

const FieldPair = ({field, themeFields, setThemeFields}) => {
    return (
      <div className="flex flex-row justify-items-center gap-4 items-center mb-2">
          <BaseFieldLabel field={field}/>
          <BaseFieldColourInput
            field={field}
            themeFields={themeFields}
            setThemeFields={setThemeFields}
          />
      </div>
    )
}
