import { render } from '@testing-library/react';
import { TableStatusTag, getStatusProps } from './TableStatusTag';

describe('<TableStatusTag />', () => {
   const defaultProps = {
      status: 'up' as const,
      isDisabled: true,
   };
   it('should render successfully', () => {
      expect(() => render(<TableStatusTag {...defaultProps} />)).not.toThrow();
   });

   it('should show the right status', () => {
      expect(getStatusProps('disabled').tooltip).toBe('disabled');
      expect(getStatusProps('disabled').circleColor).toMatch(/orange/);

      expect(getStatusProps('up').tooltip).toBe('up');
      expect(getStatusProps('up').circleColor).toMatch(/green/);

      expect(getStatusProps('down').tooltip).toBe('down');
      expect(getStatusProps('down').circleColor).toMatch(/red/);

      expect(getStatusProps('unknown').tooltip).toBe('unknown');
      expect(getStatusProps('unknown').circleColor).toMatch(/gray/);
   });
});
