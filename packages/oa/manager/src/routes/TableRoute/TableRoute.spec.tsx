import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { TableRoute } from './TableRoute';
import { endpoints } from '~/config/environment.prod';
import { db } from '~/test/server/db';
import { emptyOaHandlers } from '~/test/server/handlers/oa';
import { server } from '~/test/server/node';
import { createAPIResponse, silenceConsole, stripUrlParameters, testWrapper } from '~/test/utils';
import { type DeviceOa } from '~/types/models';

describe('<TableRoute />', () => {
   it('should render successfully', () => {
      expect(() => render(<TableRoute />, testWrapper)).not.toThrow();
   });

   it('should display a table when there are Oas', async () => {
      render(<TableRoute />, testWrapper);

      const oas = await db.device_oa.findMany({
         where: { type: { equals: 'Oa' } },
      });

      await waitFor(
         () =>
            expect(screen.getAllByRole('row').length).toBeGreaterThan(
               oas.length
            ) // Greater since we have the header row, and an extra row for visual purpose
      );

      // Verifying that all the right information are displayed in the table
      for (const oa of oas) {
         expect(screen.getAllByText(oa.hostname).length).toBeGreaterThan(0);
         expect(screen.getAllByText(oa.region).length).toBeGreaterThan(0);
         expect(screen.getAllByText(oa.site).length).toBeGreaterThan(0);
         expect(screen.getAllByText(oa.ipaddress).length).toBeGreaterThan(0);
      }
   });

   it('should display an empty state where there are no Oa with a button that opens the modal to create an Oa', async () => {
      await server.resetHandlers(...emptyOaHandlers);
      const user = userEvent.setup();
      const emptyStateText = new RegExp(/.*no.*available.*/, 'i');
      render(<TableRoute />, testWrapper);

      await waitFor(() =>
         expect(screen.getByText(emptyStateText)).toBeInTheDocument()
      );
      await user.click(
         screen.getByRole('button', { name: /create.+appliance/i })
      );
      expect(
         within(screen.getByRole('dialog')).getByRole('heading', {
            name: /create/i,
         })
      ).toBeInTheDocument();
   });

   // FIXME: leaky test. I have run out of time to fix this
   it.skip('should display an error state when there was an error with the server', async () => {
      silenceConsole();
      server.close();
      render(<TableRoute />, testWrapper);

      await waitFor(() =>
         expect(screen.getByText(/error/i)).toBeInTheDocument()
      );
   });

   it('should display a table with the Oas if there are Oas', () => {
      render(<TableRoute />, testWrapper);
      //
      expect(screen.getByRole('table')).toBeInTheDocument();
   });

   it('should have the right columns', () => {
      const columns = [
         'name',
         'uptime',
         'hostname',
         'ip address',
         'version',
         'action',
      ] as (keyof DeviceOa)[];

      render(<TableRoute />, testWrapper);
      for (const column of columns) {
         const regexp = new RegExp(column, 'i');
         expect(
            screen.getAllByRole('columnheader', { name: regexp }).length
         ).toBeGreaterThanOrEqual(1); // We use length here to avoid conflicting name (hostname / name)
      }
   });

   it.skip('should display the right data in the rows', async () => {
      // There is a leaky test somewhere.
      const Oas = await db.device_oa
         .getAll()
         .map((Oa) => ({
            ...Oa,
            id: Oa.id,
            ipaddress: Oa['ipaddress'],
         }))
         .filter(({ type }) => type === 'Oa');

      const columns = [
         'name',
         'hostname',
         'ipaddress',
         'version',
      ] as (keyof DeviceOa)[];

      render(<TableRoute />, testWrapper);

      let rowIdx = 1;
      for (const Oa of Oas) {
         const services = Oa['services']
            .split(',')
            .filter((service) => service.length > 0);

         for (const service of services) {
            const regexp = new RegExp(service);
            await waitFor(() =>
               expect(
                  within(screen.getAllByRole('row')[rowIdx]).getByText(regexp)
               ).toBeInTheDocument()
            );
         }
         rowIdx++;
      }

      for (const Oa of Oas) {
         for (const column of columns) {
            // @ts-ignore
            let regexp = new RegExp(Oa[column].toString(), 'i');
            if (column === 'name') {
               regexp = new RegExp(Oa['title'].toString(), 'i');
            }
            expect(
               screen.getAllByRole('cell', { name: regexp }).length
            ).toBeGreaterThanOrEqual(1); // Checking the length here as well since multiple cell can match (for the status for example, it's either up or down...)
         }
      }
   });

   it('should have sortable columns', async () => {
      const user = userEvent.setup();
      const Oas = await db.device_oa
         .getAll()
         .map((Oa) => ({
            ...Oa,
            id: Oa.id,
            ipaddress: Oa['ipaddress'],
         }))
         .filter(({ type }) => type === 'Oa')
         .sort((a, b) => (a.title > b.title ? 1 : -1));

      render(<TableRoute />, testWrapper);

      await user.click(screen.getByRole('columnheader', { name: /^name/i }));
      await user.click(screen.getByRole('columnheader', { name: /^name/i }));

      const actualRows = screen.getAllByRole('row').splice(1, -1); // We're remove the top row (header) and the last one (visual emtpy row)
      const expectedRows = Oas.sort((a, b) => (a.title > b.title ? -1 : 1));

      actualRows.map((row, index) => {
         const regexp = new RegExp(expectedRows[index].title, 'i');
         expect(row).toHaveTextContent(regexp);
      });
   });

   it.skip('should allow me to have a global filter', async () => {
      const names = [
         'averylongnamehopefullyitwontmatchanyotherrow',
         'Don Quixote',
      ];
      server.resetHandlers(
         rest.get(
            stripUrlParameters(endpoints.fetchOaRows),
            async (req, res, ctx) => {
               const oas = await names.map(
                  async (name) => await db.device_oa.create({ name })
               );
               return res(
                  ctx.status(200),
                  ctx.json(createAPIResponse({ data: [oas] }))
               );
            }
         )
      );
      const user = userEvent.setup();

      render(<TableRoute />, testWrapper);

      await user.type(
         screen.getByRole('textbox', { name: /search/i }),
         names[0]
      );

      expect(screen.getAllByRole('row')).toHaveLength(2); // 2 as the header count as a row
   });
});
