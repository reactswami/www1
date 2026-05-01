import { input } from './input';

describe('button theme', () => {
   it("should match the snapshot (button hasn't changed)", () => {
      expect(input).toMatchSnapshot();
   });
});
