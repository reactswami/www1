import axios from 'axios';
import { Queries } from './queries';
import { environment } from '~/config/environment';

interface DeleteOaPayload {
   id: string;
}

const { endpoints } = environment;
export const deleteOa = ({ id }: DeleteOaPayload) =>
   axios.delete(endpoints.deleteOa, { data: Queries.deleteOa(id) });
