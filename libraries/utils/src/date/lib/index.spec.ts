import { convertSecondsToTimeString } from '.';

describe('convertSecondsToTimeString', () => {
   it('should return the right results', () => {
      const inputs = [123_123_123_123, 123_123_123, 123_123, 123, 3601, 0];

      const expectedResults = [
         '203576w 4d 3h',
         '203w 4d',
         '1d 10h 12m',
         '2m 3s',
         '1h 1s',
         '',
         '',
      ];

      for (const [index, input] of inputs.entries()) {
         expect(convertSecondsToTimeString(input)).toBe(expectedResults[index]);
      }
   });
});
