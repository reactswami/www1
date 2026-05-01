import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import App from './App';
import { type useInitialSetup } from './hooks';

const useInitialSetupMock = vi.fn();
vi.mock('./hooks/useInitialSetup', () => ({
   useInitialSetup: () => useInitialSetupMock(),
}));
describe('App', () => {
   it('should render successfully', () => {
      expect(() => render(<App />)).not.toThrow();
   });

   it.skip('should redirect me to the first-visit page if no api key is configured', async () => {
      const mockReturnValue: Partial<ReturnType<typeof useInitialSetup>> = {
         isLoading: false,
         isFirstVisit: true,
         isError: false,
         setIsFirstVisit: vi.fn(),
         refetch: vi.fn(),
      };
      useInitialSetupMock.mockReturnValue(mockReturnValue);

      render(<App />);

      screen.debug();
      await waitFor(() =>
         expect(
            screen.getByRole('textbox', { name: /api.key/i })
         ).toBeInTheDocument()
      );
   });
});
