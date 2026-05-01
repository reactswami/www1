import { render, screen } from '@testing-library/react';

import { StepIndicator } from './StepIndicator';

describe('<StepIndicator />', () => {
   it('should render', () => {
      expect(() =>
         render(
            <StepIndicator
               isCurrent={true}
               isCompleted={false}
               title={'hello'}
               stepIndex={3}
            />
         )
      ).not.toThrow();
   });

   it('should render the title of the step', () => {
      render(
         <StepIndicator
            isCurrent={true}
            isCompleted={false}
            title={'hello'}
            stepIndex={3}
         />
      );

      expect(screen.getByText('hello')).toBeInTheDocument();
   });
});
