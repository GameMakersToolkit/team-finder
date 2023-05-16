import { importMetaEnv } from "./importMeta";

// Set the date we're counting down to
const jamStartDate = new Date(importMetaEnv().VITE_JAM_START);

export const getCountdownComponents = (time: number) => {
  // Find the distance between now and the countdown date
  const distance = jamStartDate.getTime() - time;

  // Time calculations for days, hours, minutes and seconds
  const weeks =   Math.floor(distance / (1000 * 60 * 60 * 24 * 7));
  const days =    Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours =   Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return {weeks, days, hours, minutes, seconds};
}