import axios from 'axios';
import { environment } from '~/config/environment';
import { type DeletePayload } from '~/types/api';
import { type EntityType } from '~/types/models';
import { MODE } from '~/utils/constants';

const { endpoints } = environment;
export const deleteEntity = ({ id }: DeletePayload, entity: EntityType) =>
   axios.post(endpoints.entityOperations, {
      mode: MODE.DELETE,
      entity_type: entity,
      ids: [id],
   });
