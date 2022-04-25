import * as React from "react";
import { Button } from "../../components/Button";
import { useMyPostMutation, useMyPostQuery } from "../../queries/my-post";
import { useEnsureLoggedIn } from "../../utils/useEnsureLoggedIn";

interface FormState {
  description: string;
}

export const MyPost: React.FC = () => {
  useEnsureLoggedIn();
  const myPostQuery = useMyPostQuery();

  const { mutate: save, isLoading: isSaving } = useMyPostMutation();

  const [formState, setFormState] = React.useState<FormState>({
    description: "",
  });

  React.useEffect(() => {
    if (myPostQuery.data) {
      const { description } = myPostQuery.data;
      setFormState({ description });
    }
  }, [myPostQuery.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    save({
      title: "Testing",
      languages: "English",
      availability: "PART_TIME",
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
      <label htmlFor="description" className="text-lg">
        Write a brief summary of what you're looking for that isn't covered by
        the rest of the form
      </label>
      <textarea
        id="description"
        rows={5}
        className="border-white border-2 bg-darkbg w-full py-1 px-2 mt-4 min-h-[100px]"
        disabled={disabled}
        value={formState.description}
        onChange={(e) =>
          setFormState((prev) => ({ ...prev, description: e.target.value }))
        }
      />
      <div className="flex mt-4 justify-end">
        <Button type="submit" variant="primary" disabled={disabled}>
          Save
        </Button>
      </div>
    </form>
  );
};
