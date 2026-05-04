import { render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';
import { vi } from 'vitest';
import { useConfirmDialog } from './useConfirmDialog';

describe('UseConfirmDialog', () => {
   it('should render', () => {
      expect(() =>
         renderHook(() =>
            useConfirmDialog({
               onConfirm: vi.fn(),
               title: '',
               body: '',
               labels: { confirm: '', cancel: '' },
               isPending: false,
            })
         )
      ).not.toThrow();
   });

   it('should call the save action when clicking', async () => {
      const user = userEvent.setup();
      const spy = vi.fn();
      const Test = () => {
         const { Modal, open } = useConfirmDialog({
            onConfirm: spy,
            title: '',
            body: '',
            labels: { confirm: 'save', cancel: 'cancel' },
            isPending: false,
         });
         useEffect(() => {
            open();
         }, []);

         return <Modal />;
      };

      render(<Test />);

      // SSAlertDialog renders role="alertdialog"
      await screen.findByRole('alertdialog');
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
         expect(spy).toHaveBeenCalled();
      });
   });

   it('should show a loading state and disable the cancel when it is loading', async () => {
      const Test = () => {
         const { Modal, open } = useConfirmDialog({
            onConfirm: vi.fn(),
            title: '',
            body: '',
            labels: { confirm: 'save', cancel: 'cancel' },
            isPending: true,
         });
         useEffect(() => {
            open();
         }, []);

         return <Modal />;
      };

      render(<Test />);

      await screen.findByRole('alertdialog');
      expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
   });
});
