import * as React from "react";
import { Button } from "../../components/Button";
import { useMyPostQuery } from "../../queries/my-post";
import { useEnsureLoggedIn } from "../../utils/useEnsureLoggedIn";

export const MyPost: React.FC = () => {
  useEnsureLoggedIn();
  const myPostQuery = useMyPostQuery();

  // summary
  // description
  // skillsPossessed
  // skillsSought
  // preferredTools
  // availability
  // timezoneStr
  // languages

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

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
        className="border-white border-2 bg-darkbg w-full py-1 px-2 mt-4"
      />
      <div className="flex mt-4 justify-end">
        <Button type="submit" variant="primary">
          Save
        </Button>
      </div>
    </form>
  );
};
