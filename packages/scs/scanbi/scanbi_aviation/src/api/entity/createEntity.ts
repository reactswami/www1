import axios from 'axios';
import { environment } from '~/config/environment';
import { type CreatePayload } from '~/types/api';
import { type EntityType } from '~/types/models';
import { MODE } from '~/utils/constants';

const { endpoints } = environment;

export const createEntity = async (entityPayload: CreatePayload, entity: EntityType) => {
   return axios.post(endpoints.entityOperations, {
      mode: MODE.ADD,
      entity_type: entity,
      ...entityPayload,
   });
};
