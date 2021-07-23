import { NUM_NEWLINES } from "./consts";

const newlineRegex = /\r?\n/g;

export const limitNewlines = (input: string): string => {
  let numNewlines = 0;
  return input.replace(newlineRegex, m => {
    if (numNewlines >= NUM_NEWLINES) return "";
    else {
      numNewlines++;
      return m;
    }
  });
};
