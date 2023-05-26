import React from "react";
import './ViewOptions.css';

export const ViewOptions: React.FC<{
  showSkillText: boolean;
  setShowSkillText: (b: boolean) => void;
}> = ({showSkillText, setShowSkillText}) => {
  return (
    <>
      <h3 className="font-bold">Display Options</h3>

      <div className="mb-2 block">
        <label
          className="switch mr-2"
          htmlFor="show-skill-names-checkbox"
        >
          <input
            id="show-skill-names-checkbox"
            type="checkbox"
            onChange={() => setShowSkillText(!showSkillText)}
            checked={showSkillText}
            className={`mr-2`}
          />
          <span className="slider round"></span>
        </label>

        <span>Display skill names</span>
      </div>
    </>
  )
}