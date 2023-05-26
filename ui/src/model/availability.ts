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
  MINIMAL:    {friendlyName: "Less than 4 hours per day"},
  PART_TIME:  {friendlyName: "4 hours per day"},
  FULL_TIME:  {friendlyName: "8 hours per day"},
  OVERTIME:   {friendlyName: "More than 8 hours per day"},
};
