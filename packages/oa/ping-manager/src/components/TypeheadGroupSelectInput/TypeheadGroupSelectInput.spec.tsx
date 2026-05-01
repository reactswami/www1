import { Box } from '@chakra-ui/react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, type HttpHandler, HttpResponse } from 'msw';
import { vi } from 'vitest';
import { TypeheadGroupSelectInput } from './TypeheadGroupSelectInput';
import { server } from '~/test/server/node';
import { createAPIError, stripUrlParameters, testWrapper } from '~/test/utils';

const spy = vi.fn();
describe('<TypeheadGroupSelectInput />', () => {
   it('should render successfully', () => {
      expect(() =>
         render(<TypeheadGroupSelectInput setGroupFilter={spy} />, testWrapper)
      ).not.toThrow();
   });

   it.skip('should display the list of groups on focus', async () => {
      const user = userEvent.setup();

      render(<TypeheadGroupSelectInput setGroupFilter={spy} />, testWrapper);

      await user.click(screen.getByRole('textbox'));

      expect(screen.getByRole('list')).toBeInTheDocument();
   });

   it.skip('should hide the list of groups when hitting escape', async () => {
      const user = userEvent.setup();

      render(<TypeheadGroupSelectInput setGroupFilter={spy} />, testWrapper);
      await user.click(screen.getByRole('textbox'));
      await user.keyboard('{Escape}');

      expect(screen.queryByRole('list')).toBeNull();
   });

   it.skip('should hide the list of groups whenClick outside of the textbox', async () => {
      const user = userEvent.setup();
      const Container = () => (
         <Box padding={96}>
            <h1>outside</h1>
            <TypeheadGroupSelectInput setGroupFilter={vi.fn()} />
         </Box>
      );

      render(<Container />, testWrapper);
      await user.click(screen.getByRole('textbox'));
      await user.click(screen.getByRole('heading', { name: /outside/i }));

      expect(screen.queryByRole('list')).toBeNull();
   });

   it('should allow me to cycle through the options by hitting tab', async () => {
      const user = userEvent.setup();
      const groups = [
         { name: 'hello', id: 2 },
         { name: 'world', id: 3 },
         { name: '!', id: 4 },
         { name: '🐑', id: 5 },
      ];
      const handler = [
         http.get('/cgi/internal_api', () =>
            HttpResponse.json({
               success: true,
               errcode: 0,
               errmsg: 'ok',
               time: 1721696923,
               sequence: 2,
               data_total: groups.length,
               data: groups,
               describe: null,
            })
         ),
      ];
      server.use(...handler);
      render(<TypeheadGroupSelectInput setGroupFilter={vi.fn()} />, testWrapper);
      await user.click(screen.getByRole('textbox', {name: /Select group/i}));
      await waitFor(() => expect(screen.queryAllByText(/loading/i)).toHaveLength(0));
      const options = screen.getAllByRole('listitem');

      for (let i = 0; i < options.length; i++) {
         await user.keyboard('{Tab}');
         waitFor(() => expect(options[i]).toHaveFocus());
      }
   });

   it('should set the group filter function when clicking on a item', async () => {
      const user = userEvent.setup();
      const spy = vi.fn();
      const groups = [
         { name: 'hello', id: 2 },
         { name: 'world', id: 3 },
         { name: '!', id: 4 },
      ];
      const CHOSEN_GROUP_INDEX = Math.floor(Math.random() * groups.length); // Random group
      const handler = [
         http.post('/cgi/internal_api', () =>
            HttpResponse.json({
               success: true,
               errcode: 0,
               errmsg: 'ok',
               time: 1721696923,
               sequence: 2,
               data_total: 3,
               data: groups,
               describe: null,
            })
         ),
      ] satisfies HttpHandler[];
      server.use(...handler);
      render(<TypeheadGroupSelectInput setGroupFilter={spy} />, testWrapper);

      await user.click(screen.getByRole('textbox'));
      const options = screen.getAllByRole('listitem');
      expect(options).toHaveLength(groups.length + 1); // We add the 'All groups to it !'

      const choice = options[CHOSEN_GROUP_INDEX + 1];
      await user.click(choice);
      expect(spy).toHaveBeenCalledWith(groups[CHOSEN_GROUP_INDEX].id);
   });

   it('should display an error message when there is an error retrieving the groups', async () => {
      const user = userEvent.setup();
      const spy = vi.fn();
      const handler = [
         http.post(stripUrlParameters('/cgi/internal_api'), () =>
            HttpResponse.json(createAPIError, { status: 500 })
         ),
      ];
      server.use(...handler);
      render(<TypeheadGroupSelectInput setGroupFilter={spy} />, testWrapper);

      await user.click(screen.getByRole('textbox'));
      const options = screen.getAllByRole('listitem');
      expect(options).toHaveLength(1); // The chakra toast is a list item too, so 2!
      expect(within(options[0]).getByText(/error/i)).toBeInTheDocument();
   });
});
