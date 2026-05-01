import axios from 'axios';
import { environment } from '~/config/environment';
import { type NewNetwork } from '~/types';
import { ENTITY_TYPE, MODE } from '~/utils';

const { endpoints } = environment;

export const createNetwork = async (newNetwork: NewNetwork) => {
   return axios.post(endpoints.entityOperations, {
      mode: MODE.ADD,
      entity_type: ENTITY_TYPE.NETWORKS,
      ...newNetwork,
   });
};

export const testConnection = async (id: number) => {
   return axios.post(endpoints.entityOperations, {
      mode: MODE.TEST_NETWORK,
      id,
   });
};
