import { AdminManageListContent } from '@statseeker/components/Legacy/AdminManageList';
import { type CredentialFormProps, CredentialsForm } from '@statseeker/components/Legacy/CredentialsForm';
import { type ReactNode } from 'react';

export function CredentialsFormRoute({ children, title, formProps }: { children?: ReactNode; title: string; formProps: CredentialFormProps }) {
   return (
      <AdminManageListContent title={title}>
         <CredentialsForm
            {...formProps}
         />
         { children }
      </AdminManageListContent>
   );
}
