import { getGroups } from '@statseeker/api/internal_api/entities/group';
import { TypeAheadSelectInput } from '@statseeker/components/Legacy/TypeAheadSelectInput';
import { queryOptions, useQuery } from '@tanstack/react-query';

export function GroupTypeahead({ onChange, defaultValue }: { onChange: (arg: number) => void; defaultValue?: number }) {
   const groupQueryOptions = () =>
      queryOptions({
         queryKey: ['groups'],
         queryFn: () =>
            getGroups({
               fields: [
                  'name',
                  'id',
                  {
                     key: 'entities',
                     hide: true,
                     format: 'objects',
                     filter: "IN ('cdt_device')",
                  },
               ],
               sort: ['name'],
            }),
      });
   const { data, isLoading, isSuccess, isError } = useQuery(groupQueryOptions());

   let defaultOption = undefined;
   const defaultData = data?.data.find((d) => d.id === defaultValue);
   if (defaultData && isSuccess) {
      defaultOption = {
         name: defaultData.name,
         value: defaultData.id.toString(),
      };
   }

   return (
      <TypeAheadSelectInput
         defaultValue={defaultOption}
         defaultIsName={true}
         onChange={(group) => onChange(Number(group))}
         isLoading={isLoading}
         isSuccess={isSuccess}
         isError={isError}
         options={
            data?.data.map((credential) => ({
               name: credential.name,
               value: credential.id.toString(),
            })) ?? []
         }
         label={'Select Group'}
         placeholder="Select..."
      />
   );
}
