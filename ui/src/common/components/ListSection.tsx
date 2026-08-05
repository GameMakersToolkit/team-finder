import React from "react";
import { OptionsListDisplay } from "./OptionsListDisplay.tsx";
import { CustomSelectOption } from "../../pages/jamhome/components/common/CustomSelect.tsx";

export interface ListSectionProps {
  optionsToDisplay: string[];
  totalOptions: CustomSelectOption[];
  label: string;
  className: string;
  wrapperClassName?: string;
}

export const ListSection: React.FC<ListSectionProps> = ({
  optionsToDisplay,
  totalOptions,
  label,
  className,
  wrapperClassName,
}) => {
  const list = (
    <OptionsListDisplay
      optionsToDisplay={optionsToDisplay}
      totalOptions={totalOptions}
      label={label}
      className={className}
    />
  );

  return wrapperClassName ? <div className={wrapperClassName}>{list}</div> : list;
};
