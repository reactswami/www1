/**
 * Convert seconds into readable string, useful for table.
 * Will turn seconds into the following format '1w 2d 3h'.
 * It will only return the first 3 matchers, for example if weeks are displayed, then it will stop at hours. For days, it will only display up to minutes.
 * @example convertSecondsToTimeString(123_123) //1d 10h 12m
 *
 * @param seconds number of seconds
 * @returns readable string
 */
export const convertSecondsToTimeString = (seconds: number) => {
   const SECONDS_IN_A_WEEK = 604800;
   const SECONDS_IN_A_DAY = 86400;
   const SECONDS_IN_A_HOUR = 3600;
   const SECONDS_IN_A_MINUTE = 60;

   let remainingSeconds = seconds;
   let timeString = '';

   const weeks = Math.floor(remainingSeconds / SECONDS_IN_A_WEEK);
   remainingSeconds = remainingSeconds % SECONDS_IN_A_WEEK;
   timeString += weeks > 0 ? `${weeks}w ` : '';

   const days = Math.floor(remainingSeconds / SECONDS_IN_A_DAY);
   remainingSeconds = remainingSeconds % SECONDS_IN_A_DAY;
   timeString += days > 0 ? `${days}d ` : '';

   const hours = Math.floor(remainingSeconds / SECONDS_IN_A_HOUR);
   remainingSeconds = remainingSeconds % SECONDS_IN_A_HOUR;
   timeString += hours > 0 ? `${hours}h ` : '';
   if (weeks > 0) {
      return timeString.trim();
   }

   const minutes = Math.floor(remainingSeconds / SECONDS_IN_A_MINUTE);
   remainingSeconds = remainingSeconds % SECONDS_IN_A_MINUTE;
   timeString += minutes > 0 ? `${minutes}m ` : '';
   if (days > 0) {
      return timeString.trim();
   }

   timeString += remainingSeconds > 0 ? `${remainingSeconds}s` : '';

   return timeString.trim();
};
