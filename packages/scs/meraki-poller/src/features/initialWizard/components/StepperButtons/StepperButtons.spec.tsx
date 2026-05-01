import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { StepperButtons } from './StepperButtons';

describe('StepperButtons', () => {
   it('should render', () => {
      expect(() =>
         render(
            <StepperButtons
               onNext={vi.fn()}
               onPrevious={vi.fn()}
               canPrevious={true}
               isLoading={false}
            />
         )
      ).not.toThrow();
   });

   it('should not show previous if not available', () => {
      render(
         <StepperButtons
            onNext={vi.fn()}
            onPrevious={vi.fn()}
            canPrevious={false}
            isLoading={false}
         />
      );

      expect(screen.queryByRole('button', { name: /go.+back/i })).toBeNull();
   });

   it('should allow me to go back', async () => {
      const spy = vi.fn();
      const user = userEvent.setup();
      render(
         <StepperButtons
            onNext={vi.fn()}
            onPrevious={spy}
            canPrevious={true}
            isLoading={false}
         />
      );
      await user.click(screen.getByRole('button', { name: /go.+back/i }));

      expect(spy).toHaveBeenCalled();
   });

   it('should allow me to continue', async () => {
      const spy = vi.fn();
      const user = userEvent.setup();
      render(
         <StepperButtons
            onNext={spy}
            onPrevious={vi.fn()}
            canPrevious={true}
            isLoading={false}
         />
      );
      await user.click(screen.getByRole('button', { name: /continue/i }));

      expect(spy).toHaveBeenCalled();
   });
});
