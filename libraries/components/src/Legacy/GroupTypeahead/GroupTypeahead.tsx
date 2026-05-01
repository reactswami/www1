import { getGroups } from '@statseeker/api/internal_api/entities/group';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { TypeAheadSelectInput } from '../TypeAheadSelectInput';

export function GroupTypeahead({
   object_type,
   onChange,
   defaultValue,
   showLabel,
   width,
   disabled = false
}: {
   object_type?: string;
   onChange: (arg: number) => void;
   defaultValue?: number;
   showLabel?: boolean;
   width?: string;
   disabled?: boolean;
}) {
   const groupQueryOptions = () =>
      queryOptions({
         queryKey: ['groups', object_type],
         queryFn: () =>
            getGroups({
               fields: [
                  'name',
                  'id',
                  {
                     key: 'entities',
                     hide: true,
                     format: 'objects',
                     filter: object_type ? `IN ('${object_type}','cdt_device')` : undefined,
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
         emptyMessage={'No groups found'}
         label={showLabel ? 'Select Group' : undefined}
         placeholder={showLabel ? 'Select...' : 'Select Group...'}
         width={width}
         disabled={disabled}
      />
   );
}
