import {render} from "@testing-library/react";
import { NetworkExplorer } from './NetworkExplorer';
import { testWrapper } from '~/test/utils';

describe('NetworkExplorer', () => {
   it('should render', () => {
      expect(() =>
         render(<NetworkExplorer />, testWrapper)
      ).not.toThrow();
   });
});
