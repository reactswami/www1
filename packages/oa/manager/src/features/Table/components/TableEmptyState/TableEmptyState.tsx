import { Button, Flex, Heading } from '@chakra-ui/react';
import { PlusIcon } from '@statseeker/ui/icons';
import { lazy } from 'react';
import { FormDownloadNewOaModal, ModalAddForm } from '~/components';
import { useCreateOa } from '~/hooks';

const DevSeedDataButton = lazy(
   () => import('~/components/DevSeedDataButton/DevSeedDataButton')
);

interface Props {
   hasFilters: boolean;
}

export const TableEmptyState = ({ hasFilters }: Props) => {

   const { isCreatingOa, openCreate, isCreateOpen, closeCreate,
      onSubmit: createSubmit, isNewDownloadOpen, closeNewDownload, newOaName } =
      useCreateOa();

   const createProps = {
      isOpen: isCreateOpen,
      onClose: closeCreate,
      isCreatingOa,
      onSubmit: createSubmit,
   };

   return (
      <Flex
         direction={'column'}
         alignItems={'center'}
         gap="4"
         justifyContent={'center'}
         flexGrow={1}
         paddingBottom={24}
         height="100%"
         width="100%"
         position="absolute"
         top={0}
         left={0}
      >
         <ModalAddForm {...createProps} />
         <FormDownloadNewOaModal
            isOpen={isNewDownloadOpen}
            onClose={closeNewDownload}
            newOaName={newOaName ?? ''}
         />
         <Flex
            direction="column"
            alignItems="center"
            justifyContent="center"
            paddingY={12}
            paddingX={8}
            shadow="md"
            background={'page.500'}
            border="1px"
            borderColor={'gray.600'}
         >
            <Heading size="md" paddingBottom={2}>
               {hasFilters
                  ? 'No Observability Appliance found for your search query'
                  : 'No Observability Appliances available'}
            </Heading>
            {!hasFilters && (
               <Button
                  onClick={openCreate}
                  marginTop={8}
                  variant="outline"
                  leftIcon={<PlusIcon />}
               >
                  Create an Observability Appliance
               </Button>
            )}
         </Flex>
         {import.meta.env.MODE === 'staging' && <DevSeedDataButton />}
      </Flex>
   );
};
