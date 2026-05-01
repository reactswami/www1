import { act, renderHook } from '@testing-library/react';
import { useSteps } from './useSteps';
import { testWrapper } from '~/test/utils';

// Spy on the router
// const spy = vi.fn();
// vi.mock('react-router-dom', () => ({
//    ...vi.importActual('react-router-dom'),
//    useNavigate: () => spy,
// }));

describe('<useSteps />', () => {
   it('should return the right step index', async () => {
      const { result } = renderHook(useSteps, testWrapper);

      expect(result.current.currentStep).toBe(0);

      const next = async () =>
         await act(async () => {
            await result.current.handleNext();
         });

      const previous = async () =>
         await act(async () => {
            await result.current.handlePrevious();
         });

      await next();
      await next();
      expect(result.current.currentStep).toBe(2);

      await previous();
      await previous();
      await previous();
      await previous();
      expect(result.current.currentStep).toBe(0);

      await next();
      await next();
      await next();
      await next();
      expect(result.current.currentStep).toBe(result.current.steps.length - 1);
   });

   it('should return the right steps', () => {
      const { result } = renderHook(useSteps, testWrapper);

      expect(result.current.steps).toMatchSnapshot();
   });
});
