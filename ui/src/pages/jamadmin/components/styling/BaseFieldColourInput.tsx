import { ThemeField } from "./CommonFields.tsx";
import React, { useState } from "react";

export const BaseFieldColourInput: React.FC<{
    field: ThemeField,
    themeFields: ThemeField[],
    setThemeFields: (fields: ThemeField[]) => void,
}> = ({field, themeFields, setThemeFields}) => {

    const [colour, setColour] = useState(field.currentValue)

    return <input
        className="w-[48px]"
        type="color"
        name={field.name}
        style={{height: 36, width: 36}}
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
