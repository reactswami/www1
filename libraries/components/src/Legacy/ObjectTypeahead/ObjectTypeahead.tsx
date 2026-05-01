import {
   type APIObjectCount,
   type ApiObjectDataType,
   getAllObjectCounts,
   getAllObjects,
} from '@statseeker/api/internal_api/entities';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { TypeAheadSelectInput } from '../TypeAheadSelectInput';

const data_type_has_entities = (
   data_type: string,
   objects?: ApiObjectDataType[],
   objectCounts?: APIObjectCount[]
) => {
   const obj = objects?.find((obj) => obj.name === data_type);
   const objCount = objectCounts?.find((obj) => obj.name === data_type);
   if (!obj || !objCount) {
      return false;
   }
   if (objCount.total > 0) {
      return true;
   }

   /* Check children */
   if (obj.inherited_by) {
      for (const child of obj.inherited_by) {
         if (data_type_has_entities(child, objects, objectCounts)) {
            return true;
         }
      }
   }

   return false;
};

export function ObjectTypeahead({
   filter,
   onChange,
   defaultValue,
   showLabel,
   width,
   show_all = false,
}: {
   filter?: (data: ApiObjectDataType[]) => ApiObjectDataType[];
   onChange: (obj: string, obj_title: string) => void;
   defaultValue?: string;
   showLabel?: boolean;
   width?: string;
   show_all?: boolean;
}) {
   const objCountsResp = useQuery(
      queryOptions({
         queryKey: ['objectCounts'],
         queryFn: () => getAllObjectCounts(),
      })
   );
   const objListResp = useQuery(
      queryOptions({
         queryKey: ['objects', filter],
         queryFn: () => getAllObjects(),
         select: (data) => {
            const resp = show_all
               ? data.data
               : data.data.filter((obj) =>
                    data_type_has_entities(obj.name, data.data, objCountsResp.data?.data)
                 );
            return filter ? filter(resp) : resp;
         },
      })
   );

   let defaultOption = undefined;
   const defaultData = objListResp.data?.find((d) => d.name === defaultValue);
   if (defaultData && objListResp.isSuccess) {
      defaultOption = {
         name: defaultData.title,
         value: defaultData.name,
      };
   }

   const handleOnChange = (obj: string) => {
      if (!obj) {
         onChange('', '');
      }
      const selectedObj = objListResp.data?.find((d) => d.name === obj);
      if (selectedObj) {
         onChange(selectedObj.name, selectedObj.title);
      }
   };

   return (
      <TypeAheadSelectInput
         defaultValue={defaultOption}
         defaultIsName={true}
         onChange={handleOnChange}
         isLoading={objListResp.isLoading}
         isSuccess={objListResp.isSuccess}
         isError={objListResp.isError}
         options={
            objListResp.data?.map((obj) => ({
               name: obj.title,
               value: obj.name,
            })) ?? []
         }
         emptyMessage={'No data types found'}
         label={showLabel ? 'Select Data Type' : undefined}
         placeholder={showLabel ? 'Select...' : 'Select Data Type...'}
         width={width}
      />
   );
}
