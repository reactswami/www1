import {
   CheckCircledIcon,
   ExclamationTriangleIcon,
} from '@radix-ui/react-icons';
import { useUpdateGlobalConfig } from '~/hooks/useUpdateGlobalConfig/useUpdateGlobalConfig';
import { useToast } from '~/lib/Chakra';


export const useUnassignRule = () => {
   const toast = useToast();

   return useUpdateGlobalConfig({
      onSuccess: () => {
         toast({
            status: 'success',
            icon: <CheckCircledIcon />,
            title: 'Success',
            description: 'Rule(s) unassigned',
         });
      },
      onError: () => {
         toast({
            status: 'error',
            icon: <ExclamationTriangleIcon />,
            title: 'Error',
            description:
               'Failed to unassign the rule. If the problem persists, please contact Statseeker support.',
         });
      },
   });
};
