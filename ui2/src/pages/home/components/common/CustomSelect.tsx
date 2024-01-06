/**
 * Black box for a React multi-select
 *
 * Taken straight from https://codesandbox.io/s/formik-react-select-multi-typescript-qsrj2?file=/src/CustomSelect.tsx
 */

import {FieldProps} from "formik";
import Select from "react-select";
import {ReactNode} from "react";

export type OptionsType<OptionType> = OptionType[];
export type ValueType<OptionType> = OptionType | OptionsType<OptionType> | null | undefined;


export interface CustomSelectOption {
    label: ReactNode;
    value: string;
}

interface CustomSelectProps extends FieldProps {
    options: OptionsType<CustomSelectOption>;
    isMulti?: boolean;
    className?: string;
    placeholder?: string;
}

export const CustomSelect = ({
     className,
     placeholder,
     field,
     form,
     options,
     isMulti = false
 }: CustomSelectProps) => {
    const onChange = (option: ValueType<CustomSelectOption | CustomSelectOption[]>) => {
        form.setFieldValue(
            field.name,
            isMulti
                ? (option as CustomSelectOption[]).map((item: CustomSelectOption) => item.value)
                : (option as CustomSelectOption).value
        );
    };

    const getValue = () => {
        if (options) {
            return isMulti
                ? options.filter(option => field?.value?.indexOf(option.value) >= 0)
                : options.find(option => option.value === field.value);
        } else {
            return isMulti ? [] : ("" as any);
        }
    };

    return (
        <Select
            className={`styled-selector ${className}`}
            name={field.name}
            value={getValue()}
            onChange={onChange}
            placeholder={placeholder}
            options={options}
            isMulti={isMulti}
        />
    );
};

export default CustomSelect;
