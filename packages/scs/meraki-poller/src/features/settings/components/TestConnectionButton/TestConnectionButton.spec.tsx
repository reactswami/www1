import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TestConnectionButton } from './TestConnectionButton';
import { server } from '~/test/server/node';
import { silenceConsole, testWrapper } from '~/test/utils';

describe('TestConnectionButton', () => {
   it('should render', () => {
      expect(() => render(<TestConnectionButton />, testWrapper)).not.toThrow();
   });

   it('should display a success message if the connection is successful', async () => {
      const user = userEvent.setup();
      render(<TestConnectionButton />, testWrapper);

      await user.click(screen.getByRole('button', { name: /test/i }));

      await waitFor(() =>
         expect(
            screen.getByRole('button', { name: /success/i })
         ).toBeInTheDocument()
      );
   });

   it('should display an error message if the connection is successful', async () => {
      silenceConsole();
      server.close();
      const user = userEvent.setup();
      render(<TestConnectionButton />, testWrapper);

      await user.click(screen.getByRole('button', { name: /test/i }));

      await waitFor(() =>
         expect(
            screen.getByRole('button', { name: /error/i })
         ).toBeInTheDocument()
      );
   });
});
