import { type UseMutationOptions } from '@tanstack/react-query';
import { type AxiosResponse } from 'axios';
import { type ApiGlobalConfig } from 'packages/scs/meraki-poller/src/types';
import { useUpdateGlobalConfig } from '~/hooks/useUpdateGlobalConfig/useUpdateGlobalConfig';

export const useUpdateNetworkRule = (
   options?: UseMutationOptions<AxiosResponse<ApiGlobalConfig>, any, any>
) => useUpdateGlobalConfig(options);
