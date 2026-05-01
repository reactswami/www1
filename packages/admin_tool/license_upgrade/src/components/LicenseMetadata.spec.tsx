import { render, screen } from '@testing-library/react';
import { mockLicenseResponse } from './__mocks__/mockLicenseResponse';
import { LicenseMetadata } from './LicenseMetadata';

describe('LicenseMetadata', () => {
	it('renders all metadata fields', () => {
		render(<LicenseMetadata license={mockLicenseResponse} />);
		expect(screen.getByText('Server ID')).toBeInTheDocument();
		expect(screen.getByText('Hardware ID')).toBeInTheDocument();
		expect(screen.getByText('License Type')).toBeInTheDocument();
		expect(screen.getByText('Expires')).toBeInTheDocument();
	});

	it('renders correct values', () => {
		render(<LicenseMetadata license={mockLicenseResponse} />);
		expect(screen.getByText('server-xyz')).toBeInTheDocument();
		expect(screen.getByText('hw-abc')).toBeInTheDocument();
		expect(screen.getByText('Pro')).toBeInTheDocument();
		const date = new Date(mockLicenseResponse.result.not_after * 1000).toLocaleDateString();
		expect(screen.getByText(date)).toBeInTheDocument();
	});

	it('handles missing expiry date', () => {
      mockLicenseResponse.result.not_after = 0;
		render(<LicenseMetadata license={mockLicenseResponse} />);
		expect(screen.getByText('Expires')).toBeInTheDocument();
		expect(screen.queryByText(/\d{1,2}\/\d{1,2}\/\d{2,4}/)).not.toBeInTheDocument();
	});

});
