import { useDisclosure } from '@chakra-ui/react';
import { type PaginationState } from '@tanstack/react-table';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { TableEmptyState } from './TableEmptyState';
import { OaTableProvider } from '~/features/Table/contexts';
import { testWrapper } from '~/test/utils';
import { vi } from 'vitest';

const spy = vi.fn();
vi.mock('react-router-dom', () => ({
   ...vi.requireActual('react-router-dom'),
   useNavigate: () => spy,
}));

describe('<EmptyState />', () => {
   it('should render successfully', () => {
      const EmtpyState = () => {
         const disclosure = useDisclosure();
         const [paginationState, setPaginationState] =
            useState<PaginationState>({
               pageIndex: 0,
               pageSize: 20,
            });
         return (
            <OaTableProvider
               paginationState={paginationState}
               setPaginationState={setPaginationState}
               isLoading={false}
               isError={false}
               isSuccess={true}
               Oas={[]}
               addOaDisclosure={disclosure}
            >
               <TableEmptyState hasFilters={false} />
            </OaTableProvider>
         );
      };

      expect(() => render(<EmtpyState />, testWrapper)).not.toThrow();
   });

   it('should display an empty state where there are no Oa with a button to create an Oa', async () => {
      const user = userEvent.setup();
      const spy = vi.fn();

      const EmtpyState = () => {
         const disclosure = useDisclosure();
         const [paginationState, setPaginationState] =
            useState<PaginationState>({
               pageIndex: 0,
               pageSize: 20,
            });
         return (
            <OaTableProvider
               paginationState={paginationState}
               setPaginationState={setPaginationState}
               isLoading={false}
               isError={false}
               isSuccess={true}
               Oas={[]}
               addOaDisclosure={{ ...disclosure, onOpen: spy }}
            >
               <TableEmptyState hasFilters={false} />
            </OaTableProvider>
         );
      };

      render(<EmtpyState />, testWrapper);

      await user.click(screen.getByRole('button', { name: /.*create.+/i }));
      expect(spy).toHaveBeenCalled();
   });
});
