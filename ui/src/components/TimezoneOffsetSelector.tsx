import * as React from "react";
import { StyledSelector } from "./StyledSelector/StyledSelector";
import { allTimezoneOffsets, TimezoneOffset, timezoneOffsetInfoMap } from "../model/timezone";

interface Props {
  value: TimezoneOffset[];
  onChange: (value: TimezoneOffset[]) => void;
  id?: string;
  disabled?: boolean;
}

interface Option {
  value: TimezoneOffset;
  label: React.ReactNode;
}

const options = allTimezoneOffsets.map((it) => ({
  value: it,
  label: (
    <span className="flex items-center">
      <span>{timezoneOffsetInfoMap[it].label}</span>
    </span>
  ),
}));

// This is all errors but still works, I have no idea why
const optionsMap = Object.fromEntries(
  options.map((it) => [it.value, it])
) as Record<TimezoneOffset, Option>;


export function TimezoneOffsetSelector({ id, value, onChange, disabled }: Props) : React.ReactElement {
  return (
    <>
      {/* Force selected value to be readable; default styling uses very low-contrast text for single value selections */}
      {!disabled && <style dangerouslySetInnerHTML={{__html: `.react-select__single-value {color: white!important;}`}} />}
      <StyledSelector
        id={id}
        isDisabled={disabled}
        isMulti={true}
        options={options}
        value={value.map((it) => optionsMap[it])}
        onChange={(newValue) => onChange(newValue.map((it) => it.value))}
      />
    </>
  )
}