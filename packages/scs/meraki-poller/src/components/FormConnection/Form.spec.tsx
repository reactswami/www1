import {
   render,
   screen,
   waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ConnectionForm } from './ConnectionForm';
import { testWrapper } from '~/test/utils';

describe('<Form/> (connection setup)', () => {
   const defaultOnSubmit = vi.fn();
   it('should let me test the connection once with an API key', async () => {
      const spy = vi.fn();
      const formValues = { apiKey: 'my-awesome-api-key' };

      render(<ConnectionForm nextStep={spy} />, testWrapper);
      const user = userEvent.setup();
      const apiKeyInput = screen.getByRole('textbox', { name: /api.+key/i });
      const submitButton = screen.getByRole('button', { name: /continue/i });

      await user.type(apiKeyInput, formValues.apiKey);
      await user.click(submitButton);

      expect(spy).toHaveBeenCalledTimes(1);
   });

   // The continue is not called until the mutation has returned
   it.skip('should submit with a proxy and api key', async () => {
      vi.spyOn(window, 'scrollTo').mockImplementation(() => {
         /* do nothing */
      });
      const spy = vi.fn();
      const formValues = {
         apiKey: 'my-awesome-api-key',
         proxy: '🌵',
         port: '80',
         username: 'santa',
         password: 'klaus',
      };
      render(<ConnectionForm nextStep={spy} />, testWrapper);

      const user = userEvent.setup();
      const apiKeyInput = screen.getByRole('textbox', { name: /api.+key/i });

      // Typing the api key
      await user.type(apiKeyInput, formValues.apiKey);

      expect(screen.queryByRole('textbox', { name: /proxy/i })).toBeNull();
      expect(screen.queryByRole('textbox', { name: /port/i })).toBeNull();
      expect(screen.queryByRole('textbox', { name: /username/i })).toBeNull();
      expect(screen.queryByRole('textbox', { name: /password/i })).toBeNull();

      // Adding a proxy
      await user.click(screen.getByRole('button', { name: /proxy/i }));
      await waitFor(() =>
         expect(
            screen.getByRole('textbox', { name: /api.+key/i })
         ).toBeInTheDocument()
      );

      const proxyInput = screen.getByRole('textbox', { name: /proxy/i });
      const submitButton = screen.getByRole('button', { name: /continue/i });
      const port = screen.getByRole('textbox', { name: /port/i });

      await user.type(proxyInput, formValues.proxy);
      await user.type(port, formValues.port);

      await waitFor(() =>
         expect(
            screen.getByRole('textbox', { name: /username/i })
         ).toBeInTheDocument()
      );

      const usernameInput = screen.getByRole('textbox', { name: /username/i });
      const passwordInput = screen.getByRole('textbox', { name: /password/i });

      await user.type(usernameInput, formValues.username);
      await user.type(passwordInput, formValues.password);

      // Submitting
      await user.click(submitButton);

      await waitFor(() => {
         expect(spy).toHaveBeenCalledTimes(1);
      });
   });

   it('should display an error message if the api key is empty', async () => {
      render(<ConnectionForm nextStep={defaultOnSubmit} />, testWrapper);
      const user = userEvent.setup();
      const submitButton = screen.getByRole('button', { name: /continue/i });

      // Submitting
      await user.click(submitButton);

      await waitFor(() =>
         expect(screen.getByText(/provide.api.key/i)).toBeInTheDocument()
      );
   });
});
