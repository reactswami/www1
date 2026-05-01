import { borderRadius } from './borderRadius';

describe('border radius', () => {
   it("should match the snapshot (border radii haven't changed)", () => {
      expect(borderRadius).toMatchSnapshot();
   });
});
