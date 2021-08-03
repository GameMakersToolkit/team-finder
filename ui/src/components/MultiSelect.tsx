import * as React from "react";
import { ReactSVG } from "react-svg";

const Selected: React.FC<{onClick: () => void}> = ({onClick, children}) => (
  <div
    className="flex mb-3 mr-5 leading-none cursor-pointer border-2 rounded border-gray-300 bg-gray-700"
    onClick={onClick}
  >
    <div className="px-2 pt-1 bg-red-700">
      <ReactSVG className="fill-white w-4" src="/trash-can.svg"/>
    </div>
    <div className="border-gray-400 border-l px-2.5 pt-1.5 pb-2">{children}</div>
  </div>
)

const Selectables: React.FC<{
  valueDisplayIndex: Record<string, string>;
  selectableValues: string[];
  placeholder: string;
  toggleValue: (s: string) => void;
}> = ({selectableValues, valueDisplayIndex, placeholder, toggleValue}) => {
  return (
    <select
      value=""
      onChange={e => toggleValue(e.target.value)}
      className="leading-none p-1 pb-1.5 outline-none w-full rounded bg-gray-700 border-2 border-transparent"
    >
      <option value="">{placeholder}</option>
      {selectableValues.map((p, i) =>
        (<option value={p} key={i}>{valueDisplayIndex[p]}</option>)
      )}
    </select>
  );
}

type Props = {
  disabled: boolean;
  valueDisplayIndex: Record<string, string>;
  selected: string[];
  placeholder: string;
  changeCallback: (selected: string[]) => unknown;
}
export const MultiSelect: React.FC<Props> = ({valueDisplayIndex, selected, placeholder, ...props}) => {

  const toggleValue = (value: string) => {
    if(props.disabled) return;

    let newvalues: string[];

    if(selected.includes(value)) newvalues = selected.filter(v => v != value);
    else newvalues = [...selected, value];

    props.changeCallback(newvalues);
  }

  const selectableValues = Object.keys(valueDisplayIndex).filter(p => !selected.includes(p));

  return (
    <div className="flex flex-wrap rounded border-white">
      <div className="flex flex-wrap flex-shrink-0 max-w-full">
        {selected.map((v, i) => (
          <Selected key={i} onClick={() => toggleValue(v)}>{valueDisplayIndex[v]}</Selected>
        ))}
      </div>
      <div className="flex-grow mb-3">
        <Selectables {...{valueDisplayIndex, selectableValues, placeholder, toggleValue}} />
      </div>
    </div>
  )
}