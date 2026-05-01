import { useDisclosure } from '@chakra-ui/react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { ModalAssignServices, type Props } from './ModalAssignServices';
import { testWrapper } from '~/test/utils';

describe('<OaModalAssignServices />', () => {
   const defaultProps: Props = {
      disclosure: {
         isOpen: true,
         onOpen: vi.fn(),
         onClose: vi.fn(),
         onToggle: vi.fn(),
         isControlled: false,
         getButtonProps: vi.fn(),
         getDisclosureProps: vi.fn(),
      },
      id: '',
   };
   it('should render successfully', () => {
      expect(() =>
         render(<ModalAssignServices {...defaultProps} />, testWrapper)
      ).not.toThrow();
   });

   it('should not close when pressing escape', async () => {
      // Arrange
      let hasBeenClosed = false;
      const user = userEvent.setup();
      const TestBed = () => {
         // We need to mock the onClose function to check if it has been called
         const disclosure = useDisclosure({ defaultIsOpen: true });
         vi.spyOn(disclosure, 'onClose').mockImplementation(() => {
            hasBeenClosed = true;
         });
         return <ModalAssignServices id={'1'} disclosure={disclosure} />;
      };
      render(<TestBed />, testWrapper);

      // Act
      await user.keyboard('{Escape}');

      // Assert
      await waitFor(() => {
         expect(hasBeenClosed).toBe(false);
      });
   });

   it('should not have a close button', () => {
      // Arrange
      render(<ModalAssignServices {...defaultProps} />, testWrapper);

      // Assert
      expect(screen.queryByRole('button', { name: /close/i })).toBeNull();
   });
});
