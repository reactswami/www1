import { typography } from './typography';

describe('typography', () => {
   it("should match the snapshot (typography haven't changed)", () => {
      expect(typography).toMatchSnapshot();
   });
});
