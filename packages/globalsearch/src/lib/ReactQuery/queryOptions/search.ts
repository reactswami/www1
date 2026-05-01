import { type ApiResponse } from '@statseeker/api/internal_api';
import {
   describeCredentials,
   getSearch,
   type Search,
   type SearchOptions,
} from '@statseeker/api/internal_api/entities/search';
import { queryOptions } from '@tanstack/react-query';
import type React from 'react';
import { type SearchDetails, type ActionSearch } from '../../../types';
import { convertMetaDataToString } from '../../../utils';
import { searchQueryKeys } from '../keys';

export const getSearchResults = (params: SearchOptions, enabled: boolean = false, dispatch: React.Dispatch<ActionSearch>) => {
   return queryOptions({
      queryKey: searchQueryKeys.get(params),
      queryFn: () => {
         return getSearch(params).then((result: ApiResponse<Search>) => {
            const searchResults = result?.data;
            const searchDetails: SearchDetails[] = searchResults.map(d =>
               ({ name: d.name, description: d.content ?? convertMetaDataToString(d.metadata), actions: [...d.actions], status: d.status, category: d.category.trim().toLowerCase(), visible: true, selected: false, }));
            dispatch({ type: 'UPDATE_SEARCH', payload: searchDetails });
            return {
               ...result,
               data: searchDetails,
            };
         });
      },
      throwOnError: false,
      staleTime: 0,
      enabled
   });
};


export const describeCredentialsQuery = () =>
   queryOptions({
      queryKey: ['credentials', 'describe'],
      queryFn: () => describeCredentials(),
   });

