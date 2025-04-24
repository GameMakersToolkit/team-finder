import {DateTime} from 'luxon';

export const removeEmpty = (obj: object) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => !!v && v.length > 0));
}

export const getDefaultLanguage = () => new Intl.Locale(navigator.language).language || "en";

export const getDefaultTimezoneOffset = () => Math.floor(DateTime.local().offset / 60).toString();
