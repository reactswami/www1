import { AdminManageListContent } from '@statseeker/components/Legacy/AdminManageList';
import { type RangeFormProps, RangesForm } from '@statseeker/components/Legacy/IPRanges';
import { type ReactNode } from 'react';

export function RangesFormRoute({ children, title, formProps }: { children?: ReactNode; title: string; formProps: RangeFormProps }) {
   return (
      <AdminManageListContent title={title}>
         <RangesForm props={formProps} />
         { children }
      </AdminManageListContent>
   );
}
