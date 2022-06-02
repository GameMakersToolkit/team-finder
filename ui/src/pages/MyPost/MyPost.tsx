import * as React from "react";
import { Button } from "../../components/Button";
import { useDeleteMyPostMutation, useMyPostMutation, useMyPostQuery } from "../../queries/my-post";
import { useEnsureLoggedIn } from "../../utils/useEnsureLoggedIn";
import { AvailabilitySelector } from "../AvailabilitySelector";
import { allAvailabilities, Availability } from "../../model/availability";
import { SkillSelector } from "../SkillSelector";
import { Skill } from "../../model/skill";
import { ToolSelector } from "../ToolSelector";
import { Tool } from "../../model/tool";
import { useUserInfo } from "../../queries/userInfo";
import { IncorrectPermsSetModal } from "./IncorrectPermsSetModal";
import { LanguageSelector } from "../LanguageSelector";
import { Language } from "../../model/language";
import { TimezoneOffsetSelector} from "../../components/TimezoneOffsetSelector";
import { TimezoneOffset, timezoneOffsetFromInt } from "../../model/timezone";
import { useAuth } from "../../utils/AuthContext";

interface FormState {
  title: string;
  description: string;
  size: number;
  skillsPossessed: Skill[];
  skillsSought: Skill[];
  languages: Language[];
  preferredTools: Tool[];
  availability: Availability;
  timezoneOffsets: TimezoneOffset[];
}

const commonStyling =
  "border-white border-2 bg-black text-white w-full py-1 px-2 mt-4 ";

export const MyPost: React.FC = () => {
  useEnsureLoggedIn();
  const auth = useAuth();
  const myPostQuery = useMyPostQuery();
  const userInfo = useUserInfo();

  const { mutate: save, isLoading: isSaving } = useMyPostMutation();
  const deletePostMutation = useDeleteMyPostMutation();

  const [formState, setFormState] = React.useState<FormState>({
    title: "",
    description: "",
    size: 1,
    skillsPossessed: [],
    skillsSought: [],
    languages: ["en"],
    preferredTools: [],
    availability: allAvailabilities[0],
    timezoneOffsets: ["UTC+0"] as TimezoneOffset[],
  });

  React.useEffect(() => {
    if (myPostQuery.data) {
      const {
        title,
        description,
        size,
        skillsPossessed,
        skillsSought,
        languages,
        preferredTools,
        availability,
        timezoneOffsets,
      } = myPostQuery.data;
      setFormState({
        title,
        description,
        size,
        skillsPossessed,
        skillsSought,
        languages,
        preferredTools,
        availability,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        timezoneOffsets: timezoneOffsets.map(int => timezoneOffsetFromInt(int)),
      });
    }
  }, [myPostQuery.data]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    save(formState);
  };

  const disabled = !auth || myPostQuery.isLoading || isSaving || formState.timezoneOffsets.length == 0;

  return (
    <>
      {(userInfo.data?.hasContactPermsSet == false) && <IncorrectPermsSetModal isModalOpen={true} />}

    <form
      className="container mx-auto max-w-screen-xxl p-1 pb-6"
      onSubmit={handleSubmit}
    >
      <h1 className="text-3xl my-4">{myPostQuery?.data ? `Edit Your Post` : `Create New Post`}</h1>

      {/* Title */}
      <label htmlFor="title" className="text-lg">
        Post title - put something short and catchy!
      </label>
      <input
        id="title"
        type="text"
        required={true}
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
      <br />
      <small>{2000 - formState.description.length} characters remaining</small>
      <textarea
        id="description"
        maxLength="2000"
        rows={5}
        required={true}
        className={commonStyling + "min-h-[100px]"}
        disabled={disabled}
        value={formState.description}
        onChange={(e) =>
          setFormState((prev) => ({ ...prev, description: e.target.value }))
        }
      />

      {/* Size */}
      <label htmlFor="size" className="text-lg inline-block w-[75%]">
        How many people (including you) are currently working together?
      </label>
      <input
        id="size"
        type="number"
        className={commonStyling + " inline-block w-[25%]"}
        disabled={disabled}
        value={formState.size}
        min="1"
        max="20"
        onChange={(e) => {
            if (e.target.value !== "" && parseInt(e.target.value) < 1) return;
            setFormState((prev) => ({...prev, size: parseInt(e.target.value)}))
          }
        }
      />

      {/* Skills possessed */}
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2">
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

        {/* Language(s) */}
        <div className="mt-2">
          <label className="font-bold block" htmlFor="toolsFilter">
            What languages do you speak?
          </label>
          <LanguageSelector
            id="languagesFilter"
            value={formState.languages}
            onChange={(languages) =>
              setFormState((prev) => ({
                ...prev,
                languages: languages,
              }))
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
      </div>


      {/* Timezone */}
      <div className="mt-2">
        <label className="font-bold block" htmlFor="toolsFilter">
          What timezone are you based in?<br/>
          <span className="text-xs">
            Timezone is an optional way for other participants to find people who will be awake/online at roughly
            the same of day.
          </span>
        </label>
        <TimezoneOffsetSelector
          id="timezoneOffsets"
          value={myPostQuery.isFetched ? formState.timezoneOffsets : []}
          onChange={(timezoneOffsets) =>
           setFormState((prev) => ({
             ...prev,
             timezoneOffsets: timezoneOffsets,
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

      <div className={`flex ${myPostQuery?.data ? "justify-between" : "justify-end"}`}>
        {/* Delete */}
        <div className="flex mt-4">
          {myPostQuery?.data && (
            // TODO: Add visual cues for deleting (throbber, disabled etc)
            <Button
              style={{ backgroundColor: "red" }}
              type="button"
              variant="default"
              disabled={disabled}
              onClick={() => {
                deletePostMutation.mutate({ id: myPostQuery.data!.id })
              }}
            >
              Delete Post
            </Button>
            )}
        </div>

        {/* Submit */}
        <div className="flex mt-4">
          <Button type="submit" variant="primary" disabled={disabled} style={{color: "white"}}>
            Save Post
          </Button>
        </div>
      </div>
    </form>
    </>
  );
};
