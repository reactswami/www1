import { renderHook, waitFor } from '@testing-library/react';
import { useInitialSetup } from './useInitialSetup';
import { failedHandlers } from '~/test/server/handlers/global';
import { server } from '~/test/server/node';
import { silenceConsole, testWrapper } from '~/test/utils';

// const spy = vi.fn();
// vi.mock('react-router-dom', () => ({
//    ...vi.importActual('react-router-dom'),
//    useNavigate: () => spy,
// }));


describe('useInitialSetup', () => {
   it('should throw an error if it cannot retrieve the global configuration', async () => {
      silenceConsole();
      server.use(...failedHandlers);
      const { result } = renderHook(useInitialSetup, testWrapper);
      await waitFor(() => expect(result.current.isError).toBeTruthy());
   });
});
