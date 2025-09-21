import { ThemeField } from "./CommonFields.tsx";
import React, { useState } from "react";

export const BaseFieldColourInput: React.FC<{
    field: ThemeField,
    themeFields: ThemeField[],
    setThemeFields: (fields: ThemeField[]) => void,
    document: Document
}> = ({field, themeFields, setThemeFields, document}) => {

    const [colour, setColour] = useState(field.currentValue)

    return <input
        className="w-[48px]"
        type="color"
        name={field.name}
        style={{height: 48, width: 48}}
        value={colour}
        onChange={(value) => {
            setColour(value.target.value);

            themeFields.find(f => f.name === field.name)!.currentValue = value.target.value;
            setThemeFields([
              ...themeFields
            ])
        }}
    />
}
