import { formatDuration } from './formatDuration';

describe('Test format duration method', () => {
   it('when given 0 duration is should return 0', () => {
      const duration = formatDuration(0);

      expect(duration).toBe('0 second(s)');
   });

   it('formatDuration(31536000) //1 year(s)', () => {
      const duration = formatDuration(31536000);

      expect(duration).toBe('1 year(s)');
   });

   it('formatDuration(5 * 31536000) //5 year(s)', () => {
      const duration = formatDuration(5 * 31536000);

      expect(duration).toBe('5 year(s)');
   });

   it('formatDuration(30) // 30 seconds', () => {
      const duration = formatDuration(30);

      expect(duration).toBe('30 seconds');
   });

   it('formatDuration(59) // 59 seconds', () => {
      const duration = formatDuration(59);

      expect(duration).toBe('59 seconds');
   });

   it('formatDuration(60) // 1 Minutes', () => {
      const duration = formatDuration(60);
      expect(duration).toBe('1 minute(s)');
   });

   it('formatDuration(24*60*60) // 1 day', () => {
      const duration = formatDuration(24 * 60 * 60);
      expect(duration).toBe('1 day(s)');
   });

   it('formatDuration(24*60*60-1) // 23 hour(s) 59 minute(s) 59 seconds', () => {
      const duration = formatDuration(24 * 60 * 60 - 1);
      expect(duration).toBe('23 hour(s) 59 minute(s) 59 seconds');
   });

   it('formatDuration(30*24*60*60) // 1 month', () => {
      const duration = formatDuration(30 * 24 * 60 * 60);
      expect(duration).toBe('1 month(s)');
   });

   it('formatDuration(30*24*60*60-1) // 29 day(s)  23 hour(s)  59 minute(s) 59 seconds', () => {
      const duration = formatDuration(30 * 24 * 60 * 60 - 1);
      expect(duration).toBe('29 day(s) 23 hour(s) 59 minute(s) 59 seconds');
   });

   it('formatDuration(19230) // 5 hour(s) 20 minute(s) 30 seconds', () => {
      const duration = formatDuration(19230);

      expect(duration).toBe('5 hour(s) 20 minute(s) 30 seconds');
   });

   it(' formatDuration(1747230) // 20 day(s) 5 hour(s) 20 minute(s) 30 seconds', () => {
      const duration = formatDuration(1747230);

      expect(duration).toBe('20 day(s) 5 hour(s) 20 minute(s) 30 seconds');
   });
});
