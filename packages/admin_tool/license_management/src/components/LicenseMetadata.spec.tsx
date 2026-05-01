import { render, screen } from '@testing-library/react';
import { mockLicense, nullLicense } from './__mocks__/mockLicense';
import { LicenseMetadata } from './LicenseMetadata';

describe('LicenseMetadata', () => {
   it('renders all metadata fields', () => {
      render(<LicenseMetadata license={mockLicense} />);
      expect(screen.getByText('Server ID')).toBeInTheDocument();
      expect(screen.getByText('Hardware ID')).toBeInTheDocument();
      expect(screen.getByText('License Type')).toBeInTheDocument();
      expect(screen.getByText('Expires')).toBeInTheDocument();
   });

   it('renders correct values', () => {
      render(<LicenseMetadata license={mockLicense} />);
      expect(screen.getByText('server-123')).toBeInTheDocument();
      expect(screen.getByText('hw-456')).toBeInTheDocument();
      expect(screen.getByText('Enterprise')).toBeInTheDocument();
      // Date conversion
      const date = new Date(mockLicense.not_after! * 1000).toLocaleDateString();
      expect(screen.getByText(date)).toBeInTheDocument();
   });

   it('handles missing expiry date', () => {
      const license = { ...mockLicense, not_after: null };
      render(<LicenseMetadata license={license} />);
      expect(screen.getByText('Expires')).toBeInTheDocument();
      // Should not render a date
      expect(screen.queryByText(/\d{1,2}\/\d{1,2}\/\d{2,4}/)).not.toBeInTheDocument();
   });

   it('handles null and missing values', () => {
      render(<LicenseMetadata license={nullLicense} />);
      expect(screen.getAllByText('N/A')).toHaveLength(4);
   });
});
