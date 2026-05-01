import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { FormOa, type Props } from './FormOa';
import { testWrapper } from '~/test/utils';

describe('<AddForm isSubmitting={false} />', () => {
   const onSubmitSpy = vi.fn();
   const defaultProps: Props = {
      onSubmit: onSubmitSpy,
      isSubmitting: false,
      onCancel: vi.fn(),
      isCreatingNewOa: false,
   };

   afterEach(() => {
      onSubmitSpy.mockClear();
   });

   it('should render successfully', () => {
      expect(() => render(<FormOa {...defaultProps} />)).not.toThrow();
   });

   it('should require the name input only in creating mode', async () => {
      const user = userEvent.setup();

      render(
         <FormOa {...{ ...defaultProps, isCreatingNewOa: true }} />,
         testWrapper
      );
      const hostname = screen.getByRole('textbox', { name: /^hostname/i });
      await user.type(hostname, 'hello.world');
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
         expect(screen.getByText(/provide.*\bname/i)).toBeInTheDocument();
      });
      expect(onSubmitSpy).not.toHaveBeenCalled();
   });

   it('should not have a name input in editing mode', () => {
      render(<FormOa {...defaultProps} />, testWrapper);

      expect(screen.queryByRole('textbox', { name: /^name/i })).toBeNull();
   });

   describe('validate name input', () => {
      // The new validations rules are as per the following regular expression: `^[a-zA-Z][a-zA-Z0-9-]*$`
      // see https://jira.statseeker.com/browse/BAU-4451
      it('should not accept names with a dot', async () => {
         const user = userEvent.setup();
         render(<FormOa {...{...defaultProps, isCreatingNewOa: true}} />, testWrapper);
         const nameInput = screen.getByRole('textbox', { name: /^name/i });
         await user.clear(nameInput);
         await user.type(nameInput, 'hello.world');
         await user.click(screen.getByRole('button', { name: /save/i }));
         await waitFor(() =>
            expect(screen.getByText(/invalid.*\bname/i)).toBeInTheDocument()
         );
      });

      it('should not accept names starting with a number', async () => {
         const user = userEvent.setup();
         render(<FormOa {...{...defaultProps, isCreatingNewOa: true}} />, testWrapper);
         const nameInput = screen.getByRole('textbox', { name: /^name/i });
         await user.clear(nameInput);
         await user.type(nameInput, '1hello');
         await user.click(screen.getByRole('button', { name: /save/i }));
         await waitFor(() =>
            expect(screen.getByText(/invalid.*\bname/i)).toBeInTheDocument()
         );
      });
   });

   it('should require the hostname input', async () => {
      const user = userEvent.setup();

      render(<FormOa {...defaultProps} />, testWrapper);
      const ipaddress = screen.getByRole('textbox', { name: /^ip address/i });
      await user.clear(ipaddress);
      await user.type(ipaddress, 'hello.world');
      await user.clear(screen.getByRole('textbox', { name: /hostname/i }));
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
         expect(screen.getByText(/provide.*hostname/i)).toBeInTheDocument();
      });
   });
   it('should require the ip address input', async () => {
      const user = userEvent.setup();

      render(<FormOa {...defaultProps} />, testWrapper);
      const ipaddress = screen.getByRole('textbox', { name: /^ip address/i });
      await user.clear(ipaddress);
      await user.type(ipaddress, 'hello.world');
      await user.clear(screen.getByRole('textbox', { name: /ip address/i }));
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
         expect(screen.getByText(/provide.*ip address/i)).toBeInTheDocument();
      });
      expect(onSubmitSpy).not.toHaveBeenCalled();
   });
   it('should ensure that the ip address is has the format of an ip address', async () => {
      const user = userEvent.setup();

      render(<FormOa {...defaultProps} />, testWrapper);

      await user.type(
         screen.getByRole('textbox', { name: /ip address/i }),
         'hello-world'
      );
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
         expect(screen.getByText(/invalid.*ip address/i)).toBeInTheDocument();
      });
      expect(onSubmitSpy).not.toHaveBeenCalled();
   });
   it('should require the netmask input', async () => {
      const user = userEvent.setup();

      render(<FormOa {...defaultProps} />, testWrapper);
      const ipaddress = screen.getByRole('textbox', { name: /^ip address/i });
      await user.clear(ipaddress);
      await user.type(ipaddress, 'hello.world');
      await user.clear(screen.getByRole('textbox', { name: /netmask/i }));
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
         expect(screen.getByText(/provide.*netmask/i)).toBeInTheDocument();
      });
      expect(onSubmitSpy).not.toHaveBeenCalled();
   });
   it('should ensure that the netmask is has the format of an ip address', async () => {
      const user = userEvent.setup();

      render(<FormOa {...defaultProps} />, testWrapper);

      await user.type(
         screen.getByRole('textbox', { name: /netmask/i }),
         'hello-world'
      );
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
         expect(screen.getByText(/invalid.*netmask/i)).toBeInTheDocument();
      });
      expect(onSubmitSpy).not.toHaveBeenCalled();
   });
   it('should require the default gateway input', async () => {
      const user = userEvent.setup();

      render(<FormOa {...defaultProps} />, testWrapper);
      const ipaddress = screen.getByRole('textbox', { name: /^ip address/i });
      await user.clear(ipaddress);
      await user.type(ipaddress, 'hello.world');
      await user.clear(
         screen.getByRole('textbox', { name: /default gateway/i })
      );
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
         expect(
            screen.getByText(/provide.*default gateway/i)
         ).toBeInTheDocument();
      });
      expect(onSubmitSpy).not.toHaveBeenCalled();
   });
   it('should ensure that the default gateway is has the format of an ip address', async () => {
      const user = userEvent.setup();

      render(<FormOa {...defaultProps} />, testWrapper);

      await user.type(
         screen.getByRole('textbox', { name: /default gateway/i }),
         'hello-world'
      );
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
         expect(
            screen.getByText(/invalid.*default.*gateway/i)
         ).toBeInTheDocument();
      });
      expect(onSubmitSpy).not.toHaveBeenCalled();
   });
   it('should ensure that the timeout is not empty', async () => {
      const user = userEvent.setup();

      render(<FormOa {...defaultProps} />, testWrapper);

      await user.clear(screen.getByRole('textbox', { name: /timeout/i }));
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
         expect(screen.getByText(/provide.*timeout/i)).toBeInTheDocument();
      });
      expect(onSubmitSpy).not.toHaveBeenCalled();
   });

   it('should ensure that the timeout is a number', async () => {
      const user = userEvent.setup();

      render(<FormOa {...defaultProps} />, testWrapper);

      await user.type(
         screen.getByRole('textbox', { name: /timeout/i }),
         'hello-world'
      );
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
         expect(screen.getByText(/invalid.*timeout/i)).toBeInTheDocument();
      });
      expect(onSubmitSpy).not.toHaveBeenCalled();
   });

   it('should ensure that the timeout is above 0', async () => {
      const user = userEvent.setup();

      render(<FormOa {...defaultProps} />, testWrapper);

      await user.type(screen.getByRole('textbox', { name: /timeout/i }), '-1');
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
         expect(screen.getByText(/invalid.*timeout/i)).toBeInTheDocument();
      });
      expect(onSubmitSpy).not.toHaveBeenCalled();
   });

   it('should ensure that the timeout is less than 30', async () => {
      const user = userEvent.setup();

      render(<FormOa {...defaultProps} />, testWrapper);

      await user.type(screen.getByRole('textbox', { name: /timeout/i }), '31');
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
         expect(screen.getByText(/invalid.*timeout/i)).toBeInTheDocument();
      });
      expect(onSubmitSpy).not.toHaveBeenCalled();
   });

   it('should ensure that the latitude has the right format', async () => {
      const user = userEvent.setup();

      render(<FormOa {...defaultProps} />, testWrapper);

      await user.type(
         screen.getByRole('textbox', { name: /latitude/i }),
         'hello-world'
      );
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
         expect(screen.getByText(/invalid.*latitude/i)).toBeInTheDocument();
      });
      expect(onSubmitSpy).not.toHaveBeenCalled();
   });
   it('should ensure that the longtitude has the right format', async () => {
      const user = userEvent.setup();

      render(<FormOa {...defaultProps} />, testWrapper);

      await user.type(
         screen.getByRole('textbox', { name: /longitude/i }),
         'hello-world'
      );
      await user.click(screen.getByRole('button', { name: /save/i }));

      await waitFor(() => {
         expect(screen.getByText(/invalid.*longitude/i)).toBeInTheDocument();
      });
      expect(onSubmitSpy).not.toHaveBeenCalled();
   });
   it('should have a button to cancel', async () => {
      const user = userEvent.setup();

      render(
         <FormOa {...{ ...defaultProps, onCancel: onSubmitSpy }} />,
         testWrapper
      );

      await user.click(screen.getByRole('button', { name: /cancel/i }));

      expect(onSubmitSpy).toHaveBeenCalled();
   });

   it('should update the form if all the validation rules are respected', async () => {
      const user = userEvent.setup();

      render(<FormOa {...defaultProps} />, testWrapper);

      const inputNames = [
         'name',
         'hostname',
         'ipAddress',
         'netmask',
         'defaultGateway',
         'timeout',
         'region',
         'location',
         'site',
         'latitude',
         'longitude',
      ] as const;

      const values: Record<typeof inputNames[number], string> = {
         name: 'my-name',
         hostname: 'my-hostname',
         ipAddress: '127.0.0.1',
         netmask: '255.255.255.0',
         defaultGateway: '127.0.0.1',
         location: 'Galaxy',
         timeout: '10',
         region: 'Solar system',
         site: 'Earth',
         latitude: '12.234',
         longitude: '123.456',
      };

      const inputs: Record<typeof inputNames[number], HTMLElement> = inputNames
         .filter((input) => input !== 'name')
         .map((name) => {
            const regexp = new RegExp(
               `^${name
                  .split('')
                  .map((letter) =>
                     letter.toUpperCase() === letter ? ` ${letter}` : letter
                  )
                  .join('')}.*`,
               'i'
            );
            return { [name]: screen.getByRole('textbox', { name: regexp }) };
         })
         .reduce(
            (previous, current) => ({ ...previous, ...current }),
            {}
         ) as Record<typeof inputNames[number], HTMLElement>;

      await user.clear(inputs['timeout']);
      await user.type(inputs['hostname'], values['hostname']);
      await user.type(inputs['ipAddress'], values['ipAddress']);
      await user.type(inputs['netmask'], values['netmask']);
      await user.type(inputs['defaultGateway'], values['defaultGateway']);
      await user.type(inputs['timeout'], values['timeout']);
      await user.type(inputs['region'], values['region']);
      await user.type(inputs['site'], values['site']);
      await user.type(inputs['location'], values['location']);
      await user.type(inputs['latitude'], values['latitude']);
      await user.type(inputs['longitude'], values['longitude']);

      await user.click(screen.getByRole('button', { name: /save/i }));

      // A bit of hack around the expected results to match the API
      const expectedResults: Partial<typeof values> & {
         ipaddress: string;
         gateway: string;
      } = {
         ...values,
         ipaddress: values.ipAddress,
         gateway: values.defaultGateway,
      };
      delete expectedResults.name;
      delete expectedResults.ipAddress;
      delete expectedResults.defaultGateway;

      await waitFor(() => expect(onSubmitSpy).toHaveBeenCalled());
      expect(onSubmitSpy.mock.calls[0][0]).toEqual(
         expect.objectContaining(expectedResults)
      ); //* Again, pretty ugly but the objectContain doesn't work within the haveBeenCalledWith !
   });

   it('should disable the button while submitting', () => {
      render(
         <FormOa {...{ ...defaultProps, isSubmitting: true }} />,
         testWrapper
      );

      screen.getAllByRole('button').map((button) => {
         expect(button).toBeDisabled();
      });
   });
});
