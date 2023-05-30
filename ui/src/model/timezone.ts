export const allTimezoneOffsets = [
  "UTC-12",
  "UTC-11",
  "UTC-10",
  "UTC-9",
  "UTC-8",
  "UTC-7",
  "UTC-6",
  "UTC-5",
  "UTC-4",
  "UTC-3",
  "UTC-2",
  "UTC-1",
  "UTC+0",
  "UTC+1",
  "UTC+2",
  "UTC+3",
  "UTC+4",
  "UTC+5",
  "UTC+6",
  "UTC+7",
  "UTC+8",
  "UTC+9",
  "UTC+10",
  "UTC+11",
  "UTC+12",
] as const;

export type TimezoneOffset = typeof allTimezoneOffsets[number];

export interface TimezoneOffsetInfo {
  value: number;
  label: string;
}

export const timezoneLabelFromInt = (int: number | string): string => {
  const key = timezoneOffsetFromInt(int)
  return timezoneOffsetInfoMap[key].label
}

export const timezoneOffsetFromInt = (int: number | string): string => {
  if (typeof int == "string") return int;
  return int < 0 ? `UTC${int}` : `UTC+${int}`;
}
export const timezoneOffsetToInt = (offset: string) => parseInt(offset.replace("UTC", "").replace("+", ""));

export const timezoneOffsetInfoMap: Record<TimezoneOffset, TimezoneOffsetInfo> = {
  "UTC-12": {
    value: -12,
    label: "UTC-12: US Minor Outlying Islands",
  },
  "UTC-11": {
    value: -11,
    label: "UTC-11: American Samoa",
  },
  "UTC-10": {
    value: -10,
    label: "UTC-10: Honolulu",
  },
  "UTC-9": {
    value: -9,
    label: "UTC-9: Alaska (Islands)",
  },
  "UTC-8": {
    value: -8,
    label: "UTC-8: Anchorage",
  },
  "UTC-7": {
    value: -7,
    label: "UTC-7: Los Angeles, Vancouver, Tijuana",
  },
  "UTC-6": {
    value: -6,
    label: "UTC-6: Denver, Mexico City, San José",
  },
  "UTC-5": {
    value: -5,
    label: "UTC-5: Chicago, Winnipeg",
  },
  "UTC-4": {
    value: -4,
    label: "UTC-4: New York, Toronto, Havana, Santiago",
  },
  "UTC-3": {
    value: -3,
    label: "UTC-3: Halifax, São Paulo, Buenos Aires",
  },
  "UTC-2": {
    value: -2,
    label: "UTC-2: Greenland, Fernando de Noronha",
  },
  "UTC-1": {
    value: -1,
    label: "UTC-1: Cape Verde, Greenland",
  },
  "UTC+0": {
    value: 0,
    label: "UTC+0: Azores",
  },
  "UTC+1": {
    value: 1,
    label: "UTC+1: London, Dublin, Lisbon",
  },
  "UTC+2": {
    value: 2,
    label: "UTC+2: Berlin, Rome, Paris, Madrid, Warsaw, Johannesburg",
  },
  "UTC+3": {
    value: 3,
    label: "UTC+3: Cairo, Kyiv, Bucharest, Athens, Moscow, Istanbul",
  },
  "UTC+4": {
    value: 4,
    label: "UTC+4: Dubai, Baku, Tbilisi, Yerevan",
  },
  "UTC+5": {
    value: 5,
    label: "UTC+5: Karachi, Tashkent, Yekaterinburg",
  },
  "UTC+6": {
    value: 6,
    label: "UTC+6: Dhaka, Almaty, Omsk",
  },
  "UTC+7": {
    value: 7,
    label: "UTC+7: Jakarta, Ho Chi Minh, Bangkok",
  },
  "UTC+8": {
    value: 8,
    label: "UTC+8: Shanghai, Kuala Lumpur, Singapore",
  },
  "UTC+9": {
    value: 9,
    label: "UTC+9: Tokyo, Seoul, Ambon",
  },
  "UTC+10": {
    value: 10,
    label: "UTC+10: Sydney, Port Moresby, Vladivostok",
  },
  "UTC+11": {
    value: 11,
    label: "UTC+11: Nouméa",
  },
  "UTC+12": {
    value: 12,
    label: "UTC+12: Auckland, Suva",
  },
};
