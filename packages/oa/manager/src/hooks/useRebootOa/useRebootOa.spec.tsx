import { render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type TableRowData } from '..';
import { useRebootOa } from './useRebootOa';
import { testWrapper } from '~/test/utils';

describe('useRebootOa', () => {
   const oa: TableRowData = {
      services: [],
      manual_name: '',
      id: '',
      status: '',
      timeout: 0,
      uptime: 0,
      version: '',
      poll: 'on',
      name: '',
      hostname: '',
      ipaddress: '',
      netmask: '',
      gateway: '',
      region: '',
      site: '',
      location: '',
   };

   it('should render', () => {
      expect(() =>
         renderHook(() => useRebootOa({ oa }), testWrapper)
      ).not.toThrow();
   });

   it('should show a toast when rebooting', async () => {
      const user = userEvent.setup();
      const TestBed = ({ oa }: { oa: TableRowData }) => {
         const { reboot } = useRebootOa({ oa });

         return <button onClick={() => reboot()}>Button</button>;
      };
      render(<TestBed oa={oa} />, testWrapper);

      await user.click(screen.getByRole('button'));

      await waitFor(() =>
         expect(screen.getByText(/rebooting/i)).toBeInTheDocument()
      );
   });
});
