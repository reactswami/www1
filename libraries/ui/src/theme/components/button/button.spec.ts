import { button } from './button';

describe('button theme', () => {
   it("should match the snapshot (button hasn't changed)", () => {
      expect(button).toMatchSnapshot();
   });
});
