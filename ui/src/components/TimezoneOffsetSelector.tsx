import * as React from "react";
import {useEffect, useState} from "react";
import {allTools, Tool, toolInfoMap} from "../model/tool";
import {StyledSelector} from "./StyledSelector/StyledSelector";
import {ToolIcon} from "./ToolIcon";
import {allTimezoneOffsets, TimezoneOffset, timezoneOffsetInfoMap} from "../model/timezone";

interface Props {
  value: TimezoneOffset;
  onChange: (value: TimezoneOffset) => void;
  id?: string;
  disabled?: boolean;
}

interface Option {
  value: TimezoneOffset;
  label: React.ReactNode;
}

const options = allTimezoneOffsets.map((it) => ({
  offset: it,
  value: timezoneOffsetInfoMap[it].value,
  label: (
    <span className="flex items-center">
      <span>{timezoneOffsetInfoMap[it].label}</span>
    </span>
  ),
}));

// This is all errors but still works, I have no idea why
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Cannot implicitly cast from [k:string] to a TimezoneOffset, apparently
const optionsMap = Object.fromEntries(
  options.map((it) => [it.offset, it])
) as Record<TimezoneOffset, Option>;


export function TimezoneOffsetSelector({ id, value, onChange, disabled }: Props) : React.ReactElement {
  return (
    <>
      {/* Force selected value to be readable; default styling uses very low-contrast text for single value selections */}
      {!disabled && <style dangerouslySetInnerHTML={{__html: `.react-select__single-value {color: white!important;}`}} />}
      <StyledSelector
        id={id}
        isDisabled={disabled}
        isMulti={false}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore Suppress weird-but-working Number <-> TimezoneOffset jank
        options={options}
        value={optionsMap[value]}
        onChange={(newValue) => onChange((newValue!.value))}
      />
    </>
  )
}