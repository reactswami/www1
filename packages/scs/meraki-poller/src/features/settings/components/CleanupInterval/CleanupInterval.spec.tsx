import { render } from '@testing-library/react';
import { FormProvider, useForm } from 'react-hook-form';
import { vi } from 'vitest';
import { CleanupInterval } from './CleanupInterval';
import { testWrapper } from '~/test/utils';

describe('Cleanup Interval', () => {
   const defaultArgs = {
      isAutoremoved: true,
      register: vi.fn(),
      value: 1,
      errors: { key: {} },
      watchIsAutoremoved: vi.fn(),
      keyValue: 'key',
   };
   it('should render', () => {
      const TestBed = () => {
         const methods = useForm();
         return (
            <FormProvider {...methods}>
               <CleanupInterval {...defaultArgs} />
            </FormProvider>
         );
      };
      expect(() => render(<TestBed />, testWrapper)).not.toThrow();
   });
});
