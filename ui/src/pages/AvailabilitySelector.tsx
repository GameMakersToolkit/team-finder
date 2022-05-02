import * as React from "react";
import { allAvailabilities, Availability, availabilityInfoMap } from "../model/availability";
import {useEffect, useState} from "react";

interface Props {
  value: Availability[];
  onChange: (value: Availability[]) => void;
  id?: string;
}

const options = allAvailabilities.map((it) => ({
  value: it,
  label: availabilityInfoMap[it].friendlyName
}));

export function AvailabilitySelector({ id, value, onChange }: Props): React.ReactElement {
    const [selected, updateSelected] = useState(value)

    useEffect(() => onChange(selected), [selected]) // onChange deliberately excluded

    /**
     * Toggle whether the selected Availability option is active in the search
     * @param availability
     */
    const toggleAvailability = (availability: Availability) => {
        if (selected.includes(availability)) {
            // Remove selected option from array
            updateSelected(selected.filter(a => a != availability))
        } else {
            updateSelected([...selected, availability])
        }
    }

  return (
    <>
      <div id={id}>
        {options.map(option => (
            <input
                key={option.value}
                type="button"
                value={option.label}
                className={`rounded border text-white w-full p-2 mr-2 mb-2 ${selected.includes(option.value) ? "bg-primary" : "bg-lightbg"}`}
                data-availability={option.value}
                onClick={() => toggleAvailability(option.value)}
            />
        ))}
      </div>
    </>
  );
}
