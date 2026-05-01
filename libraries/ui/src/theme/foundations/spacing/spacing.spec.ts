import { getSpacing, spacing } from './spacing';

describe('spacing', () => {
   it("should match the snapshot (spacing haven't changed)", () => {
      expect(spacing).toMatchSnapshot();
   });

   it('should return the spacing xxs when calling getSpacing with "xxs"', () => {
      expect(getSpacing('xxs')).toBe(spacing['xxs' as unknown as number]);
   });
});
