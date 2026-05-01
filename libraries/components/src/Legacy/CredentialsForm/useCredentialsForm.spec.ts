import { type SNMPCredential } from '@statseeker/api/internal_api/entities';
import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { type CredentialFormProps } from './types';
import { useCredentialsForm } from './useCredentialsForm';

describe('<useCredentialsForm />', () => {
   const defaultValues: Omit<SNMPCredential, 'id' | 'name'> = {
      version: 3,
      community: 'public',
      auth_method: 'none',
      auth_user: null,
      auth_pass: null,
      priv_method: 'none',
      priv_pass: null,
      context: null,
   };
   const defaultProps: CredentialFormProps = {
      onSubmit: vi.fn(),
      mutationIsSuccess: false,
      mode: 'add',
      defaultValues,
   };

   it('should render successfully', () => {
      expect(() => renderHook(() => useCredentialsForm({ props: defaultProps }))).not.toThrow();
   });

   it.todo('should have more tests');
});
