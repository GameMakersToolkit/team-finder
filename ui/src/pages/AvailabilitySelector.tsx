import * as React from "react";
import {
  allAvailabilities,
  Availability,
  availabilityInfoMap,
} from "../model/availability";

interface Props {
  value: Availability[];
  onChange: (value: Availability[]) => void;
  id?: string;
  disabled?: boolean;
  allowMultiple: boolean;
}

const options = allAvailabilities.map((it) => ({
  value: it,
  label: availabilityInfoMap[it].friendlyName,
}));

export function AvailabilitySelector({
  id,
  value,
  disabled,
  allowMultiple,
  onChange,
}: Props): React.ReactElement {
  /**
   * Toggle whether the selected Availability option is active in the search
   * @param availability
   */
  const toggleAvailability = (availability: Availability) => {
    if (!allowMultiple) {
      onChange([availability]);
      return;
    }

    if (value.includes(availability)) {
      // Remove selected option from array
      onChange(value.filter((a) => a != availability));
    } else {
      onChange([...value, availability]);
    }
  };

  return (
    <>
      <div id={id}>
        {options.map((option) => (
          <input
            key={option.value}
            type="button"
            role="checkbox"
            aria-checked={value.includes(option.value)}
            value={option.label}
            disabled={disabled}
            className={`rounded-2xl text-white text-sm cursor-pointer px-2 py-1 mr-2 mb-2 w-full sm:w-fit hover:bg-primary-highlight ${
              value.includes(option.value) ? "bg-primary" : "bg-lightbg"
            }`}
            data-availability={option.value}
            onClick={() => toggleAvailability(option.value)}
          />
        ))}
      </div>
    </>
  );
}
