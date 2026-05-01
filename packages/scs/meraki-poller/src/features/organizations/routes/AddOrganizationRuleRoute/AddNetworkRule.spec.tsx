import { render } from '@testing-library/react';
import { AddOrganizationRule } from './AddOrganizationRule';
import { testWrapper } from '~/test/utils';

describe('AddNetworkRule', () => {
   it('should render', () => {
      expect(() => render(<AddOrganizationRule />, testWrapper)).not.toThrow();
   });
});
