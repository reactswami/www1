import {
   api_execute,
   api_describe
} from '@statseeker/api/internal_api';
import { type Search, type SearchOptions } from './type';

export async function getSearch(options?: SearchOptions) {
   return api_execute<Search>({
      object_type: 'search',
      ...options
   });
}

export async function describeCredentials() {
   return await api_describe({ object_type: 'search' });
}