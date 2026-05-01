import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, render, renderHook, screen } from '@testing-library/react';
import React from 'react';
import { useAssignPollersModal, type Props } from './useAssignPingPollerModal';

describe('useAssignPollersModal', () => {
   const defaultProps: Props = {
      selectedDevices: [],
   };
   const testWrapper = ({ children }: { children: React.ReactNode }) => {
      const client = new QueryClient();
      return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
   };

   // There a no mock server here, so there isn't any test to do at this stage
   // TODO: add mock server to test the modal
   it.skip('should have the button save disabled while loading', async () => {
      // Arrange
      const { result } = renderHook(() => useAssignPollersModal(defaultProps), {
         wrapper: testWrapper,
      });
      const Modal = result.current.Modal;

      render(<Modal />, { wrapper: testWrapper });

      // Act
      // Open the modal
      await act(async () => {
         await result.current.disclosure.onOpen();
      });

      // Assert
      const saveButton = screen.getByRole('button', { name: /save/i });
      // There are no mock server here, so the modal will throw an error when contacting the API
      expect(saveButton).toBeDisabled();
   });
});
