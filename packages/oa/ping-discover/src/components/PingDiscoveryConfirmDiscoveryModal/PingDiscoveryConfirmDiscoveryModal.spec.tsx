import { useDisclosure } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';
import { vi } from 'vitest';
import { PingDiscoveryConfirmDiscoveryModal } from './PingDiscoveryConfirmDiscoveryModal';

const spy = vi.fn();

describe('<PingDiscoveryConfirmDiscoveryModal />', () => {
   const Wrapper = () => {
      const disclosure = useDisclosure();
      useEffect(() => {
         disclosure.onOpen();
      });

      return (
         <div>
            <PingDiscoveryConfirmDiscoveryModal
               onContinue={spy}
               disclosure={disclosure}
            />
         </div>
      );
   };

   it('should render successfully', () => {
      expect(() => render(<Wrapper />)).not.toThrow();
   });

   it('should not call onContinue when the user click cancel', async () => {
      const user = userEvent.setup();

      render(<Wrapper />);

      await user.click(screen.getByRole('button', { name: /cancel/i }));
      expect(spy).not.toHaveBeenCalled();
   });

   it('should call on Continue when the user click on continue', async () => {
      const user = userEvent.setup();

      render(<Wrapper />);

      await user.click(screen.getByRole('button', { name: /continue/i }));
      expect(spy).toHaveBeenCalled();
   });
});
