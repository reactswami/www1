import { renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('<useDebounce />', () => {
   it('should render successfully', () => {
      expect(() => renderHook(() => useDebounce)).not.toThrow();
   });

   it.todo('should have more tests');
});
