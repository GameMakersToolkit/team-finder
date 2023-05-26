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
}

const getLabel = (mode: SearchMode) => {
  return mode == "and"
    ? "Only results with all skills"
    : "Results for any skills";
}

export function SearchModeSelector({
  id,
  value,
  onChange
}: Props): React.ReactElement {
  /**
   * Toggle whether the selected Availability option is active in the search
   * @param availability
   */
  return (
    <>
      <div id={id}>
        {allSearchModes.map((option: SearchMode) => (
          <div>
              <input
                id={`${id}-${option}`}
                name={id}
                key={option}
                type="radio"
                role="radio"
                aria-checked={value == option}
                className={`text-white cursor-pointer p-2 mr-2 mb-2 `}
                data-search-mode={option}
                onClick={() => onChange(option)}
              />
              <label
                htmlFor={`${id}-${option}`}
                value={option}
                className={`text-white cursor-pointer p-2 mr-2 mb-2 w-full sm:w-fit`}
                data-search-mode={option}
              >
                {getLabel(option)}
              </label>
          </div>
        ))}
      </div>
    </>
  );
}
