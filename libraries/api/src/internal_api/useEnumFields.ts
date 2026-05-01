import { type ApiDescribe, type ApiEnumField } from './types';

type FieldType = Record<string, ApiEnumField[]>;

const useEnumFields = (describeObj?: ApiDescribe) => {
   if (describeObj === undefined) {
      return null;
   }

   const fields = describeObj.fields;
   const newEnumFields: FieldType = {};

   for (const fieldName in fields) {
      const enumObject = fields[fieldName].enum;
      if (enumObject) {
         const enums = Object.values(enumObject).map(({ label, description, value }) => ({
            label,
            description,
            value,
         }));
         newEnumFields[fieldName] = enums;
      }
   }

   return newEnumFields;
};

export default useEnumFields;
