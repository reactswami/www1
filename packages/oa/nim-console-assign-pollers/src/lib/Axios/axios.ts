import Axios from 'axios';
import { environment } from '~/config';

export const axios = Axios.create({
   baseURL: environment.apiBase,
});
