import { type ApiResponse } from '@statseeker/api/internal_api';
import { type SNMPCredential } from '@statseeker/api/internal_api/entities';
import { type UseMutationResult } from '@tanstack/react-query';

export type MutationFn = UseMutationResult<
   ApiResponse<SNMPCredential>,
   Error,
   {
      credential: SNMPCredential;
   },
   unknown
>;

export type CredentialFormProps =
   {
      onSubmit: (credential: SNMPCredential) => void;
      mutationIsSuccess: boolean;
   } &
   (
      {
         mode: 'add';
         defaultValues: Omit<SNMPCredential, 'id' | 'name'>;
      }
      | {
         mode: 'copy';
         defaultValues: SNMPCredential;
      }
      | {
         mode: 'edit';
         defaultValues: SNMPCredential;
         deviceCount: number;
      }
   );
