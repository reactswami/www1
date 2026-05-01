import { Queries } from './queries';
import { environment } from '~/config/environment';
import { axios } from '~/lib';
import { type DeviceOa } from '~/types/models';

const { endpoints } = environment;

export type FetchAllOasResponse = (DeviceOa & {
   services: string;
})[];

export const fetchAllOas = async (): Promise<{ data: FetchAllOasResponse }> => {
   const { data } = await axios.post<{ data: FetchAllOasResponse }>(
      endpoints.fetchOaRows,
      Queries.getOasWithService
   );

   return data;
};

export const fetchAllOasInGroup = async (groupId: number): Promise<{ data: FetchAllOasResponse }> => {
   const { data } = await axios.post<{ data: FetchAllOasResponse }>(
      endpoints.fetchOaRows,
      Queries.getOAsInGroup(groupId)
   );

   return data;
};