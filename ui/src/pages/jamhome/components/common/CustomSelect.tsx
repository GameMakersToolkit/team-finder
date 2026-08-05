/**
 * Black box for a React multi-select
 *
 * Taken straight from https://codesandbox.io/s/formik-react-select-multi-typescript-qsrj2?file=/src/CustomSelect.tsx
 */

import {FieldProps} from "formik";
import Select, { OnChangeValue, StylesConfig } from "react-select";
import {ReactNode} from "react";

export type OptionsType<OptionType> = OptionType[];
export type ValueType<OptionType> = OptionType | OptionsType<OptionType> | null | undefined;


export interface CustomSelectOption {
    label: ReactNode;
    value: string | number | undefined;
}

interface CustomSelectProps extends FieldProps {
    id?: string;
    options: OptionsType<CustomSelectOption>;
    isMulti?: boolean;
    className?: string;
    placeholder?: string;
}

const styles: StylesConfig<CustomSelectOption, boolean> = {
    control: (baseStyles) => ({
        ...baseStyles,
        borderRadius: '0.75rem',
        borderColor: '#ffffff'
    }),
    option: (baseStyles) => {
        return {
            ...baseStyles,
            color: '#DD0',
        };
    },
};

export const CustomSelect = ({
     id,
     className,
     placeholder,
     field,
     form,
     options,
     isMulti = false
 }: CustomSelectProps) => {
    const onChange = (option: OnChangeValue<CustomSelectOption, boolean>) => {
        form.setFieldValue(
            field.name,
            isMulti
                ? (option as readonly CustomSelectOption[]).map((item: CustomSelectOption) => item.value)
                : (option as CustomSelectOption | null)?.value
        );
    };

    const getValue = () => {
        if (options) {
            return isMulti
                ? options.filter(option => field?.value?.indexOf(option.value) >= 0)
                : options.find(option => option.value === field.value);
        } else {
            return isMulti ? [] : null;
        }
    };

    return (
        <Select
            id={id}
            className={className}
            classNamePrefix="dropdown"
            name={field.name}
            value={getValue()}
            onChange={onChange}
            placeholder={placeholder}
            options={options}
            isMulti={isMulti}
            styles={styles}
        />
    );
};

export default CustomSelect;
