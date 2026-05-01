import { render } from '@testing-library/react';
import { vi } from 'vitest';
import { ProxyForm } from './ProxyForm';

describe('<ProxyForm />', () => {
   it('should render', () => {
      expect(() => render(<ProxyForm register={vi.fn()} errors={{}}/>)).not.toThrow();
   });
});
