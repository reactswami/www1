import {
   Box,
   Button,
   ButtonGroup,
   Divider,
   Flex,
   Heading,
   Text,
} from '@chakra-ui/react';

import { Loader } from '@statseeker/components/Legacy/Loader';
import { ExclamationTriangleIcon } from '@statseeker/ui/icons';
import { FormProvider, type UseFormReturn } from 'react-hook-form';
import { AssignServicesService } from '~/components';
import { type Services } from '~/hooks';

interface AssignServicesFormData {
   // Define your form data type here
   [key: string]: any;
}

interface Props {
   name: string;
   isSaving: boolean;
   isLoading: boolean;
   isError: boolean;
   services: Services;
   methods: UseFormReturn<AssignServicesFormData>;
   onSubmit: (data: AssignServicesFormData) => void;
   onClose?: () => void;
   disabledServices?: { state: boolean; id: string }[];
}

export const AssignServicesForm = ({
   name,
   isSaving,
   isLoading,
   isError,
   services,
   methods,
   onSubmit,
   onClose,
   disabledServices
}: Props) => {

   return (
      <FormProvider {...methods}>
         <Flex padding={8} direction="column" gap="sm">
            <Box>
               <Heading size="md">Assign services</Heading>
               <Heading color="gray.600" size="xs" paddingTop={1}>
                  Observability Appliance: {name}
               </Heading>
            </Box>
            <Divider />
            <Box minHeight={60}>
               {isLoading && <Loader isFullScreen={false} />}
               {isError && (
                  <Text color="red.600">
                     <ExclamationTriangleIcon />
                     Error retrieving the list of services
                  </Text>
               )}

               {!isError && !isLoading && (
                  <>
                     <Box minH={64}>
                        {services.map((service, index) => (
                           <Box key={index}>
                              <AssignServicesService service={service} disabledServices={disabledServices} />
                              <Divider marginY={2} />
                           </Box>
                        ))}
                     </Box>
                     <ButtonGroup gap="sm">
                        <Button
                           onClick={methods.handleSubmit(onSubmit)}
                           isLoading={isSaving}
                        >
                           Save
                        </Button>
                        {onClose && (
                           <Button
                              variant="ghost"
                              onClick={onClose}
                              isDisabled={isSaving}
                           >
                              Cancel
                           </Button>
                        )}
                     </ButtonGroup>
                  </>
               )}
            </Box>
         </Flex>
      </FormProvider>
   );
};