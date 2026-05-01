import { screen, waitFor,render } from '@testing-library/react';
import { NetworkTable } from './NetworkTable';
import { db } from '~/test/server/db';
import { testWrapper } from '~/test/utils';


describe('NetworkTable', () => {
   it('should render', () => {
      expect(() => render(<NetworkTable />, testWrapper)).not.toThrow();
   });

   it('should contains all the networks', async () => {
      const mockNetworks = db.network.getAll();

      render(<NetworkTable />, testWrapper);

      await waitFor(() => {
         expect(screen.queryByText(/loading/i)).toBeNull();
      });

      mockNetworks.forEach(async (network) => {
         const regexp = new RegExp(network.name);

         await waitFor(() => {
            expect(
               screen.getAllByRole('cell', { name: regexp }).length
            ).toBeGreaterThan(0);
         });

         // There can be multiple networks with the same name, so we check the length
      });
   });
});
