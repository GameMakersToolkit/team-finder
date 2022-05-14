import * as React from "react";
import { Button } from "../../components/Button";
import { useMyPostMutation, useMyPostQuery } from "../../queries/my-post";
import { useEnsureLoggedIn } from "../../utils/useEnsureLoggedIn";
import { AvailabilitySelector } from "../AvailabilitySelector";
import { allAvailabilities, Availability } from "../../model/availability";
import { SkillSelector } from "../SkillSelector";
import { Skill } from "../../model/skill";
import { ToolSelector } from "../ToolSelector";
import { Tool } from "../../model/tool";
import { useUserInfo } from "../../queries/userInfo";
import { IncorrectPermsSetModal } from "./IncorrectPermsSetModal";

interface FormState {
  title: string;
  description: string;
  skillsPossessed: Skill[];
  skillsSought: Skill[];
  preferredTools: Tool[];
  availability: Availability;
}

const commonStyling =
  "border-white border-2 bg-darkbg text-white w-full py-1 px-2 mt-4 ";

export const MyPost: React.FC = () => {
  useEnsureLoggedIn();
  const myPostQuery = useMyPostQuery();
  const userInfo = useUserInfo();

  const { mutate: save, isLoading: isSaving } = useMyPostMutation();

  const [formState, setFormState] = React.useState<FormState>({
    title: "",
    description: "",
    skillsPossessed: [],
    skillsSought: [],
    preferredTools: [],
    availability: allAvailabilities[0],
  });

  React.useEffect(() => {
    if (myPostQuery.data) {
      const {
        title,
        description,
        skillsPossessed,
        skillsSought,
        preferredTools,
        availability,
      } = myPostQuery.data;
      setFormState({
        title,
        description,
        skillsPossessed,
        skillsSought,
        preferredTools,
        availability,
      });
    }
  }, [myPostQuery.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    save({
      languages: ["English"],
      timezoneStr: "America/Chicago",
      ...formState,
    });
  };

  const disabled = myPostQuery.isLoading || isSaving;

  return (
    <>
      {(userInfo.data?.hasContactPermsSet == false) && <IncorrectPermsSetModal isModalOpen={true} />}

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
        Write a brief summary of what you&apos;re looking for that isn&apos;t
        covered by the rest of the form
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

      {/* Skills possessed */}
      <div className="mt-2">
        <label className="font-bold block" htmlFor="skillsPossessedFilter">
          What skills do you have?
        </label>
        <SkillSelector
          id="skillsPossessedFilter"
          value={formState.skillsPossessed}
          onChange={(skillsPossessed) =>
            setFormState((prev) => ({
              ...prev,
              skillsPossessed: skillsPossessed,
            }))
          }
        />
      </div>

      {/* Skills sought */}
      <div className="mt-2">
        <label className="font-bold block" htmlFor="skillsSoughtFilter">
          What skills are you looking for?
        </label>
        <SkillSelector
          id="skillsSoughtFilter"
          value={formState.skillsSought}
          onChange={(skillsSought) =>
            setFormState((prev) => ({ ...prev, skillsSought: skillsSought }))
          }
        />
      </div>

      {/* Tools */}
      <div className="mt-2">
        <label className="font-bold block" htmlFor="toolsFilter">
          What tools do you want to work with?
        </label>
        <ToolSelector
          id="toolsFilter"
          value={formState.preferredTools}
          onChange={(preferredTools) =>
            setFormState((prev) => ({
              ...prev,
              preferredTools: preferredTools,
            }))
          }
        />
      </div>

      {/* Availability */}
      <div className="mt-2">
        <label className="font-bold block" htmlFor="toolsFilter">
          How much time are you looking to spend?
        </label>
        <AvailabilitySelector
          id="availabilityFilter"
          allowMultiple={false}
          disabled={disabled}
          // Don't have anything selected while loading the form
          // to avoid visual jank
          value={myPostQuery.isFetched ? [formState.availability] : []}
          onChange={(availability) =>
            setFormState((prev) => ({ ...prev, availability: availability[0] }))
          }
        />
      </div>

      {/* Submit */}
      <div className="flex mt-4 justify-end">
        <Button type="submit" variant="primary" disabled={disabled}>
          Save
        </Button>
      </div>
    </form>
    </>
  );
};
