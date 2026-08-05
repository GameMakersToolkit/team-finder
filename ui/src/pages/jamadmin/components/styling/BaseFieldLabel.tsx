import { ThemeField } from "./CommonFields.tsx";
import type React from "react";

export const BaseFieldLabel: React.FC<{ field: ThemeField }> = ({field}) => {
    return <label className="w-[180px]" htmlFor={field.name}>{field.description}</label>
}
