import ReactSelect from "react-select/creatable";
import React from "react";
import { FieldInputProps, FormikProps } from "formik";

interface SelectOption {
  label: string;
  value: string;
}

interface ReactSelectFormikProps {
  field: FieldInputProps<string[]>;
  form: FormikProps<Record<string, unknown>>;
}

export const ReactSelectFormik: React.FC<ReactSelectFormikProps> = ({ field, form }) => {
  const value = (field.value || []).map((v: string) => ({ label: v, value: v }));
  return (
    <ReactSelect
      isMulti
      value={value}
      onChange={(selected) => {
        const options = (selected ?? []) as SelectOption[];
        form.setFieldValue(field.name, options.map((opt) => opt.value));
      }}
      onBlur={field.onBlur}
      options={[]}
      formatCreateLabel={(inputValue) => `Add: ${inputValue}`}
    />
  );
};
