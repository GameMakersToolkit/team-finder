import { CustomSelectOption } from "../../pages/jamhome/components/common/CustomSelect.tsx";

export const availability: CustomSelectOption[] = [
  {
    value: "UNSURE",
    label: "Not sure/haven't decided"
  },
  {
    value: "MINIMAL",
    label: "Less than 4 hours per day"
  },
  {
    value: "PART_TIME",
    label: "4 hours per day"
  },
  {
    value: "FULL_TIME",
    label: "8 hours per day"
  },
  {
    value: "OVERTIME",
    label: "More than 8 hours per day"
  },
];
