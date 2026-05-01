import { type UseMutationOptions } from '@tanstack/react-query';
import { type AxiosResponse } from 'axios';
import { useUpdateGlobalConfig } from '~/hooks/useUpdateGlobalConfig/useUpdateGlobalConfig';
import { type ApiGlobalConfig } from '~/types/api';

type Props = UseMutationOptions<AxiosResponse<ApiGlobalConfig>, any, any>;

export const useUpdateOrganizationRule = (options: Props = {}) =>
   useUpdateGlobalConfig(options);
