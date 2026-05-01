import { theme } from './theme';

describe('theme', () => {
   it("should match the snapshot (theme haven't changed)", () => {
      expect(theme).toMatchSnapshot();
   });
});
