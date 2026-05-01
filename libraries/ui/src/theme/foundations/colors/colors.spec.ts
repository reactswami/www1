import { colors } from './colors';

describe('colors', () => {
   it("should match the snapshot (colors haven't changed)", () => {
      expect(colors).toMatchSnapshot();
   });
});
