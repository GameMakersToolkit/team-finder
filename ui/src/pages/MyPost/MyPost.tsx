import * as React from "react";
import { Button } from "../../components/Button";
import { useMyPostMutation, useMyPostQuery } from "../../queries/my-post";
import { useEnsureLoggedIn } from "../../utils/useEnsureLoggedIn";
import { AvailabilitySelector } from "../AvailabilitySelector";
import {allAvailabilities, Availability} from "../../model/availability";

interface FormState {
  title: string;
  description: string;
  availability: Availability;
}

// TODO: Expand this to store an object if multiple fields needed
const LAST_SELECTED_AVAILABILITY_CACHE_KEY = "last_selected_availability"

const commonStyling = "border-white border-2 bg-darkbg text-white w-full py-1 px-2 mt-4 "

export const MyPost: React.FC = () => {
  useEnsureLoggedIn();
  const myPostQuery = useMyPostQuery();

  const { mutate: save, isLoading: isSaving } = useMyPostMutation();

  const lastSelectedAvailability: Availability = localStorage.getItem(LAST_SELECTED_AVAILABILITY_CACHE_KEY) as Availability || allAvailabilities[0];

  const [formState, setFormState] = React.useState<FormState>({
    title: "",
    description: "",
    availability: lastSelectedAvailability,
  });

  React.useEffect(() => {
    if (myPostQuery.data) {
      const { title, description, availability } = myPostQuery.data;
      setFormState({ title, description, availability });

      // Manually update Availability, because the formState change doesn't call custom onChange method
      // We use localStorage to track the last selected option to minimise the visual jank of the field changing
      localStorage.setItem(LAST_SELECTED_AVAILABILITY_CACHE_KEY, availability)
    }
  }, [myPostQuery.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    save({
      languages: ["English"],
      skillsPossessed: [],
      skillsSought: [],
      preferredTools: [],
      timezoneStr: "America/Chicago",
      ...formState,
    });
  };

  const disabled = myPostQuery.isLoading || isSaving;

  return (
    <form
      className="container mx-auto max-w-screen-xxl p-1"
      onSubmit={handleSubmit}
    >
      {/* Title */}
      <label htmlFor="title" className="text-lg">
        Post title - put something short and catchy!
      </label>
      <input
          id="title"
          type="text"
          className={commonStyling + ""}
          disabled={disabled}
          value={formState.title}
          onChange={(e) =>
              setFormState((prev) => ({ ...prev, title: e.target.value }))
          }
      />

      {/* Description */}
      <label htmlFor="description" className="text-lg">
        Write a brief summary of what you&apos;re looking for that isn&apos;t covered by
        the rest of the form
      </label>
      <textarea
        id="description"
        rows={5}
        className={commonStyling + "min-h-[100px]"}
        disabled={disabled}
        value={formState.description}
        onChange={(e) =>
          setFormState((prev) => ({ ...prev, description: e.target.value }))
        }
      />

      {/* Availability */}
      <div className="mt-2">
        <label className="font-bold block" htmlFor="toolsFilter">
          How much time are you looking to spend?
        </label>
        <AvailabilitySelector
            id="availabilityFilter"
            allowMultiple={false}
            disabled={disabled}
            value={[formState.availability]}
            onChange={(availability) => setFormState((prev) => ({ ...prev, availability: availability[0] }))}
        />
      </div>

      {/* Submit */}
      <div className="flex mt-4 justify-end">
        <Button type="submit" variant="primary" disabled={disabled}>
          Save
        </Button>
      </div>
    </form>
  );
};
