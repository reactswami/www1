/**
 * Notifier is a small useful for debugging
 * It might grow to a proper logger/notification system but for now it allows you to debug easily without shipping the console.log to production...
 */
export const notifier = {
   error: (str: string) => (import.meta.env.PROD ? null : console.error(str)),
};
