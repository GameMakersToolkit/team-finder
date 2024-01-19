export const removeEmpty = (obj: object) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => !!v && v.length > 0));
}