import { render } from '@testing-library/react';
import { EditNetworkCustomRule } from './EditNetworkCustomRule';
import { testWrapper } from '~/test/utils';

describe('EditNetworkCustomRule', () => {
   it('should render', async () => {
      expect(() =>
         render(<EditNetworkCustomRule />, testWrapper)
      ).not.toThrow();
   });
});
