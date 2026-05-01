import { render } from '@testing-library/react';
import { OrganizationTableRoute } from './OrganizationTableRoute';
import { testWrapper } from '~/test/utils';

describe('NetworkExplorer', () => {
   it('should render', () => {
      expect(() =>
         render(<OrganizationTableRoute />, testWrapper)
      ).not.toThrow();
   });
});
