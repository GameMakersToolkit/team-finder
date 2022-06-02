import React from "react";

export const ViewOptions: React.FC<{
  showSkillText: boolean;
  setShowSkillText: (b: boolean) => void;
}> = ({showSkillText, setShowSkillText}) => {
  return (
    <>
      <h3>View Options</h3>

      <span className="mb-2 block sm:inline md:inline lg:inline">
        <input
          id="show-skill-names-checkbox"
          type="checkbox"
          onChange={() => setShowSkillText(!showSkillText)}
          checked={showSkillText}
          className={`mr-2`}
        />
        <label
          className="w-full"
          htmlFor="show-skill-names-checkbox"
        >
          Show skill names
        </label>
      </span>
    </>
  )
}