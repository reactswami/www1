export function createDateString(date: Date) {
   return date.toDateString() + ' ' + date.toTimeString().split(' ')[0];
}
