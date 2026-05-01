import EntityTypeAhead from '@statseeker/components/Legacy/EntityTypeAhead/EntityTypeAhead';
import { getAllGroups } from '@statseeker/utils/apiOptions';

export type GroupSelect = (data: GroupListItem[]) => GroupListItem[];

export const groupSelect = (data: GroupListItem[]) => [...data];


export type GroupListItem = {
   id: number;
   name: string;
};


export function GroupMultiTypeahead({
   defaultValues,
   onChange,
   isDisabled,
   size,
   values,
}: {
   defaultValues?: GroupListItem[];
   onChange: (data?: GroupListItem[] | null) => void;
   isDisabled?: boolean;
   size?: 'sm' | 'md' | 'lg';
   values?: GroupListItem[];
}) {
   return (
      <EntityTypeAhead<GroupListItem, GroupSelect>
         value={values}
         defaultValue={defaultValues}
         isDisabled={isDisabled}
         size={size}
         onChange={onChange}
         entityQueryOption={getAllGroups}
         queryParams={groupSelect}
         isMulti={true}
      />
   );
}
