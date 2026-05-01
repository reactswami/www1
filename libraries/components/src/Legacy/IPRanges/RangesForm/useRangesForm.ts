import { type IpRangeConfig } from '@statseeker/api/internal_api/entities/ip_range_config';
import { useMutation } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { addRange, updateRange } from './api';
import { type RangeFormProps } from './RangesForm';

const defaults: Omit<IpRangeConfig, 'id' | 'name'> = {
   ip_range: { include: [], exclude: [] },
   enabled: 1
};

export function useRangesForm({ props }: { props: RangeFormProps }) {
   const { mode, onSuccess, onError } = props;
   const methods = useForm<IpRangeConfig>({
      defaultValues: props.mode !== 'add' ? props.defaultValues : defaults,
   });
   const rangesMutation = useMutation({
      mutationKey: ['ranges', mode],
      mutationFn: ({ ipRangeConfig }: { ipRangeConfig: IpRangeConfig }) => {
         // Remove any empty ranges before saving
         ipRangeConfig.ip_range.include = ipRangeConfig.ip_range.include.filter((r) => r !== null && r.trim() !== '');
         ipRangeConfig.ip_range.exclude = ipRangeConfig.ip_range.exclude.filter((r) => r !== null && r.trim() !== '');
         switch (mode) {
            case 'edit':
               return updateRange(ipRangeConfig);
            case 'copy': {
               // eslint-disable-next-line @typescript-eslint/no-unused-vars
               const { id: _, ...rest } = ipRangeConfig;
               return addRange({
                  newRange: {
                     ...rest,
                  },
               });
            }
            default:
               return addRange({ newRange: ipRangeConfig });
         }
      },
      onSuccess: ({ data }) => onSuccess(data),
      onError: ({ message }) => onError(message),
   });

   // Need to reload the form if anything changes.
   // Note that this doesn't work if done in the onSuccess of the mutation.
   useEffect(() => {
      if (mode === 'edit') {
         methods.reset(props.defaultValues);
      }
   }, [methods, mode, props]);

   return {
      methods,
      rangesMutation,
   };
}
