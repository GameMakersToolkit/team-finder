import React from "react";

export const ViewOptions: React.FC<{
  showSkillText: boolean;
  setShowSkillText: (b: boolean) => void;
}> = ({showSkillText, setShowSkillText}) => {
  return (
    <>
      <h3>View Options</h3>
      <button
        onClick={() => setShowSkillText(!showSkillText)}
        className={`rounded border text-white p-2 mr-2 mb-2 w-full sm:w-fit ${showSkillText ? "bg-primary" : "bg-lightbg"}`}
      >
        Show skill names
      </button>
    </>
  )
}