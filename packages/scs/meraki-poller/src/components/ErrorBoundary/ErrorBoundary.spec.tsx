import { render, screen } from '@testing-library/react';
import { useEffect } from 'react';
import { vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

describe('error boundary', () => {
   it('should show the error message when a child component throw an error', () => {
      expect.assertions(1);
      // Silencing the console.error() for this test only (noisy)
      vi.spyOn(global.console, 'error').mockImplementation(vi.fn());

      const ERROR_MESSAGE = 'Something went wrong';
      const DodgyChildComponent = () => {
         useEffect(() => {
            throw new Error();
         }, []);

         return <h1>I'm dodgy as</h1>;
      };

      render(
         <ErrorBoundary>
            <DodgyChildComponent />
         </ErrorBoundary>
      );

      expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
   });

   it('should render the children if they don\'t throw an error', () => {
      expect.assertions(1);

      const CHILD_MESSAGE = 'I\'m a good component';
      const GoodChildComponent = () => {
         return <h1>{CHILD_MESSAGE}</h1>;
      };

      render(
         <ErrorBoundary>
            <GoodChildComponent />
         </ErrorBoundary>
      );

      expect(screen.getByText(CHILD_MESSAGE)).toBeInTheDocument();
   });
});
