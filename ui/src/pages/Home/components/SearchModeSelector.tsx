import * as React from "react";

const allSearchModes = [
  "and",
  "or",
] as const;

export type SearchMode = typeof allSearchModes[number];

interface Props {
  value: SearchMode;
  onChange: (value: SearchMode) => void;
  id?: string;
  className?: string;
}

const getLabel = (mode: SearchMode) => {
  return mode == "and"
    ? "Show results with all of these skills"
    : "Show results with any of these skills";
}

export function SearchModeSelector({
  id,
  value,
  onChange,
  className
}: Props): React.ReactElement {
  /**
   * Toggle whether the selected Availability option is active in the search
   * @param availability
   */
  return (
    <>
      <div id={id}>
        {allSearchModes.map((option: SearchMode) => (
          <input
            key={option}
            type="button"
            role="checkbox"
            aria-checked={value == option}
            value={getLabel(option)}
            className={className + ` rounded border text-white cursor-pointer p-2 mr-2 mb-2 w-full sm:w-fit hover:bg-primary-highlight ${
              value == option ? "bg-primary" : "bg-lightbg"
            }`}
            data-search-mode={option}
            onClick={() => onChange(option)}
          />
        ))}
      </div>
    </>
  );
}
