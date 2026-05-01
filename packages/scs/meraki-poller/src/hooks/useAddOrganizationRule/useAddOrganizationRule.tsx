import { type UseMutationOptions } from '@tanstack/react-query';
import { type AxiosResponse } from 'axios';
import { useUpdateGlobalConfig } from '~/hooks/useUpdateGlobalConfig/useUpdateGlobalConfig';
import { type ApiGlobalConfig } from '~/types/api';

export const useAddOrganizationRule = (
   options?: UseMutationOptions<AxiosResponse<ApiGlobalConfig>, any, any>
) => useUpdateGlobalConfig(options);
