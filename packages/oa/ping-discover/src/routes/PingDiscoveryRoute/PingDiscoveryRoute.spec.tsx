import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PingDiscoveryRoute } from './PingDiscoveryRoute';
import { fetchOasWithPingServiceMockResponse } from '~/test/server/handlers/oa';
import { testWrapper } from '~/test/utils';

describe('<PingDiscoveryRoute />', () => {
   it('should render successfully', () => {
      expect(() => render(<PingDiscoveryRoute />, testWrapper)).not.toThrow();
   });

   it('should have a select dropdown that contains all the available OA with ping service enabled', async () => {
      const user = userEvent.setup();
      render(<PingDiscoveryRoute />, testWrapper);

      await user.click(screen.getByRole('textbox', { name: /select/i }));
      const oas = fetchOasWithPingServiceMockResponse;
      const listItems = screen.getAllByRole('listitem');

      for (const [index, oa] of oas.entries()) {
         const regexp = new RegExp(oa.name, 'i');
         // Note that this might fail if there are more list items on the page, it's not perfect
         expect(within(listItems[index]).getByText(regexp)).toBeInTheDocument();
      }
   });

   it('should have the textarea disabled until an oa is selected', async () => {
      const user = userEvent.setup();
      render(<PingDiscoveryRoute />, testWrapper);
      expect(
         screen.getByTestId('oa-ping-discovery-ip-scan-range-input')
      ).toBeDisabled();

      await user.click(screen.getByRole('textbox', { name: /select/i }));
      await user.click(screen.getAllByRole('listitem')[0]);

      expect(
         screen.getByRole('textbox', { name: /select/i })
      ).not.toBeDisabled();
   });

   it('should display an error message if the scan ranges is empty', async () => {
      const user = userEvent.setup();
      render(<PingDiscoveryRoute />, testWrapper);
      const ipScanRangeInput = screen.getByTestId(
         'oa-ping-discovery-ip-scan-range-input'
      ) as HTMLTextAreaElement;

      await user.click(screen.getByRole('textbox', { name: /select/i }));
      await user.click(screen.getAllByRole('listitem')[0]);
      await user.clear(ipScanRangeInput); // There is fake cfg attached to mock response
      await user.click(screen.getByRole('button', { name: /dry.*run/i }));

      await waitFor(() => expect(ipScanRangeInput).toBeInvalid());
   });

   it('should removes the error message when selecting another oa', async () => {
      const user = userEvent.setup();
      render(<PingDiscoveryRoute />, testWrapper);
      const ipScanRangeInput = screen.getByTestId(
         'oa-ping-discovery-ip-scan-range-input'
      ) as HTMLTextAreaElement;

      await user.click(screen.getByRole('textbox', { name: /select/i }));
      await user.click(screen.getAllByRole('listitem')[0]);
      await user.clear(ipScanRangeInput); // There is fake cfg attached to mock response
      await user.click(screen.getByRole('button', { name: /dry.*run/i }));
      await waitFor(() => expect(ipScanRangeInput).toBeInvalid());
      await user.click(screen.getByRole('textbox', { name: /select/i }));
      await user.click(screen.getAllByRole('listitem')[1]);
      await waitFor(() => expect(ipScanRangeInput).not.toBeInvalid());
   });
   it('should display the results on the output frame once a run is triggered', async () => {
      const user = userEvent.setup();
      render(<PingDiscoveryRoute />, testWrapper);
      const outputText =
         'The results of the ping discovery will be displayed once the discovery process starts.';

      expect(screen.getByText(outputText)).toBeInTheDocument();

      await user.click(screen.getByRole('textbox', { name: /select/i }));
      await user.click(screen.getAllByRole('listitem')[0]);
      await user.click(screen.getByRole('button', { name: /dry.*run/i }));

      expect(screen.queryByText(outputText)).toBeNull();
   });

   it('should display a confirmation dialog when doing a "full discovery" (as opposed to a dry run)', async () => {
      const user = userEvent.setup();
      render(<PingDiscoveryRoute />, testWrapper);

      await user.click(screen.getByRole('textbox', { name: /select/i }));
      await user.click(screen.getAllByRole('listitem')[0]);
      await user.click(screen.getByRole('button', { name: /discovery/i }));

      expect(screen.getByRole('banner')).toBeInTheDocument();
   });

   it("should set the default OA if the url contains the 'oa' query param", async () => {
      const user = userEvent.setup();
      const oas = fetchOasWithPingServiceMockResponse;
      const defaultOa = oas[0];
      // Mock the window.location.search
      const mockLocation = window.location;
      // @ts-ignore
      delete window.location;
      // @ts-ignore
      window.location = {
         ...mockLocation,
         search: `?oa=${defaultOa.name}`,
      };
      render(<PingDiscoveryRoute />, testWrapper);

      await waitFor(() =>
         expect(screen.getByPlaceholderText(defaultOa.name)).toBeInTheDocument()
      );
   });
});
