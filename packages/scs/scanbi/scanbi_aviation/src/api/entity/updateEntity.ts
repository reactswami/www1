import axios, { type AxiosResponse } from 'axios';
import { environment } from '~/config/environment';
import { type UpdateEntityResponse, type UpdatePayload } from '~/types/api';
import { type EntityType } from '~/types/models';
import { MODE } from '~/utils/constants';

const { endpoints } = environment;

export const updateEntity = (
   updatedEntity: UpdatePayload,
   entity: EntityType
): Promise<AxiosResponse<UpdateEntityResponse>> => {
   return axios.post(endpoints.entityOperations, {
      mode: MODE.UPDATE,
      entity_type: entity,
      ...updatedEntity,
   });
};
