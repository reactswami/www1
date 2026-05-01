import { render, screen } from '@testing-library/react';

import { PageNotFound } from './PageNotFound';

describe('PageNotFound', () => {
   it('should render successfully', () => {
      render(<PageNotFound />);
      expect(screen.getByText(/not.+found/i)).toBeInTheDocument();
   });
});
