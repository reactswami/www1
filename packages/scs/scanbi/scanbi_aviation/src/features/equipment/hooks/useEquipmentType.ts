import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { fetchEquipmentType } from '~/api/entity/fetchEquipmentType';
import { queryKeys, useToast } from '~/lib';
import { type EquipmentType } from '~/types/models';
import { ENTITY_TYPE } from '~/utils/constants';

export default function useEquipmentType({
   modelName,
   productLine,
   equipmentType,
}: {
   modelName?: string | null;
   productLine?: string | null;
   equipmentType?: string | null;
}) {
   const toast = useToast();
   const [selectedEquipmentType, setSelectedEquipmentType] = useState<string>(
      equipmentType || 'Passenger Scanner'
   );
   const [selectedProductLine, setSelectedProductLine] = useState<string | null | undefined>(
      productLine
   );
   const [selectedModelName, setSelectedModelName] = useState<string | null | undefined>(modelName);
   let equipmentTypes: string[] = [];
   let productLines: string[] = [];
   let models: string[] = [];

   const { isLoading, isError, isSuccess, data, error } = useQuery({
      queryKey: queryKeys[ENTITY_TYPE.EQUIPMENT_TYPE],
      queryFn: fetchEquipmentType,
      select: ({ data }) => {
         equipmentTypes = Object.keys(data).reverse();
         productLines = getProductLines(data);
         models = getModels(data);
         return data;
      },
   });

   useEffect(() => {
      if (isError) {
         toast({
            status: 'error',
            title: 'Failed to fetch ',
            description: `The group filter failed to retrieve the list of groups. If the problem persists, contact the Statseeker support.\n ${error.message}`,
         });
      }
   }, [isError]);

   function getProductLines(response: EquipmentType) {
      if (selectedEquipmentType === null) {
         return [];
      }

      const property = Object.keys(response).find((key) => key === selectedEquipmentType);

      if (property) {
         if (property in response) {
            const value = response[property];

            if (value === null) {
               return [];
            }

            // Body Scanner || WTMD
            return Object.keys(value);
         }

         return [];
      }

      return [];
   }

   function getModels(response: EquipmentType) {
      if (selectedEquipmentType === null || selectedProductLine === null) {
         return [];
      }

      const property = Object.keys(response).find((key) => key === selectedEquipmentType);

      if (property) {
         if (property in response) {
            const value = response[property];

            if (value === null) {
               return [];
            }

            const productLineProp = Object.keys(value).find((key) => key === selectedProductLine);

            if (productLineProp) {
               if (productLineProp in value) {
                  return value[productLineProp];
               }
            }

            return [];
         }

         return [];
      }

      return [];
   }

   return {
      selectedEquipmentType,
      selectedProductLine,
      selectedModelName,
      equipmentTypes,
      productLines,
      models,
      setSelectedEquipmentType,
      setSelectedProductLine,
      setSelectedModelName,
   };
}
