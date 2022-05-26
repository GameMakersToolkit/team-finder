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

export const timezoneOffsetFromInt = (int: number | string) => int < 0 ? `UTC${int}` : `UTC+${int}`;
export const timezoneOffsetToInt = (offset: string) => parseInt(offset.replace("UTC", "").replace("+", ""));

export const timezoneOffsetInfoMap: Record<TimezoneOffset, TimezoneOffsetInfo> = {
  "UTC-12": {
    value: -12,
    label: "UTC-12: United States Minor Outlying Islands",
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
    label: "UTC-9: Anchorage",
  },
  "UTC-8": {
    value: -8,
    label: "UTC-8: Los Angeles, Vancouver, Tijuana",
  },
  "UTC-7": {
    value: -7,
    label: "UTC-7: Denver, Edmonton, Ciudad Juárez",
  },
  "UTC-6": {
    value: -6,
    label: "UTC-6: Mexico City, Chicago, Winnipeg, San José",
  },
  "UTC-5": {
    value: -5,
    label: "UTC-5: New York, Toronto, Havana, Kingston",
  },
  "UTC-4": {
    value: -4,
    label: "UTC-4: Santiago, Manaus, Caracas, Halifax",
  },
  "UTC-3": {
    value: -3,
    label: "UTC-3: São Paulo, Buenos Aires, Montevideo",
  },
  "UTC-2": {
    value: -2,
    label: "UTC-2: Fernando de Noronha, South Georgia and the South Sandwich Islands",
  },
  "UTC-1": {
    value: -1,
    label: "UTC-1: Cape Verde, Greenland, Azores",
  },
  "UTC+0": {
    value: 0,
    label: "UTC+0: London, Dublin, Lisbon",
  },
  "UTC+1": {
    value: 1,
    label: "UTC+1:  Berlin, Rome, Paris, Madrid, Warsaw",
  },
  "UTC+2": {
    value: 2,
    label: "UTC+2: Cairo, Johannesburg, Khartoum, Kyiv, Bucharest, Athens, Jerusalem, Sofia",
  },
  "UTC+3": {
    value: 3,
    label: "UTC+3: Moscow, Istanbul, Riyadh, Baghdad, Addis Ababa",
  },
  "UTC+4": {
    value: 4,
    label: "UTC+4: Dubai, Baku, Tbilisi, Yerevan, Samara",
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
    label: "UTC+7: Jakarta, Ho Chi Minh City, Bangkok, Krasnoyarsk",
  },
  "UTC+8": {
    value: 8,
    label: "UTC+8: Shanghai, Taipei, Kuala Lumpur, Singapore, Perth",
  },
  "UTC+9": {
    value: 9,
    label: "UTC+9: Tokyo, Seoul, Ambon, Chita",
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
    label: "UTC+12: Auckland, Suva, Petropavlovsk-Kamchatsky",
  },
};
