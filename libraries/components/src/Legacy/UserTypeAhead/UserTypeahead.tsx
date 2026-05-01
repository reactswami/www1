import { getUsers } from '@statseeker/api/internal_api/entities/user';
import { type ApiField } from '@statseeker/api/internal_api/types';
import { TypeAheadSelectInput } from '@statseeker/components';
import { queryOptions, useQuery } from '@tanstack/react-query';

export default ({
   onChange,
   includeSystemUser,
   onlyAdmins,
   defaultValue,
   label,
}: {
   onChange: (user: string) => void;
   includeSystemUser: boolean;
   onlyAdmins: boolean;
   defaultValue?: string;
   label?: string;
}) => {

   let user_fields: (string | ApiField)[] = ['name', 'id'];
   if (onlyAdmins) {
      user_fields = ['name', 'id', { key: 'is_admin', hide: true, filter: '== TRUE' }];
   }
   const userQueryOptions = () =>
      queryOptions({
         queryKey: ['users'],
         queryFn: () =>
            getUsers({
               fields: user_fields,
               sort: ['name'],
            }),
      });
   const { data, isLoading, isSuccess, isError } = useQuery(userQueryOptions());

   const options = [
      ...(includeSystemUser ? [{ name: 'System', value: 'System' }] : []),
      ...(data?.data?.map((user) => ({
         name: user?.name ?? '',
         value: user?.name ?? '',
      })) ?? []),
   ];

   return (
      <TypeAheadSelectInput
         defaultValue={{name: '', value: defaultValue ?? ''}}
         onChange={(user) => onChange(user)}
         isLoading={isLoading}
         isSuccess={isSuccess}
         isError={isError}
         options={options}
         label={label ?? 'Select User'}
         placeholder="Select..."
      />
   );
};
