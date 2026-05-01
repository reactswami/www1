import { renderHook } from '@testing-library/react';
import { UsePagination } from './usePagination';

describe('<UsePagination />', () => {
   it('should render successfully', () => {
      expect(() => renderHook(() => UsePagination)).not.toThrow();
   });

   it.todo('should have more tests');
});
