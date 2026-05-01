import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { PingDiscoveryRangesInputSection } from './PingDiscoveryRangesInputSection';

describe('<PingDiscoveryRangesInputSection />', () => {
   const defaultProps = {
      isInvalid: true,
      isDisabled: false,
      reset: vi.fn(),
      onOpen: vi.fn(),
   };
   it('should render successfully', () => {
      expect(() =>
         render(<PingDiscoveryRangesInputSection {...defaultProps} />)
      ).not.toThrow();
   });

   it('should show an invalid state if it is invalid', () => {
      render(
         <PingDiscoveryRangesInputSection
            {...{ ...defaultProps, isInvalid: true }}
         />
      );
      expect(screen.getByText(/.*provide.*/)).toBeInTheDocument();
      expect(screen.getByRole('textbox')).toBeInvalid();
   });

   it('should be disabled if it is disabled', () => {
      render(
         <PingDiscoveryRangesInputSection
            {...{ ...defaultProps, isDisabled: true }}
         />
      );
      expect(screen.getByRole('textbox')).toBeDisabled();
   });

   it('should reset the state invalid when typing in the text area', async () => {
      const user = userEvent.setup();
      const spy = vi.fn();
      render(
         <PingDiscoveryRangesInputSection
            {...{ ...defaultProps, reset: spy }}
         />
      );
      await user.type(screen.getByRole('textbox'), 'hello');
      expect(spy).toBeCalled();
   });

   it('should open the modal when clicking on the help button', async () => {
      const user = userEvent.setup();
      const spy = vi.fn();
      render(
         <PingDiscoveryRangesInputSection
            {...{ ...defaultProps, onOpen: spy }}
         />
      );

      await user.click(screen.getByRole('button', { name: /help/i }));
      expect(spy).toBeCalled();
   });
});
