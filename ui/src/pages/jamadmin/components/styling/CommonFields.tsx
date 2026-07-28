import React, {useContext, useEffect, useState} from 'react';
import { JamSpecificContext } from "../../../../common/components/JamSpecificStyling.tsx";
import { Jam } from "../../../../common/models/jam.ts";
import {BaseFieldLabel} from './BaseFieldLabel.tsx';
import {BaseFieldColourInput} from './BaseFieldColourInput.tsx';
import { getPreviewCacheKey } from "../../../../common/components/JamPreviewStyling.tsx";

export type ThemeField = {
    name: string,
    description: string,
    currentValue: string
}

type CommonFieldsProps = {
    themeFields: ThemeField[],
    setThemeFields: (themeFields: ThemeField[]) => void,
}

const fieldSections: { title: string, indices: number[] }[] = [
    { title: "Jam Theme", indices: [1, 2] },
    { title: "Header/Footer", indices: [3, 4] },
    { title: "General", indices: [0, 17] },
    { title: "Countdown", indices: [18, 19] },
]

export const CommonFields: React.FC<CommonFieldsProps> = ({themeFields, setThemeFields}) => {
    const theme = useContext(JamSpecificContext)
    const [iframeState, setIframeState] = useState<number>(0)

    useEffect(() => {
        const previewThemeCacheKey = getPreviewCacheKey(theme.jamId);
        const styles = {...(theme.styles ?? {})}
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
                    {fieldSections.map(section => (
                        <div className="mb-4" key={section.title}>
                            <h4 className="text-xl _text-center mb-2">{section.title}</h4>
                            {section.indices.map(index => (
                                <FieldPair
                                    key={themeFields[index].name}
                                    field={themeFields[index]}
                                    themeFields={themeFields}
                                    setThemeFields={setThemeFields}
                                />
                            ))}
                        </div>
                    ))}
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

const FieldPair: React.FC<{field: ThemeField, themeFields: ThemeField[], setThemeFields: (themeFields: ThemeField[]) => void}> = ({field, themeFields, setThemeFields}) => {
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
