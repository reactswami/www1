
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Stepper } from './Stepper';
import { testWrapper } from '~/test/utils';

vi.mock('../../hooks/useSteps', () => ({
   ...vi.importActual('../../hooks/useSteps'),
   useSteps: () => ({
      handleNext: vi.fn(),
      handlePrevious: vi.fn(),
      currentStep: 0,
      steps: [
         {
            component: <h1>Hello world</h1>,
            index: 0,
            title: 'Batman!',
         },
      ],
   }),
}));
describe('<Stepper />', () => {
   it('should render', () => {
      expect(() => render(<Stepper />, testWrapper)).not.toThrow();
   });
   it('should render the right step', () => {
      render(<Stepper />, testWrapper);

      expect(screen.getByText('Batman!')).toBeInTheDocument();
      expect(screen.getByText(/hello.world/i)).toBeInTheDocument();
   });
});
