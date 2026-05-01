import { type UseDisclosureReturn } from '@chakra-ui/react';
import {
   CheckCircledIcon,
   ExclamationTriangleIcon,
} from '@radix-ui/react-icons';
import { useUpdateGlobalConfig } from '~/hooks/useUpdateGlobalConfig/useUpdateGlobalConfig';
import { useToast } from '~/lib/Chakra';


export const useAssignExistingRule = ({
   onClose,
   type,
}: {
   onClose: UseDisclosureReturn['onClose'];
   type: 'networks' | 'organizations';
}) => {
   const toast = useToast();

   return useUpdateGlobalConfig({
      onSuccess: () => {
         toast({
            status: 'success',
            icon: <CheckCircledIcon />,
            title: 'Success',
            description: `${
               type.charAt(0).toUpperCase() + type.slice(1)
            } assigned to the rule.`,
         });
         onClose();
      },
      onError: () => {
         toast({
            status: 'error',
            icon: <ExclamationTriangleIcon />,
            title: 'Error',
            description:
               'Failed to assign the rule. If the problem persists, please contact Statseeker support.',
         });
      },
   });
};
