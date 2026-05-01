import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { fetchLocationCategory } from '~/api/entity/locationCategory';
import { useToast } from '~/lib';

export default function useLocationCategory({
   locationCategory,
   enabled
}: {
   locationCategory?: string | null;
   enabled: boolean;
}) {
   const toast = useToast();
   const [selectedLocationCategory, setSelectedLocationCategory] = useState<
      string | null | undefined
   >(locationCategory);
   const [locationCategories, setLocationCategories] = useState<string[]>([]);

   useEffect(() => {
      if (locationCategory) {
         setSelectedLocationCategory(locationCategory);
      }
   }, [locationCategory]);

   const { isError, isSuccess, data, error } = useQuery({
      queryKey: ['location_category'],
      queryFn: fetchLocationCategory,
      select: ({ data }) => data,
      enabled
   });

   useEffect(() => {
      if (isSuccess && data) {
         setLocationCategories(data);
      }
   }, [isSuccess, data]);

   useEffect(() => {
      if (isError) {
         toast({
            status: 'error',
            title: 'Failed to fetch ',
            description: `Failed to fetch location categories..\n ${error.message}`,
         });
      }
   }, [isError]);

   return {
      selectedLocationCategory,
      locationCategories,
      setSelectedLocationCategory,
   };
}