export const allAvailabilities = [
  "MINIMAL",
  "PART_TIME",
  "FULL_TIME",
  "OVERTIME"
] as const;

export type Availability = typeof allAvailabilities[number];

export const isAvailability = (input: string): input is Availability =>
  (allAvailabilities as readonly string[]).includes(input);

export interface AvailabilityInfo {
  friendlyName: string;
}

export const availabilityInfoMap: Record<Availability, AvailabilityInfo> = {
  MINIMAL:    {friendlyName: "A few hours"},
  PART_TIME:  {friendlyName: "Up to four hours a day"},
  FULL_TIME:  {friendlyName: "Up to eight hours a day"},
  OVERTIME:   {friendlyName: "As much time as I can spare"},
};
