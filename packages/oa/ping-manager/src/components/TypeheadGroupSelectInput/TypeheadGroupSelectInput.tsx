import { TypeAheadSelectInput } from '@statseeker/components';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { requests } from '~/api';
import { queryKeys, useToast } from '~/lib';

interface Props {
   setGroupFilter: (arg: number) => void;
}

const ALL_GROUPS = { id: 1, name: 'All Groups' }; // We assume that all groups has always an id of 1
const ALL_GROUP_ID = 1;
export const TypeheadGroupSelectInput = ({ setGroupFilter }: Props) => {
   const toast = useToast();

   const { isLoading, isError, isSuccess, data, error } = useQuery({
      queryKey: queryKeys.group,
      queryFn: requests.getGroups,
      select: ({ data }) =>
         data ? [ALL_GROUPS, ...data.filter((group) => group.id !== ALL_GROUP_ID)] : [ALL_GROUPS],
   });

   useEffect(() => {
      if (isError) {
         toast({
            status: 'error',
            title: 'Fail to get the list of groups',
            description: `The group filter failed to retrieve the list of groups. If the problem persists, contact the Statseeker support.\n ${error.message}`,
         });
      }
   }, [isError]);

   return (
      <TypeAheadSelectInput
         isLoading={isLoading}
         isError={isError}
         isSuccess={isSuccess}
         options={
            data?.map(({ name, id }) => ({
               name,
               value: id.toString(),
            })) ?? []
         }
         label={'Select group'}
         placeholder={'Select...'}
         onChange={(group) => setGroupFilter(Number(group))}
      />
   );
};
