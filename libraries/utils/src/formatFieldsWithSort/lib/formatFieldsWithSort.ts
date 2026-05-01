import { type ApiField } from '@statseeker/api/internal_api';

export const formatFieldsWithSort = ({
   sort,
   dir,
   fields,
}: {
   sort: string;
   dir?: string;
   fields: (string | ApiField)[];
}) => {
   let sortColIdx = fields.findIndex((field: string | ApiField) => {
      if (typeof field === 'string') {
         return field === sort;
      }
      return field.key === sort;
   });
   if (sortColIdx === -1) {
      return fields;
   }
   let sortCol = fields[sortColIdx];
   if (typeof sortCol === 'string') {
      sortCol = { key: sortCol };
   }
   fields[sortColIdx] = {
      ...sortCol,
      sort_desc: dir === 'desc',
   };

   return fields;
};
