import { useQuery } from '@tanstack/react-query';
import { fetchOrphanDevicesPingedOnlyByOa } from '~/api/fetchOrphanDevicesPingedOnlyByOa';
import { queryKeys } from '~/lib';

export const useFetchOrphanDevicesCount = ({ oaName }: { oaName: string }) => {
   return useQuery({
      queryKey: queryKeys.devicesPingedByOa(oaName),
      queryFn: () => fetchOrphanDevicesPingedOnlyByOa({ oaName }),
      initialData: { data: [] },
      select: (data) => data.data.length,
   });
};
