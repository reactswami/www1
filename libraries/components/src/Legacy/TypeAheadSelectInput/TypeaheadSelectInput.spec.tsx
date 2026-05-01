import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { type Props, TypeAheadSelectInput } from './TypeaheadSelectInput';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const spy = vi.fn();
describe('<TypeheadGroupSelectInput />', () => {
   const defaultProps: Props = {
      onChange: vi.fn(),
      isLoading: false,
      isSuccess: false,
      isError: false,
      options: [],
      label: '',
   };
   it('should render successfully', () => {
      expect(() =>
         render(<TypeAheadSelectInput {...defaultProps} />)
      ).not.toThrow();
   });
});
