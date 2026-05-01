import { fireEvent, screen, waitFor } from '@testing-library/dom';
import { vi } from 'vitest';
import SelectTable from './index';
import userEvent from '@testing-library/user-event';

async function waitForLoadingToResolve() {
   await expect(await screen.findAllByRole('checkbox')).toHaveLength(5);
}
describe('common-select-table common module', () => {
   const scrollIntoView = vi.fn();
   window.HTMLElement.prototype.scrollIntoView = scrollIntoView;

   let container;
   let defaultArgs;

   const data = [
      { key: 'key-1', values: ['hello', 'world'] },
      { key: 'key-2', values: ['bonjour', 'tennis'] },
      { key: 'key-3', values: ['hallo', 'soccer'] },
      { key: 'key-4', values: ['ola', 'rugby'] },
   ];
   const fields = [
      { name: 'header-1', title: 'first column header' },
      { name: 'header-2', title: 'second column header' },
   ];
   const user = userEvent.setup();
   const total = data.length;

   beforeEach(() => {
      document.body.innerHTML = "<div id='root'></div>";
      container = document.getElementById('root');
      defaultArgs = {
         containerElement: container,
         data,
         total,
         fields,
         options: {},
      };
   });

   it('should be able to initialise a table', () => {
      const initialiseTable = () => new SelectTable(defaultArgs);
      expect(() => initialiseTable()).not.toThrow();
   });
   it('should throw if fields are empty', () => {
      expect(
         () =>
            new SelectTable({
               ...defaultArgs,
               fields: [],
            })
      ).toThrow();
   });
   it('should render the header element when initialised', () => {
      const titles = ['🚀', '🌍'];
      const fields = titles.map((title) => ({ name: 'hello', title }));
      new SelectTable({ ...defaultArgs, fields: fields });

      titles.map((title) => {
         const regex = new RegExp(title, 'i');
         expect(
            screen.getByRole('columnheader', { name: regex })
         ).toBeInTheDocument();
      });
   });

   it('should render a footer', async () => {
      new SelectTable(defaultArgs);

      const footer = await screen.findByRole('contentinfo');

      expect(footer).toBeInTheDocument();
   });

   it('should show the loader at initialisation', () => {
      new SelectTable(defaultArgs);
      expect(screen.getByAltText('loader')).toBeInTheDocument();
   });

   it('should render the data passed at initialisation', () => {
      const data = [
         { key: 'key-1', values: ['hello', 'world'] },
         { key: 'key-2', values: ['bonjour', 'tennis'] },
      ];
      const fields = [
         { name: 'test', title: 'Title' },
         { name: 'second field', title: 'Second title' },
      ];
      new SelectTable({ ...defaultArgs, data, fields });

      const values = data.map(({ values }) => values).flat();
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('row')).toHaveLength(data.length);
      values.map((value) => {
         const regexp = new RegExp(value, 'i');
         expect(screen.getByText(regexp)).toBeInTheDocument();
      });
   });

   describe('multi mode', () => {
      it('should be able to select a row', async () => {
         new SelectTable(defaultArgs);
         await waitForLoadingToResolve();

         const checkboxes = screen.queryAllByRole('row');

         await user.click(checkboxes[1]);
         expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(1);
         expect(screen.getByText(/1.selected/i)).toBeInTheDocument();
      });

      it('should be able to select multiple checkboxes by clicking on each checkbox', async () => {
         const table = new SelectTable(defaultArgs);
         await waitForLoadingToResolve();

         const rows = screen.queryAllByRole('checkbox');

         await user.click(rows[1]);
         expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(1);
         expect(table.getSelected()).toHaveLength(1);
         expect(screen.getByText(/1.selected/i)).toBeInTheDocument();

         await user.click(rows[2]);
         expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(2);
         expect(table.getSelected()).toHaveLength(2);
         expect(screen.getByText(/2.selected/i)).toBeInTheDocument();
      });
      it('should not selected disabled rows', async () => {
         const table = new SelectTable({
            ...defaultArgs,
            ...{
               data: defaultArgs.data.map((item) => ({
                  ...item,
                  isDisabled: true,
               })),
            },
         });
         await waitForLoadingToResolve();

         const rows = screen.queryAllByRole('checkbox');

         await user.click(rows[1]);
         expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(0);
         expect(table.getSelected()).toHaveLength(0);
         expect(screen.getByText(/0.selected/i)).toBeInTheDocument();

         await user.click(rows[2]);
         expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(0);
         expect(table.getSelected()).toHaveLength(0);
         expect(screen.getByText(/0.selected/i)).toBeInTheDocument();
      });

      it('should be able to unselect row by clicking on the checkbox', async () => {
         const table = new SelectTable(defaultArgs);
         await waitForLoadingToResolve();

         const rows = screen.queryAllByRole('checkbox');

         await user.click(rows[1]);

         expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(1);
         expect(table.getSelected()).toHaveLength(1);
         expect(screen.getByText(/1.selected/i)).toBeInTheDocument();

         await user.click(rows[1]);

         expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(0);
         expect(table.getSelected()).toHaveLength(0);
         expect(screen.getByText(/0.selected/i)).toBeInTheDocument();
      });

      it.skip('should be able to select multiple rows by holding shift', async () => {
         new SelectTable(defaultArgs);
         await waitForLoadingToResolve();

         const rows = screen.queryAllByRole('row');

         await user.click(rows[0]);
         expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(1);
         expect(screen.getByText(/1.selected/i)).toBeInTheDocument();

         // TODO fix shift not working with user event
         await fireEvent(rows[3], new MouseEvent('click', { shiftKey: true }));
         expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(4);
         expect(screen.getByText(/4.selected/i)).toBeInTheDocument();
      });

      it('should only select the clicked row when clicking on the row (i.e. not the checkbox)', async () => {
         new SelectTable(defaultArgs);
         await waitForLoadingToResolve();

         const rows = screen.queryAllByRole('row');

         await user.click(rows[0]);
         expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(1);
         expect(screen.getByText(/1.selected/i)).toBeInTheDocument();

         await user.click(rows[1]);
         expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(1);
         expect(screen.getByText(/1.selected/i)).toBeInTheDocument();
      });
      it.skip('should be able to select multiple by holding Ctrl (or meta)', async () => {
         new SelectTable(defaultArgs);
         await waitForLoadingToResolve();

         const rows = screen.queryAllByRole('row');

         await user.click(rows[0]);
         expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(1);
         expect(screen.getByText(/1.selected/i)).toBeInTheDocument();

         // TODO fix me: user event not working with ctrl
         await fireEvent(rows[3], new MouseEvent('click', { ctrlKey: true }));
         expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(2);
         expect(screen.getByText(/2.selected/i)).toBeInTheDocument();
      });

      it('should be able to unselect multiple by navigating with the arrows', async () => {
         // eslint-disable-next-line no-unused-vars
         const table = new SelectTable(defaultArgs);
         await waitForLoadingToResolve();

         const rows = screen.queryAllByRole('row');

         await user.click(rows[0]);

         await user.keyboard('[ArrowDown]');
         await user.keyboard('[Space]');
         await user.keyboard('[Space]');

         await expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(1);
      });

      it('should be able to select multiple by navigating with the arrows and holding shift', async () => {
         new SelectTable(defaultArgs);
         await waitForLoadingToResolve();

         const rows = screen.queryAllByRole('row');

         await user.click(rows[0]);

         await user.keyboard('{Shift>}[ArrowDown][ArrowDown][ArrowUp]{/Shift}');

         await expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(2);
      });

      it('should behave properly when doing multiple navigating + shift / ctrl', async () => {
         // eslint-disable-next-line no-unused-vars
         const table = new SelectTable(defaultArgs);
         await waitForLoadingToResolve();

         const rows = screen.queryAllByRole('row');

         // select 0 then 1 by holding shift: [0,1]
         await user.click(rows[0]);
         await user.keyboard('{Shift>}[ArrowDown]{/Shift}');
         expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(2);

         // Now, moving somewhere else
         // Go down to 3, hold shift and move up: [3,2]
         await user.keyboard('[ArrowDown][ArrowDown]');
         await user.keyboard('{Shift>}[ArrowUp]{/Shift}');
         expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(2);

         // Now, not holding shift
         // Move up to 1, hit space: [3,2,1]
         await user.keyboard('[ArrowUp][Space]');
         await expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(3);

         // Now, holding CtrL
         await user.keyboard('{Control>}[ArrowUp][Space]{/Control}');
         await expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(5);
      });

      it('should select all when hitting ctrl + A', async () => {
         new SelectTable(defaultArgs);
         await waitForLoadingToResolve();

         await user.click(screen.queryAllByRole('row')[0]);
         await user.keyboard('{Control>}[KeyA]{/Control}');

         await waitFor(async () => {
            await expect(
               screen.getAllByRole('checkbox').filter((input) => input.checked)
            ).toHaveLength(5);
         });
      });

      it('should select all when clicking the select all checkbox', async () => {
         new SelectTable(defaultArgs);
         await waitForLoadingToResolve();

         await user.click(screen.queryByRole('checkbox', { name: /all/i }));

         await expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(5);

         await user.click(screen.queryByRole('checkbox', { name: /all/i }));

         await expect(
            screen.getAllByRole('checkbox').filter((input) => input.checked)
         ).toHaveLength(0);
      });

      it('should select all hitting space/enter on the select all checkbox', async () => {
         new SelectTable(defaultArgs);
         await waitForLoadingToResolve();

         screen.queryByRole('checkbox', { name: /all/i }).focus();
         await user.keyboard('[Space]');

         await waitFor(async () => {
            await expect(
               screen.getAllByRole('checkbox').filter((input) => input.checked)
            ).toHaveLength(5);
         });

         screen.queryByRole('checkbox', { name: /all/i }).focus();
         await user.keyboard('[Enter]');

         await waitFor(async () => {
            await expect(
               screen.getAllByRole('checkbox').filter((input) => input.checked)
            ).toHaveLength(0);
         });
      });
   });

   describe('sorting header', () => {
      it('should sort data in ascending order on the first column by default', async () => {
         const data = [
            { key: 'key-1', values: ['hello', 'world'] },
            { key: 'key-2', values: ['bonjour', 'tennis'] },
            { key: 'key-3', values: ['hallo', 'soccer'] },
            { key: 'key-4', values: ['ola', 'rugby'] },
         ];
         const sortedData = [...data].sort((a, b) =>
            a.values[0] > b.values[0] ? 1 : -1
         );

         new SelectTable({ ...defaultArgs, data });
         await waitForLoadingToResolve();

         const rows = screen.getAllByRole('row');
         for (const [index, row] of rows.entries()) {
            expect(row).toHaveTextContent(sortedData[index].values[0]);
            expect(row).toHaveTextContent(sortedData[index].values[1]);
         }
      });

      it('should sort the data by another column if requested', async () => {
         const data = [
            { key: 'key-1', values: ['hello', 'world'] },
            { key: 'key-2', values: ['bonjour', 'tennis'] },
            { key: 'key-3', values: ['hallo', 'soccer'] },
            { key: 'key-4', values: ['ola', 'rugby'] },
         ];
         const fields = [
            { name: 'header-1', title: 'first column header' },
            { name: 'header-2', title: 'second column header', sort: 'asc' },
         ];
         const sortedData = [...data].sort((a, b) =>
            a.values[1] > b.values[1] ? 1 : -1
         );

         new SelectTable({ ...defaultArgs, fields, data });
         await waitForLoadingToResolve();

         const rows = screen.getAllByRole('row');
         for (const [index, row] of rows.entries()) {
            expect(row).toHaveTextContent(sortedData[index].values[0]);
            expect(row).toHaveTextContent(sortedData[index].values[1]);
         }
      });
      it('should sort the data by ascending order when I click on the header', async () => {
         new SelectTable(defaultArgs);
         await waitForLoadingToResolve();

         const sortedData = [...data].sort((a, b) =>
            a.values[1] > b.values[1] ? 1 : -1
         );

         const headers = screen.getAllByRole('columnheader');
         await user.click(headers[1]);

         const rows = screen.getAllByRole('row');
         for (const [index, row] of rows.entries()) {
            expect(row).toHaveTextContent(sortedData[index].values[0]);
            expect(row).toHaveTextContent(sortedData[index].values[1]);
         }
      });
      it('should sort the data by descending order when I click on a header in ascending mode', async () => {
         new SelectTable(defaultArgs);
         await waitForLoadingToResolve();

         const sortedData = [...data].sort((a, b) =>
            a.values[1] > b.values[1] ? -1 : 1
         );

         const headers = screen.getAllByRole('columnheader');
         await user.click(headers[1]);
         await user.click(headers[1]);

         const rows = screen.getAllByRole('row');
         for (const [index, row] of rows.entries()) {
            expect(row).toHaveTextContent(sortedData[index].values[0]);
            expect(row).toHaveTextContent(sortedData[index].values[1]);
         }
      });
      it('should be able to sort using tab and space', async () => {
         new SelectTable(defaultArgs);
         await waitForLoadingToResolve();

         const sortedData = [...data].sort((a, b) =>
            a.values[1] > b.values[1] ? 1 : -1
         );
         const headers = screen.getAllByRole('columnheader');

         headers[1].focus();
         await user.keyboard('[Space]');

         const rows = screen.getAllByRole('row');
         for (const [index, row] of rows.entries()) {
            expect(row).toHaveTextContent(sortedData[index].values[0]);
            expect(row).toHaveTextContent(sortedData[index].values[1]);
         }
      });
      it('should be able to sort descending using keyboard', async () => {
         new SelectTable(defaultArgs);
         await waitForLoadingToResolve();

         const sortedData = [...data].sort((a, b) =>
            a.values[1] > b.values[1] ? -1 : 1
         );

         let headers = screen.getAllByRole('columnheader');
         headers[1].focus();
         await user.keyboard('[Space]');

         headers = screen.getAllByRole('columnheader');
         headers[1].focus();
         await user.keyboard('[Enter]');

         const rows = screen.getAllByRole('row');
         for (const [index, row] of rows.entries()) {
            expect(row).toHaveTextContent(sortedData[index].values[0]);
            expect(row).toHaveTextContent(sortedData[index].values[1]);
         }
      });
   });

   describe('sort', () => {
      it('should be able to display results using update', async () => {
         const data = [
            { key: 'key-1', values: ['hello', 'world'] },
            { key: 'key-2', values: ['bonjour', 'tennis'] },
            { key: 'key-3', values: ['hallo', 'soccer'] },
            { key: 'key-4', values: ['ola', 'rugby'] },
         ];

         const searchResults = [data[0], data[1]];
         const table = new SelectTable({ ...defaultArgs, data });
         await waitForLoadingToResolve();

         table.update(searchResults);

         expect(screen.getAllByRole('row')).toHaveLength(searchResults.length);
         expect(screen.getAllByRole('columnheader')).toHaveLength(
            searchResults.length
         );
      });
   });
   describe('data fetching', () => {
      it('should show a loading indicator when I update the table by clicking on show more', async () => {
         const spy = vi.fn();
         spy.mockReturnValue(data);
         new SelectTable({
            ...defaultArgs,
            total: 5,
            options: { fetchFn: spy },
         });
         await waitForLoadingToResolve();

         await user.click(screen.getByText(/show.more/i));

         expect(screen.getByAltText('loader')).toBeInTheDocument();
      });
      it('should not be able to click on anything when loading', async () => {
         const spy = vi.fn();
         spy.mockReturnValue(
            new Promise((res) => {
               setTimeout(() => {
                  res(data);
               }, 2000);
            })
         );
         const table = new SelectTable({
            ...defaultArgs,
            total: 5,
            options: { fetchFn: spy },
         });
         await waitForLoadingToResolve();

         await user.click(screen.getByText(/show.more/i));
         await screen.getAllByRole('row')[0].click();

         expect(table.getSelected()).toStrictEqual([]);
      });
   });

   describe('single mode', () => {
      let defaultSingleArgs;
      beforeEach(() => {
         defaultSingleArgs = {
            ...defaultArgs,
            ...{ options: { selectionMode: 'single' } },
         };
      });
      it('can only select one row', async () => {
         const table = new SelectTable(defaultSingleArgs);

         const rows = screen.getAllByRole('row');

         await user.click(rows[0]);
         await user.click(rows[1]);
         await user.click(rows[2]);

         expect(table.getSelected()).toHaveLength(1);
      });

      it('calls the onSelectFn when a selection is made', async () => {
         const spy = vi.fn();
         const args = {
            ...defaultSingleArgs,
            ...{ options: { selectionMode: 'single', onSelectFn: spy } },
         };
         // eslint-disable-next-line no-unused-vars
         const table = new SelectTable(args);

         const rows = screen.getAllByRole('row');

         await user.click(rows[0]);
         await user.click(rows[1]);
         await user.click(rows[2]);

         expect(spy).toHaveBeenCalledTimes(3);
      });
   });
   describe('view mode', () => {
      let defaultViewArgs;
      beforeEach(() => {
         defaultViewArgs = {
            ...defaultArgs,
            ...{ options: { selectionMode: 'view' } },
         };
      });
      it("can't select rows", async () => {
         const table = new SelectTable(defaultViewArgs);

         const rows = screen.getAllByRole('row');

         await user.click(rows[0]);
         await user.click(rows[1]);
         await user.click(rows[2]);

         expect(table.getSelected()).toHaveLength(0);
      });

      it('will not call the onSelectFn when clicking a row', async () => {
         const spy = vi.fn();
         const args = {
            ...defaultViewArgs,
            ...{ options: { selectionMode: 'view', onSelectFn: spy } },
         };
         // eslint-disable-next-line no-unused-vars
         const table = new SelectTable(args);

         const rows = screen.getAllByRole('row');

         await user.click(rows[0]);
         await user.click(rows[1]);
         await user.click(rows[2]);

         expect(spy).not.toHaveBeenCalled();
      });
   });
});
