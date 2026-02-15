import ReactSelect from "react-select/creatable";
import React from "react";

export const ReactSelectFormik = ({ field, form }: any) => {
  const value = (field.value || []).map((v: string) => ({ label: v, value: v }));
  return (
    <ReactSelect
      isMulti
      placeholder="Add itch.io profile or game links"
      value={value}
      onChange={selected => {
        form.setFieldValue(field.name, selected ? selected.map((opt: any) => opt.value) : []);
      }}
      onBlur={field.onBlur}
      options={[]}
      formatCreateLabel={inputValue => `Add: ${inputValue}`}
    />
  );
};
