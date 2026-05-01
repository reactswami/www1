import { render, screen } from '@testing-library/react';

import { PingTable } from './Table';
import { PingTableProvider } from '~/contexts/context';
import { testWrapper } from '~/test/utils';

describe('<Table />', () => {
   it('should render successfully', () => {
      expect(() =>
         render(
            <PingTableProvider>
               <PingTable />
            </PingTableProvider>,
            testWrapper
         )
      ).not.toThrow();
   });
   it('should display a table with the OAs if there are OAs', () => {
      render(
         <PingTableProvider>
            <PingTable />
         </PingTableProvider>,
         testWrapper
      );
      expect(screen.getByRole('table')).toBeInTheDocument();
   });

   it('should have the right columns', () => {
      const columns = ['name', 'ip address', 'default poller', 'pollers'];

      render(
         <PingTableProvider>
            <PingTable />
         </PingTableProvider>,
         testWrapper
      );
      for (const column of columns) {
         const regexp = new RegExp(column, 'i');
         expect(
            screen.getAllByRole('columnheader', { name: regexp }).length
         ).toBeGreaterThanOrEqual(1); // We use length here to avoid conflicting name (hostname / name)
      }
   });

   // it('should display an empty state when there are no data', async () => {
   //    render(<Table />, testWrapper);
   //    expect(screen.getByText('no device found')).toBeInTheDocument();
   // });
   // it('should display the right data in the rows', async () => {
   //    const columns = [
   //       'name',
   //       'ipaddress',
   //       'default poller',
   //       'pollers',
   //    ] as (keyof DevicePollerRow)[];

   //    const { endpoints } = environment;
   //    const handler = [
   //       rest.post(endpoints.fetchPingPollers, async (_, res, ctx) => {
   //          return res(ctx.status(200), ctx.json(pings));
   //       }),
   //    ];

   //    server.resetHandlers(...handler);

   //    console.log(pings[0].poller);
   //    render(<Table />, testWrapper);
   // await waitFor(() => expect(screen.getByText(pings[0].poller.name)))
   // });

   // it('should have sortable columns', async () => {
   //    const user = userEvent.setup();
   //    const OAs = await db.device_oa.getAll().map((OA) => ({
   //       ...OA,
   //       id: OA.id,
   //       ipaddress: OA['ipaddress'],
   //    }));

   //    render(
   //       <Table
   //          OAs={OAs.map((oa) => ({ ...oa, uptime: oa.uptime.toString() }))}
   //       />,
   //       testWrapper
   //    );

   //    await user.click(screen.getByRole('columnheader', { name: /^Name$/i }));

   //    const actualRows = screen.getAllByRole('row').splice(1); // We're remove the top row (header)
   //    const expectedRows = OAs.sort((a, b) => (a.name > b.name ? 1 : -1));

   //    actualRows.map((row, index) => {
   //       const regexp = new RegExp(expectedRows[index].name, 'i');
   //       expect(row).toHaveTextContent(regexp);
   //    });
   // });

   // it('should allow me to have a global filter', async () => {
   //    const user = userEvent.setup();
   //    const names = [
   //       'averylongnamehopefullyitwontmatchanyotherrow',
   //       'Don Quixote',
   //    ];
   //    const OAs = names.map((name) => db.device_oa.create({ name }));

   //    render(
   //       <Table
   //          OAs={OAs.map((oa) => ({
   //             ...oa,
   //             ipaddress: oa['ipaddress'],
   //             uptime: oa.uptime.toString(),
   //          }))}
   //       />,
   //       testWrapper
   //    );

   //    await user.type(
   //       screen.getByRole('textbox', { name: /search/i }),
   //       names[0]
   //    );

   //    expect(screen.getAllByRole('row')).toHaveLength(2); // 2 as the header count as a row
   // });
});
