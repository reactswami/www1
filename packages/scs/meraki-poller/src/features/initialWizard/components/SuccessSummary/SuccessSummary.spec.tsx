import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { SuccessSummary } from './SucessSummary';

describe('<SuccessSummary />', () => {
   it('should display the api key, count of organisation and count of network', () => {
      const args = {
         organizationsFound: 120,
         onContinue: vi.fn(),
      };
      render(<SuccessSummary {...args} />);
      const regexp = new RegExp(/success.*/, 'i');
      expect(screen.getByText(regexp)).toBeInTheDocument();

      expect(screen.getByText(/organization.+found.+120/i)).toBeInTheDocument();
   });
});
