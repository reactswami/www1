import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import React from 'react';
import { vi } from 'vitest';
import { type Props, useAssignPingPoller } from './useAssignPingPoller';

describe('useAssignPollers', () => {
   const defaultProps: Props = {
      isOpen: false,
      selectedDevices: [],
      onClose: vi.fn(),
      isAllSelected: false,
      preselectedPollers: [],
   };
   const testWrapper = ({ children }: { children: React.ReactNode }) => {
      const queryClient = new QueryClient();
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
   };
   it('should have the preselected pollers in the state', async () => {
      // Arrange
      const preselectedPollers = [
         {
            poll: 'on' as const,
            name: 'poller1',
            id: '1',
         },
         {
            poll: 'on' as const,
            name: 'poller2',
            id: '2',
         },
      ];
      const { result } = renderHook(
         () => useAssignPingPoller({ ...defaultProps, preselectedPollers }),
         { wrapper: testWrapper }
      );

      // Act

      // Assert
      await waitFor(() => {
         expect(result.current.selectedPollers).toHaveLength(preselectedPollers.length);
      });
   });

   it('should ahve the default poller in the state', async () => {
      // Arrange
      const preselectedPollers = [
         {
            poll: 'on' as const,
            name: 'poller1',
            id: '1',
         },
         {
            poll: 'on' as const,
            name: 'poller2',
            id: '2',
            isDefault: true,
         },
      ];
      const { result } = renderHook(
         () => useAssignPingPoller({ ...defaultProps, preselectedPollers }),
         { wrapper: testWrapper }
      );

      // Act

      // Assert
      await waitFor(() => {
         expect(result.current.defaultPoller).toBe(preselectedPollers[1]);
      });
   });
});
