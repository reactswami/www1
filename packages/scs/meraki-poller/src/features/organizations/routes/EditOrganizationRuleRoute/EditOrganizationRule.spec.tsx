import { render } from '@testing-library/react';
import { EditOrganizationRule } from './EditOrganizationRule';
import { testWrapper } from '~/test/utils';

describe('EditOrganisationRule', () => {
   it('should render', async () => {
      expect(() => render(<EditOrganizationRule />, testWrapper)).not.toThrow();
   });
});
