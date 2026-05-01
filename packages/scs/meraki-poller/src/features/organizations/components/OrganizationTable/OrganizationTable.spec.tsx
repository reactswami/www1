import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { OrganizationTable, type Props } from './OrganizationTable';
import { db } from '~/test/server/db';
import { testWrapper } from '~/test/utils';

describe('OrganisationTable', () => {
   const defaultProps: Props = {
      data: [],
      isRefetching: false,
      isLoading: false,
      refetch: vi.fn(),
   };

   it('should render', () => {
      expect(() => render(<OrganizationTable {...defaultProps} />, testWrapper)).not.toThrow();
   });

   it('should contains all the networks', async () => {
      const networks = await db.network.getAll();
      render(<OrganizationTable {...defaultProps} />, testWrapper);

      await waitFor(() => {
         expect(screen.queryByText(/loading/i)).toBeNull();
      });

      await networks.forEach(async (network) => {
         const regexp = new RegExp(network.name);
         await waitFor(() =>
            expect(screen.getAllByRole('cell', { name: regexp }).length).toBeGreaterThan(0)
         );
         // There can be multiple network with the same name, so we check the length
      });
   });
});
