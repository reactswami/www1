import { render, screen, waitFor } from '@testing-library/react';

import { Loader } from './index';

describe('Loader', () => {
   it('should not visible to start with', () => {
      render(<Loader />);
      expect(screen.queryByRole('heading', { name: /loading/i })).toBeNull();
   });

   it('should be visibile after a certain time', async () => {
      render(<Loader />);
      await waitFor(() => {
         expect(
            screen.queryByRole('heading', { name: /loading/i })
         ).not.toBeNull();
      });
   });
});
