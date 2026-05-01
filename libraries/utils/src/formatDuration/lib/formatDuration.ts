/**
 * Convert duration into human readable format
 * It will turn duration to xx years yy months zz days hh hours mm minutes ss seconds
 * @example formatDuration(31536000) //1 year(s)
 * @example formatDuration(30) // 30 second(s)
 * @example formatDuration(19230) // 5 hours 20 minute(s) 30 second(s)
 * @example formatDuration(1747230) // 20 day(s) 5 hours 20 minute(s) 30 second(s)
 *
 * @param duration seconds elapsed between two time frames
 * @returns readable string
 */
export function formatDuration(duration: number) {
   if (duration <= 0) {
      return '0 second(s)';
   }
   const minuteInSeconds = 60;
   const hourInSeconds = 60 * minuteInSeconds;
   const dayInSeconds = hourInSeconds * 24;
   const monthsInSeconds = dayInSeconds * 30;
   const yearsInSeconds = dayInSeconds * 365;

   const durationtimeFactors: { timeFactor: number; label: string }[] = [
      { timeFactor: yearsInSeconds, label: 'year(s)' },
      { timeFactor: monthsInSeconds, label: 'month(s)' },
      { timeFactor: dayInSeconds, label: 'day(s)' },
      { timeFactor: hourInSeconds, label: 'hour(s)' },
      { timeFactor: minuteInSeconds, label: 'minute(s)' },
   ];

   let elapsedTime = '';
   let durationTemp = duration;

   durationtimeFactors.forEach(({ timeFactor, label }) => {
      if (durationTemp >= timeFactor) {
         // Get the actual unit of times elapsed
         const unitTime = Math.floor(durationTemp / timeFactor);
         elapsedTime = `${elapsedTime} ${unitTime} ${label}`;
         // Get the remaining duration using mod
         durationTemp = durationTemp % timeFactor;
      }
   });

   if (durationTemp > 0) {
      elapsedTime = `${elapsedTime} ${durationTemp} seconds`;
   }

   return elapsedTime.trim();
}
