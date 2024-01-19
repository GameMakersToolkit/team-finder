import {CustomSelectOption} from "../../pages/home/components/common/CustomSelect.tsx";

export const timezones: CustomSelectOption[] = [
    // Disgusting hack to allow an isMulti=false CustomSelect to reset back to a 'placeholder'
    {
        value: undefined,
        label: "Select option(s)"
    },
    {
        value: "-12",
        label: "UTC-12: US Minor Outlying Islands",
    },
    {
        value: "-11",
        label: "UTC-11: American Samoa",
    },
    {
        value: "-10",
        label: "UTC-10: Honolulu",
    },
    {
        value: "-9",
        label: "UTC-9: Alaska (Islands)",
    },
    {
        value: "-8",
        label: "UTC-8: Anchorage",
    },
    {
        value: "-7",
        label: "UTC-7: Los Angeles, Vancouver, Tijuana",
    },
    {
        value: "-6",
        label: "UTC-6: Denver, Mexico City, San José",
    },
    {
        value: "-5",
        label: "UTC-5: Chicago, Winnipeg",
    },
    {
        value: "-4",
        label: "UTC-4: New York, Toronto, Havana, Santiago",
    },
    {
        value: "-3",
        label: "UTC-3: Halifax, São Paulo, Buenos Aires",
    },
    {
        value: "-2",
        label: "UTC-2: Greenland, Fernando de Noronha",
    },
    {
        value: "-1",
        label: "UTC-1: Cape Verde, Greenland",
    },
    {
        value: "0",
        label: "UTC+0: Azores",
    },
    {
        value: "1",
        label: "UTC+1: London, Dublin, Lisbon",
    },
    {
        value: "2",
        label: "UTC+2: Berlin, Rome, Paris, Madrid, Warsaw, Johannesburg",
    },
    {
        value: "3",
        label: "UTC+3: Cairo, Kyiv, Bucharest, Athens, Moscow, Istanbul",
    },
    {
        value: "4",
        label: "UTC+4: Dubai, Baku, Tbilisi, Yerevan",
    },
    {
        value: "5",
        label: "UTC+5: Karachi, Tashkent, Yekaterinburg",
    },
    {
        value: "6",
        label: "UTC+6: Dhaka, Almaty, Omsk",
    },
    {
        value: "7",
        label: "UTC+7: Jakarta, Ho Chi Minh, Bangkok",
    },
    {
        value: "8",
        label: "UTC+8: Shanghai, Kuala Lumpur, Singapore",
    },
    {
        value: "9",
        label: "UTC+9: Tokyo, Seoul, Ambon",
    },
    {
        value: "10",
        label: "UTC+10: Sydney, Port Moresby, Vladivostok",
    },
    {
        value: "11",
        label: "UTC+11: Nouméa",
    },
    {
        value: "12",
        label: "UTC+12: Auckland, Suva",
    },
];