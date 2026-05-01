import { type SNMPCredential } from '@statseeker/api/internal_api/entities';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { waitFor, screen, render, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ReactNode } from 'react';
import { vi } from 'vitest';
import describeJson from './__tests__/mock_describe_api.json';
import { type CredentialFormProps } from './types';

export const testWrapper = {
   wrapper: ({ children }: { children: ReactNode }) => {
      const queryClient = new QueryClient();
      return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
   },
};

describe('<CredentialsForm />', async () => {
   it('default credential add v3 default', async () => {
      const defaultValues: Omit<SNMPCredential, 'id' | 'name'> = {
         version: 3,
      };
      const defaultProps: CredentialFormProps = {
         onSubmit: vi.fn(),
         mutationIsSuccess: false,
         mode: 'add',
         defaultValues,
      };
      vi.doMock('@tanstack/react-query', async (importOriginal) => {
         const actual: any = await importOriginal();
         return {
            ...actual,
            useQuery: vi.fn().mockReturnValue({
               isLoading: false,
               data: {
                  describe: describeJson,
               },
            }),
         };
      });

      const { CredentialsForm } = await import('./CredentialsForm');
      render(<CredentialsForm {...defaultProps} />, testWrapper);
      await waitFor(() =>
         expect(screen.getByText(/These SNMP credentials will be saved in/i)).toBeInTheDocument()
      );
      await waitFor(() => expect(screen.getAllByText(/Authentication */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/username/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/context/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/community */i)).not.toBeInTheDocument());
      await waitFor(() =>
         expect(screen.queryByLabelText(/authentication password */i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password */i)).not.toBeInTheDocument()
      );
   });

   it('default credential add v3 default submit', async () => {
      const submitMock = vi.fn();
      const defaultValues: Omit<SNMPCredential, 'id' | 'name'> = {
         version: 2,
      };
      const defaultProps: CredentialFormProps = {
         onSubmit: submitMock,
         mutationIsSuccess: false,
         mode: 'add',
         defaultValues,
      };
      vi.doMock('@tanstack/react-query', async (importOriginal) => {
         const actual: any = await importOriginal();
         return {
            ...actual,
            useQuery: vi.fn().mockReturnValue({
               isLoading: false,
               data: {
                  describe: describeJson,
               },
            }),
         };
      });

      const { CredentialsForm } = await import('./CredentialsForm');
      render(<CredentialsForm {...defaultProps} />, testWrapper);
      await waitFor(() =>
         expect(screen.getByText(/These SNMP credentials will be saved in/i)).toBeInTheDocument()
      );
      await waitFor(() => expect(screen.queryByText(/Authentication */i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/username/i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/context/i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/community */i)).toBeInTheDocument());
      await waitFor(() =>
         expect(screen.queryByLabelText(/authentication password */i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password */i)).not.toBeInTheDocument()
      );

      userEvent.selectOptions(screen.getByTestId('snmp-version'), ['3']);
      await waitFor(() => expect(screen.getAllByText(/Authentication */i)[0]).toBeInTheDocument());

      fireEvent.click(screen.getByTestId('snmp-submit'));
      await waitFor(() =>
         expect(screen.getAllByText(/Please provide a name/i)[0]).toBeInTheDocument()
      );
      expect(submitMock).not.toHaveBeenCalled();
   });

   it('default credential add v3 submit for default auth sha and privacy aes', async () => {
      const submitMock = vi.fn();
      const defaultValues: Omit<SNMPCredential, 'id' | 'name'> = {
         version: 2,
      };
      const defaultProps: CredentialFormProps = {
         onSubmit: submitMock,
         mutationIsSuccess: false,
         mode: 'add',
         defaultValues,
      };
      vi.doMock('@tanstack/react-query', async (importOriginal) => {
         const actual: any = await importOriginal();
         return {
            ...actual,
            useQuery: vi.fn().mockReturnValue({
               isLoading: false,
               data: {
                  describe: describeJson,
               },
            }),
         };
      });

      const { CredentialsForm } = await import('./CredentialsForm');
      render(<CredentialsForm {...defaultProps} />, testWrapper);
      userEvent.selectOptions(screen.getByTestId('snmp-version'), ['3']);

      await waitFor(() =>
         expect(screen.getByText(/These SNMP credentials will be saved in/i)).toBeInTheDocument()
      );
      await waitFor(() => expect(screen.getAllByText(/Authentication */i)[0]).toBeInTheDocument());
      userEvent.selectOptions(screen.getByTestId('snmp-authentication'), ['sha']);

      await waitFor(() => expect(screen.getAllByText(/Privacy */i)[0]).toBeInTheDocument());
      userEvent.selectOptions(screen.getByTestId('snmp-privacy'), ['aes']);

      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/username/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/context/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/community */i)).not.toBeInTheDocument());
      await waitFor(() =>
         expect(screen.queryByLabelText(/authentication password */i)).toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password */i)).toBeInTheDocument()
      );
      fireEvent.change(screen.getAllByLabelText(/Name */i)[0], {
         target: { value: 'new_snmp_config' },
      });
      fireEvent.change(screen.getByLabelText(/username/i), { target: { value: '' } });
      fireEvent.change(screen.getByLabelText(/privacy password */i), { target: { value: '' } });

      fireEvent.click(screen.getByTestId('snmp-submit'));
      await waitFor(() =>
         expect(screen.queryByText(/Please provide a name/i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.getAllByText(/Please provide a privacy password/i)[0]).toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.getAllByText(/Please provide a privacy password/i)[0]).toBeInTheDocument()
      );
      await waitFor(() =>
         expect(
            screen.getAllByText(/Please provide an authentication password/i)[0]
         ).toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.getAllByText(/Please provide a privacy password/i)[0]).toBeInTheDocument()
      );

      expect(submitMock).not.toHaveBeenCalled();
   });

   it('default credential add default v3 submit called with credentials', async () => {
      const expectedObject = {
         auth_method: 'sha',
         auth_pass: 'auth_pass',
         auth_user: 'auth_admin',
         community: '',
         context: undefined,
         name: 'new_snmp_config',
         priv_method: 'aes',
         priv_pass: 'priv_pass',
         version: 3,
      };

      const submit = {
         submitMock: vi.fn(),
      };

      const submitSpy = vi.spyOn(submit, 'submitMock');
      const defaultValues: Omit<SNMPCredential, 'id' | 'name'> = {
         version: 2,
      };
      const defaultProps: CredentialFormProps = {
         onSubmit: submit.submitMock,
         mutationIsSuccess: false,
         mode: 'add',
         defaultValues,
      };
      vi.doMock('@tanstack/react-query', async (importOriginal) => {
         const actual: any = await importOriginal();
         return {
            ...actual,
            useQuery: vi.fn().mockReturnValue({
               isLoading: false,
               data: {
                  describe: describeJson,
               },
            }),
         };
      });

      const { CredentialsForm } = await import('./CredentialsForm');
      render(<CredentialsForm {...defaultProps} />, testWrapper);
      userEvent.selectOptions(screen.getByTestId('snmp-version'), ['3']);

      await waitFor(() =>
         expect(screen.getByText(/These SNMP credentials will be saved in/i)).toBeInTheDocument()
      );
      await waitFor(() => expect(screen.getAllByText(/Authentication */i)[0]).toBeInTheDocument());
      userEvent.selectOptions(screen.getByTestId('snmp-authentication'), ['sha']);

      await waitFor(() => expect(screen.getAllByText(/Privacy */i)[0]).toBeInTheDocument());
      userEvent.selectOptions(screen.getByTestId('snmp-privacy'), ['aes']);

      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/username/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/context/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/community */i)).not.toBeInTheDocument());
      await waitFor(() =>
         expect(screen.queryByLabelText(/authentication password */i)).toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password */i)).toBeInTheDocument()
      );
      fireEvent.change(screen.getAllByLabelText(/Name */i)[0], {
         target: { value: 'new_snmp_config' },
      });
      fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'auth_admin' } });
      fireEvent.change(screen.getByLabelText(/privacy password */i), {
         target: { value: 'priv_pass' },
      });
      fireEvent.change(screen.getByLabelText(/authentication password */i), {
         target: { value: 'auth_pass' },
      });

      fireEvent.click(screen.getByTestId('snmp-submit'));
      await waitFor(() =>
         expect(screen.queryByText(/Please provide a name/i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByText(/Please provide a privacy password/i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByText(/Please provide a privacy password/i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(
            screen.queryByText(/Please provide an authentication password/i)
         ).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByText(/Please provide a privacy password/i)).not.toBeInTheDocument()
      );

      await waitFor(() =>
         expect(submitSpy).toHaveBeenCalledWith(
            expect.objectContaining<Omit<SNMPCredential, 'id' | 'name'>>(expectedObject),
            undefined
         )
      );
   });

   it('credential add v3 with authentication method sha', async () => {
      const defaultValues: Omit<SNMPCredential, 'id' | 'name'> = {
         version: 3,
         auth_method: 'sha',
      };
      const defaultProps: CredentialFormProps = {
         onSubmit: vi.fn(),
         mutationIsSuccess: false,
         mode: 'add',
         defaultValues,
      };
      vi.doMock('@tanstack/react-query', async (importOriginal) => {
         const actual: any = await importOriginal();
         return {
            ...actual,
            useQuery: vi.fn().mockReturnValue({
               isLoading: false,
               data: {
                  describe: describeJson,
               },
            }),
         };
      });

      const { CredentialsForm } = await import('./CredentialsForm');
      render(<CredentialsForm {...defaultProps} />, testWrapper);
      await waitFor(() =>
         expect(screen.getByText(/These SNMP credentials will be saved in/i)).toBeInTheDocument()
      );
      await waitFor(() => expect(screen.getAllByText(/Authentication */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/Privacy */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/username/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/context/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/community */i)).not.toBeInTheDocument());
      await waitFor(() =>
         expect(screen.getByLabelText(/authentication password */i)).toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password */i)).not.toBeInTheDocument()
      );
   });

   it('credential add v3 with privacy method aes', async () => {
      const defaultValues: Omit<SNMPCredential, 'id' | 'name'> = {
         version: 3,
         auth_method: 'sha',
         priv_method: 'aes',
      };
      const defaultProps: CredentialFormProps = {
         onSubmit: vi.fn(),
         mutationIsSuccess: false,
         mode: 'add',
         defaultValues,
      };
      vi.doMock('@tanstack/react-query', async (importOriginal) => {
         const actual: any = await importOriginal();
         return {
            ...actual,
            useQuery: vi.fn().mockReturnValue({
               isLoading: false,
               data: {
                  describe: describeJson,
               },
            }),
         };
      });

      const { CredentialsForm } = await import('./CredentialsForm');
      render(<CredentialsForm {...defaultProps} />, testWrapper);
      await waitFor(() =>
         expect(screen.getByText(/These SNMP credentials will be saved in/i)).toBeInTheDocument()
      );
      await waitFor(() => expect(screen.getAllByText(/Authentication */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Privacy */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/username/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/context/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/community */i)).not.toBeInTheDocument());
      await waitFor(() =>
         expect(screen.getByLabelText(/authentication password */i)).toBeInTheDocument()
      );
      await waitFor(() => expect(screen.getByLabelText(/privacy password */i)).toBeInTheDocument());
   });

   it('credential add v3 changing the authentication method sha to none ', async () => {
      const defaultValues: Omit<SNMPCredential, 'id' | 'name'> = {
         version: 3,
         auth_method: 'sha',
      };
      const defaultProps: CredentialFormProps = {
         onSubmit: vi.fn(),
         mutationIsSuccess: false,
         mode: 'add',
         defaultValues,
      };
      vi.doMock('@tanstack/react-query', async (importOriginal) => {
         const actual: any = await importOriginal();
         return {
            ...actual,
            useQuery: vi.fn().mockReturnValue({
               isLoading: false,
               data: {
                  describe: describeJson,
               },
            }),
         };
      });

      const { CredentialsForm } = await import('./CredentialsForm');
      render(<CredentialsForm {...defaultProps} />, testWrapper);
      userEvent.selectOptions(screen.getByTestId('snmp-authentication'), ['']);

      await waitFor(() =>
         expect(screen.getByText(/These SNMP credentials will be saved in/i)).toBeInTheDocument()
      );
      await waitFor(() => expect(screen.getAllByText(/Authentication */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/Privacy */i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/username/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/context/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/community */i)).not.toBeInTheDocument());
      await waitFor(() =>
         expect(screen.queryByLabelText(/authentication password */i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password */i)).not.toBeInTheDocument()
      );
   });

   it('credential add v3 and change privacy method aes to none to aes', async () => {
      const defaultValues: Omit<SNMPCredential, 'id' | 'name'> = {
         version: 3,
         auth_method: 'sha',
         priv_method: 'aes',
         priv_pass: 'test_pass',
      };
      const defaultProps: CredentialFormProps = {
         onSubmit: vi.fn(),
         mutationIsSuccess: false,
         mode: 'add',
         defaultValues,
      };
      vi.doMock('@tanstack/react-query', async (importOriginal) => {
         const actual: any = await importOriginal();
         return {
            ...actual,
            useQuery: vi.fn().mockReturnValue({
               isLoading: false,
               data: {
                  describe: describeJson,
               },
            }),
         };
      });

      const { CredentialsForm } = await import('./CredentialsForm');
      render(<CredentialsForm {...defaultProps} />, testWrapper);
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/privacy password */i).value).toBe(
            'test_pass'
         )
      );
      userEvent.selectOptions(screen.getByTestId('snmp-privacy'), ['']);
      await waitFor(() =>
         expect(screen.getByText(/These SNMP credentials will be saved in/i)).toBeInTheDocument()
      );
      await waitFor(() => expect(screen.getAllByText(/Authentication */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/Privacy */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/username/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/context/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/community */i)).not.toBeInTheDocument());
      await waitFor(() =>
         expect(screen.getByLabelText(/authentication password */i)).toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password */i)).not.toBeInTheDocument()
      );
      userEvent.selectOptions(screen.getByTestId('snmp-privacy'), ['aes']);
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/privacy password */i).value).toBe('')
      );
   });

   it('credential add v3 and change auth method from sha to none to sha with privacy aes', async () => {
      const defaultValues: Omit<SNMPCredential, 'id' | 'name'> = {
         version: 3,
         auth_method: 'sha',
         auth_user: 'auth_admin',
         auth_pass: 'auth_pass',
         priv_method: 'aes',
         priv_pass: 'test_pass',
      };
      const defaultProps: CredentialFormProps = {
         onSubmit: vi.fn(),
         mutationIsSuccess: false,
         mode: 'add',
         defaultValues,
      };
      vi.doMock('@tanstack/react-query', async (importOriginal) => {
         const actual: any = await importOriginal();
         return {
            ...actual,
            useQuery: vi.fn().mockReturnValue({
               isLoading: false,
               data: {
                  describe: describeJson,
               },
            }),
         };
      });

      const { CredentialsForm } = await import('./CredentialsForm');
      render(<CredentialsForm {...defaultProps} />, testWrapper);
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/authentication password */i).value).toBe(
            'auth_pass'
         )
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/username/i).value).toBe('auth_admin')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/privacy password */i).value).toBe(
            'test_pass'
         )
      );
      userEvent.selectOptions(screen.getByTestId('snmp-authentication'), ['']);
      await waitFor(() =>
         expect(screen.getByText(/These SNMP credentials will be saved in/i)).toBeInTheDocument()
      );
      await waitFor(() => expect(screen.getAllByText(/Authentication */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/Privacy */i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/username/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/context/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/community */i)).not.toBeInTheDocument());
      await waitFor(() =>
         expect(screen.queryByLabelText(/authentication password */i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/authentication password */i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password */i)).not.toBeInTheDocument()
      );
      userEvent.selectOptions(screen.getByTestId('snmp-authentication'), ['sha']);
      await waitFor(() => expect(screen.queryByLabelText(/Privacy */i)).toBeInTheDocument());
      userEvent.selectOptions(screen.getByTestId('snmp-privacy'), ['aes']);
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/authentication password */i).value).toBe(
            ''
         )
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/username/i).value).toBe('auth_admin')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/privacy password */i).value).toBe('')
      );
   });

   it('credential add v3 with privacy method aes change snmp version from v3 to v2 to v3', async () => {
      const defaultValues: Omit<SNMPCredential, 'id' | 'name'> = {
         version: 3,
         auth_method: 'sha',
         priv_method: 'aes',
         auth_pass: 'auth_pass',
         auth_user: 'auth_admin',
         priv_pass: 'priv_pass',
         context: 'default',
      };
      const defaultProps: CredentialFormProps = {
         onSubmit: vi.fn(),
         mutationIsSuccess: false,
         mode: 'add',
         defaultValues,
      };
      vi.doMock('@tanstack/react-query', async (importOriginal) => {
         const actual: any = await importOriginal();
         return {
            ...actual,
            useQuery: vi.fn().mockReturnValue({
               isLoading: false,
               data: {
                  describe: describeJson,
               },
            }),
         };
      });

      const { CredentialsForm } = await import('./CredentialsForm');
      render(<CredentialsForm {...defaultProps} />, testWrapper);
      userEvent.selectOptions(screen.getByTestId('snmp-version'), ['2']);

      await waitFor(() =>
         expect(screen.getByText(/These SNMP credentials will be saved in/i)).toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/Authentication */i)).not.toBeInTheDocument()
      );
      await waitFor(() => expect(screen.queryByText(/Privacy */i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/username/i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/context/i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/community */i)).toBeInTheDocument());
      await waitFor(() =>
         expect(screen.queryByLabelText(/authentication password */i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password */i)).not.toBeInTheDocument()
      );
      userEvent.selectOptions(screen.getByTestId('snmp-version'), ['3']);
      await waitFor(() => expect(screen.getAllByText(/Authentication */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByText(/Privacy */i)).not.toBeInTheDocument());
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/username/i).value).toBe('')
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/authentication password */i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password */i)).not.toBeInTheDocument()
      );
   });

   it('credential add v3 with privacy method aes change snmp version from v3 to v1', async () => {
      const defaultValues: Omit<SNMPCredential, 'id' | 'name'> = {
         version: 3,
         auth_method: 'sha',
         priv_method: 'aes',
      };
      const defaultProps: CredentialFormProps = {
         onSubmit: vi.fn(),
         mutationIsSuccess: false,
         mode: 'add',
         defaultValues,
      };
      vi.doMock('@tanstack/react-query', async (importOriginal) => {
         const actual: any = await importOriginal();
         return {
            ...actual,
            useQuery: vi.fn().mockReturnValue({
               isLoading: false,
               data: {
                  describe: describeJson,
               },
            }),
         };
      });

      const { CredentialsForm } = await import('./CredentialsForm');
      render(<CredentialsForm {...defaultProps} />, testWrapper);
      userEvent.selectOptions(screen.getByTestId('snmp-version'), ['1']);

      await waitFor(() =>
         expect(screen.getByText(/These SNMP credentials will be saved in/i)).toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/Authentication */i)).not.toBeInTheDocument()
      );
      await waitFor(() => expect(screen.queryByText(/Privacy */i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/username/i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/context/i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/community */i)).toBeInTheDocument());
      await waitFor(() =>
         expect(screen.queryByLabelText(/authentication password */i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password */i)).not.toBeInTheDocument()
      );
   });

   it('default edit v3 with no authentication and no privacy', async () => {
      const defaultValues: SNMPCredential = {
         version: 3,
         id: 100,
         name: 'default2',
         auth_method: '',
         priv_method: '',
         context: 'public',
      };

      const defaultProps: CredentialFormProps = {
         onSubmit: vi.fn(),
         mutationIsSuccess: false,
         mode: 'edit',
         deviceCount: 0,
         defaultValues,
      };
      vi.doMock('@tanstack/react-query', async (importOriginal) => {
         const actual: any = await importOriginal();
         return {
            ...actual,
            useQuery: vi.fn().mockReturnValue({
               isLoading: false,
               data: {
                  describe: describeJson,
               },
            }),
         };
      });

      const { CredentialsForm } = await import('./CredentialsForm');
      render(<CredentialsForm {...defaultProps} />, testWrapper);
      await waitFor(() =>
         expect(screen.getByText(/These SNMP credentials will be saved in/i)).toBeInTheDocument()
      );
      await waitFor(() => expect(screen.getAllByText(/Authentication */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/username/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/context/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/community */i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.queryByText(/Privacy */i)).not.toBeInTheDocument());
      await waitFor(() =>
         expect(screen.queryByLabelText(/authentication password */i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password */i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/username/i).value).toBe('')
      );

      await waitFor(() =>
         expect(
            screen.getByLabelText<HTMLInputElement>(/username/i).getAttribute('placeholder')
         ).toBe('unchanged')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-version').value).toBe('3')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/Name */).value).toBe('default2')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-authentication').value).toBe('')
      );
   });

   it('default edit v3 with sha256 authentication and no privacy', async () => {
      const defaultValues: SNMPCredential = {
         version: 3,
         id: 100,
         name: 'default2',
         auth_method: 'sha256',
         priv_method: '',
         context: 'public',
      };

      const defaultProps: CredentialFormProps = {
         onSubmit: vi.fn(),
         mutationIsSuccess: false,
         mode: 'edit',
         deviceCount: 0,
         defaultValues,
      };
      vi.doMock('@tanstack/react-query', async (importOriginal) => {
         const actual: any = await importOriginal();
         return {
            ...actual,
            useQuery: vi.fn().mockReturnValue({
               isLoading: false,
               data: {
                  describe: describeJson,
               },
            }),
         };
      });

      const { CredentialsForm } = await import('./CredentialsForm');
      render(<CredentialsForm {...defaultProps} />, testWrapper);
      await waitFor(() =>
         expect(screen.getByText(/These SNMP credentials will be saved in/i)).toBeInTheDocument()
      );
      await waitFor(() => expect(screen.getAllByText(/Authentication */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/username/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/context/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/community */i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.queryByText(/Privacy */i)).toBeInTheDocument());
      await waitFor(() =>
         expect(screen.queryByLabelText(/authentication password/i)).toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password/i)).not.toBeInTheDocument()
      );

      await waitFor(() =>
         expect(
            screen.getByLabelText<HTMLInputElement>(/username/i).getAttribute('placeholder')
         ).toBe('unchanged')
      );
      await waitFor(() =>
         expect(
            screen
               .getByLabelText<HTMLInputElement>(/authentication password/i)
               .getAttribute('placeholder')
         ).toBe('unchanged')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/authentication password/i).value).toBe('')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/username/i).value).toBe('')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-version').value).toBe('3')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/Name */).value).toBe('default2')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-authentication').value).toBe('sha256')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-privacy').value).toBe('')
      );
   });

   it('default edit v3 with sha256 authentication and aes privacy', async () => {
      const defaultValues: SNMPCredential = {
         version: 3,
         id: 100,
         name: 'default2',
         auth_method: 'sha256',
         priv_method: 'aes',
         context: 'public',
      };

      const defaultProps: CredentialFormProps = {
         onSubmit: vi.fn(),
         mutationIsSuccess: false,
         mode: 'edit',
         deviceCount: 0,
         defaultValues,
      };
      vi.doMock('@tanstack/react-query', async (importOriginal) => {
         const actual: any = await importOriginal();
         return {
            ...actual,
            useQuery: vi.fn().mockReturnValue({
               isLoading: false,
               data: {
                  describe: describeJson,
               },
            }),
         };
      });

      const { CredentialsForm } = await import('./CredentialsForm');
      render(<CredentialsForm {...defaultProps} />, testWrapper);
      await waitFor(() =>
         expect(screen.getByText(/These SNMP credentials will be saved in/i)).toBeInTheDocument()
      );
      await waitFor(() => expect(screen.getAllByText(/Authentication */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/username/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/context/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/community */i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Privacy */i)[0]).toBeInTheDocument());
      await waitFor(() =>
         expect(screen.queryByLabelText(/authentication password/i)).toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password/i)).toBeInTheDocument()
      );

      await waitFor(() =>
         expect(
            screen.getByLabelText<HTMLInputElement>(/username/i)?.getAttribute('placeholder')
         ).toBe('unchanged')
      );
      await waitFor(() =>
         expect(
            screen
               .getByLabelText<HTMLInputElement>(/authentication password/i)
               ?.getAttribute('placeholder')
         ).toBe('unchanged')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/authentication password/i).value).toBe('')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/username/i).value).toBe('')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-version').value).toBe('3')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/Name */).value).toBe('default2')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-authentication').value).toBe('sha256')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-privacy').value).toBe('aes')
      );
   });

   it('default edit v3 change no authentication to md5 and then to no authentication and no privacy', async () => {
      const defaultValues: SNMPCredential = {
         version: 3,
         id: 100,
         name: 'default2',
         auth_method: '',
         priv_method: '',
         context: 'public',
      };

      const defaultProps: CredentialFormProps = {
         onSubmit: vi.fn(),
         mutationIsSuccess: false,
         mode: 'edit',
         deviceCount: 0,
         defaultValues,
      };
      vi.doMock('@tanstack/react-query', async (importOriginal) => {
         const actual: any = await importOriginal();
         return {
            ...actual,
            useQuery: vi.fn().mockReturnValue({
               isLoading: false,
               data: {
                  describe: describeJson,
               },
            }),
         };
      });

      const { CredentialsForm } = await import('./CredentialsForm');
      await render(<CredentialsForm {...defaultProps} />, testWrapper);
      
      await waitFor(() => expect(screen.getByLabelText(/Authentication/i)).toBeInTheDocument());
      await userEvent.selectOptions(screen.getByTestId('snmp-authentication'), ['sha']);
      await userEvent.selectOptions(screen.getByTestId('snmp-authentication'), ['']);
      await userEvent.selectOptions(screen.getByTestId('snmp-authentication'), ['sha']);
      await waitFor(() =>
         expect(screen.getAllByLabelText(/authentication password */i)[0]).toBeInTheDocument()
      );

      await waitFor(() =>
         expect(screen.getByText(/These SNMP credentials will be saved in/i)).toBeInTheDocument()
      );
      
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/username */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/context/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/community */i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Privacy */i)[0]).toBeInTheDocument());
      
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password */i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/username */i).value).toBe('')
      );

      await waitFor(() =>
         expect(
            screen.getByLabelText<HTMLInputElement>(/username */i).getAttribute('placeholder')
         ).toBe('')
      );
      await waitFor(() =>
         expect(
            screen
               .getByLabelText<HTMLInputElement>(/authentication password */i)
               .getAttribute('placeholder')
         ).toBe('')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-version').value).toBe('3')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/Name */).value).toBe('default2')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-authentication').value).toBe('sha')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-privacy').value).toBe('')
      );
      userEvent.selectOptions(screen.getByTestId('snmp-authentication'), ['']);

      await waitFor(() => expect(screen.getAllByText(/Authentication */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/username/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/context/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/community */i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.queryByText(/Privacy */i)).not.toBeInTheDocument());
      await waitFor(() =>
         expect(screen.queryByLabelText(/authentication password */i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password */i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/username/i).value).toBe('')
      );

      await waitFor(() =>
         expect(
            screen.getByLabelText<HTMLInputElement>(/username/i).getAttribute('placeholder')
         ).toBe('')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-version').value).toBe('3')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/Name */).value).toBe('default2')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-authentication').value).toBe('')
      );
   });

   it('default edit v3 with sha256 authentication and change from aes privacy to none to aes', async () => {
      const defaultValues: SNMPCredential = {
         version: 3,
         id: 100,
         name: 'default2',
         auth_method: 'sha256',
         priv_method: 'aes',
         context: 'public',
      };

      const defaultProps: CredentialFormProps = {
         onSubmit: vi.fn(),
         mutationIsSuccess: false,
         mode: 'edit',
         deviceCount: 0,
         defaultValues,
      };
      vi.doMock('@tanstack/react-query', async (importOriginal) => {
         const actual: any = await importOriginal();
         return {
            ...actual,
            useQuery: vi.fn().mockReturnValue({
               isLoading: false,
               data: {
                  describe: describeJson,
               },
            }),
         };
      });

      const { CredentialsForm } = await import('./CredentialsForm');
      await render(<CredentialsForm {...defaultProps} />, testWrapper);
      await waitFor(() =>
         expect(screen.getByText(/These SNMP credentials will be saved in/i)).toBeInTheDocument()
      );
      await userEvent.selectOptions(screen.getByTestId('snmp-privacy'), ['']);
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password */i)).not.toBeInTheDocument()
      );

      await waitFor(() => expect(screen.getAllByText(/Authentication */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/username/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/context/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/community */i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.queryByText(/Privacy */i)).toBeInTheDocument());
      await waitFor(() =>
         expect(screen.queryByLabelText(/authentication password/i)).toBeInTheDocument()
      );
     
      await waitFor(() =>
         expect(
            screen.getByLabelText<HTMLInputElement>(/username/i)?.getAttribute('placeholder')
         ).toBe('unchanged')
      );
      await waitFor(() =>
         expect(
            screen
               .getByLabelText<HTMLInputElement>(/authentication password/i)
               ?.getAttribute('placeholder')
         ).toBe('unchanged')
      );
     
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/username/i).value).toBe('')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-version').value).toBe('3')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/Name */).value).toBe('default2')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-authentication').value).toBe('sha256')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-privacy').value).toBe('')
      );
      await userEvent.selectOptions(screen.getByTestId('snmp-privacy'), ['aes']);
      await waitFor(() =>
         expect(screen.getByLabelText(/privacy password */i)).toBeInTheDocument()
      );

      await waitFor(() => expect(screen.getAllByText(/Authentication */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/username/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/context/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/community */i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Privacy */i)[0]).toBeInTheDocument());
      await waitFor(() =>
         expect(screen.queryByLabelText(/authentication password/i)).toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.getByLabelText(/privacy password */i)).toBeInTheDocument()
      );

      await waitFor(() =>
         expect(
            screen.getByLabelText<HTMLInputElement>(/username/i)?.getAttribute('placeholder')
         ).toBe('unchanged')
      );
      await waitFor(() =>
         expect(
            screen
               .getByLabelText<HTMLInputElement>(/authentication password/i)
               ?.getAttribute('placeholder')
         ).toBe('unchanged')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/authentication password/i).value).toBe('')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/username/i).value).toBe('')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-version').value).toBe('3')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/Name */).value).toBe('default2')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-authentication').value).toBe('sha256')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-privacy').value).toBe('aes')
      );
   });

   it('edit v3 to v2 to v3 default with sha256 authentication and aes privacy', async () => {
      const defaultValues: SNMPCredential = {
         version: 3,
         id: 100,
         name: 'default2',
         auth_method: 'sha256',
         priv_method: 'aes',
         context: 'public',
      };

      const defaultProps: CredentialFormProps = {
         onSubmit: vi.fn(),
         mutationIsSuccess: false,
         mode: 'edit',
         deviceCount: 0,
         defaultValues,
      };
      vi.doMock('@tanstack/react-query', async (importOriginal) => {
         const actual: any = await importOriginal();
         return {
            ...actual,
            useQuery: vi.fn().mockReturnValue({
               isLoading: false,
               data: {
                  describe: describeJson,
               },
            }),
         };
      });

      const { CredentialsForm } = await import('./CredentialsForm');
      await render(<CredentialsForm {...defaultProps} />, testWrapper);
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await userEvent.selectOptions(screen.getByTestId('snmp-version'), ['2']);

      await waitFor(() =>
         expect(screen.queryByLabelText(/Authentication */i)).not.toBeInTheDocument()
      );
      await waitFor(() => expect(screen.queryByText(/Privacy */i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/username/i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/context/i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/community */i)).toBeInTheDocument());
      await waitFor(() =>
         expect(screen.queryByLabelText(/authentication password */i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password */i)).not.toBeInTheDocument()
      );

      await userEvent.selectOptions(screen.getByTestId('snmp-version'), ['3']);
      await waitFor(() => expect(screen.getAllByText(/Authentication */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByText(/Privacy */i)).not.toBeInTheDocument());
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/username/i).value).toBe('')
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/authentication password */i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password */i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(
            screen.getByLabelText<HTMLInputElement>(/username/i).getAttribute('placeholder')
         ).toBe('')
      );      
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/username */i).value).toBe('')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-version').value).toBe('3')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/Name */).value).toBe('default2')
      );
      
      await userEvent.selectOptions(screen.getByTestId('snmp-authentication'), ['sha']);
      await waitFor(() =>
         expect(screen.getAllByLabelText(/authentication password */i)[0]).toBeInTheDocument()
      );
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/username */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/context/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/community */i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Privacy */i)[0]).toBeInTheDocument());

      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password */i)).not.toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/username */i).value).toBe('')
      );

      await waitFor(() =>
         expect(
            screen.getByLabelText<HTMLInputElement>(/username */i).getAttribute('placeholder')
         ).toBe('')
      );
      await waitFor(() =>
         expect(
            screen
               .getByLabelText<HTMLInputElement>(/authentication password */i)
               .getAttribute('placeholder')
         ).toBe('')
      );

      await userEvent.selectOptions(screen.getByTestId('snmp-privacy'), ['aes']);
      await waitFor(() =>
         expect(screen.getByLabelText(/privacy password */i)).toBeInTheDocument()
      );

      await waitFor(() =>
         expect(
            screen.getByLabelText<HTMLInputElement>(/username */i)?.getAttribute('placeholder')
         ).toBe('')
      );
      await waitFor(() =>
         expect(
            screen
               .getByLabelText<HTMLInputElement>(/authentication password */i)
               ?.getAttribute('placeholder')
         ).toBe('')
      );
      await waitFor(() =>
         expect(
            screen
               .getByLabelText<HTMLInputElement>(/privacy password */i)
               ?.getAttribute('placeholder')
         ).toBe('')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/authentication password */i).value).toBe('')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/context/i).value).toBe('public')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/username */i).value).toBe('')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-version').value).toBe('3')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/Name */).value).toBe('default2')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-authentication').value).toBe('sha')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-privacy').value).toBe('aes')
      );
   });

   it('default copy v3 with sha256 authentication and privacy none', async () => {
      const defaultValues: SNMPCredential = {
         version: 3,
         id: 100,
         name: 'default2',
         auth_method: 'sha256',
         priv_method: '',
         context: 'public',
      };

      const defaultProps: CredentialFormProps = {
         onSubmit: vi.fn(),
         mutationIsSuccess: false,
         mode: 'copy',         
         defaultValues,
      };

      vi.doMock('@tanstack/react-query', async (importOriginal) => {
         const actual: any = await importOriginal();
         return {
            ...actual,
            useQuery: vi.fn().mockReturnValue({
               isLoading: false,
               data: {
                  describe: describeJson,
               },
            }),
         };
      });

      const { CredentialsForm } = await import('./CredentialsForm');
      render(<CredentialsForm {...defaultProps} />, testWrapper);
      await waitFor(() =>
         expect(screen.getByText(/These SNMP credentials will be saved in/i)).toBeInTheDocument()
      );
      await waitFor(() => expect(screen.getAllByText(/Authentication */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/username/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/context/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/community */i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Privacy */i)[0]).toBeInTheDocument());
      await waitFor(() =>
         expect(screen.queryByLabelText(/authentication password */i)).toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password */i)).not.toBeInTheDocument()
      );

      await waitFor(() =>
         expect(
            screen.getByLabelText<HTMLInputElement>(/username */i)?.getAttribute('placeholder')
         ).toBe('')
      );
      await waitFor(() =>
         expect(
            screen
               .getByLabelText<HTMLInputElement>(/authentication password */i)
               ?.getAttribute('placeholder')
         ).toBe('')
      );      
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/authentication password */i).value).toBe('')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/username */i).value).toBe('')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-version').value).toBe('3')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/Name */).value).toBe('default2')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-authentication').value).toBe('sha256')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-privacy').value).toBe('')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/context/).value).toBe('public')
      );
   });

   it('default copy v3 with sha256 authentication and aes privacy', async () => {
      const defaultValues: SNMPCredential = {
         version: 3,
         id: 100,
         name: 'default2',
         auth_method: 'sha256',
         priv_method: 'aes',
         context: 'public',
      };

      const defaultProps: CredentialFormProps = {
         onSubmit: vi.fn(),
         mutationIsSuccess: false,
         mode: 'copy',         
         defaultValues,
      };

      vi.doMock('@tanstack/react-query', async (importOriginal) => {
         const actual: any = await importOriginal();
         return {
            ...actual,
            useQuery: vi.fn().mockReturnValue({
               isLoading: false,
               data: {
                  describe: describeJson,
               },
            }),
         };
      });

      const { CredentialsForm } = await import('./CredentialsForm');
      render(<CredentialsForm {...defaultProps} />, testWrapper);
      await waitFor(() =>
         expect(screen.getByText(/These SNMP credentials will be saved in/i)).toBeInTheDocument()
      );
      await waitFor(() => expect(screen.getAllByText(/Authentication */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/SNMP Version */i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/username/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getByLabelText(/context/i)).toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Name */i)[0]).toBeInTheDocument());
      await waitFor(() => expect(screen.queryByLabelText(/community */i)).not.toBeInTheDocument());
      await waitFor(() => expect(screen.getAllByText(/Privacy */i)[0]).toBeInTheDocument());
      await waitFor(() =>
         expect(screen.queryByLabelText(/authentication password */i)).toBeInTheDocument()
      );
      await waitFor(() =>
         expect(screen.queryByLabelText(/privacy password */i)).toBeInTheDocument()
      );

      await waitFor(() =>
         expect(
            screen.getByLabelText<HTMLInputElement>(/username */i)?.getAttribute('placeholder')
         ).toBe('')
      );
      await waitFor(() =>
         expect(
            screen
               .getByLabelText<HTMLInputElement>(/authentication password */i)
               ?.getAttribute('placeholder')
         ).toBe('')
      );
      await waitFor(() =>
         expect(
            screen
               .getByLabelText<HTMLInputElement>(/privacy password */i)
               ?.getAttribute('placeholder')
         ).toBe('')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/authentication password */i).value).toBe('')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/username */i).value).toBe('')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-version').value).toBe('3')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/Name */).value).toBe('default2')
      );
      await waitFor(() =>
         expect(screen.getByLabelText<HTMLInputElement>(/context/).value).toBe('public')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-authentication').value).toBe('sha256')
      );
      await waitFor(() =>
         expect(screen.getByTestId<HTMLSelectElement>('snmp-privacy').value).toBe('aes')
      );
   });
});
