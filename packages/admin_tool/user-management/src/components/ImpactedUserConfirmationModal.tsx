import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Box, type UseDisclosureReturn, useDisclosure } from '@chakra-ui/react';
import { Pagination, Spinner } from '@statseeker/components';
import { Button } from '@statseeker/components/Form/Button';
import { SSDataTable } from '@statseeker/components/Legacy/SSDataTable/SSDataTable';
import { Text } from '@statseeker/components/Typography/Text';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { useCallback, useState } from 'react';
import { useDeletePoliciesForm } from '~/hooks/useDeletePoliciesForm';


function UserTable({
   rowData,
}: { rowData: any[] }) {
   const defaultLimit = 10;
   const [limit, setLimit] = useState(defaultLimit);
   const [offset, setOffset] = useState(0);

   if (!rowData || rowData.length === 0) return null;

   const pagedRows = rowData.slice(offset, offset + limit);

   // Reset offset to 0 if limit changes (to avoid out-of-bounds)
   const handleLimitChange = (newLimit: number) => {
      setLimit(newLimit);
      setOffset(0);
   };

   return (
      <>
         <Box width="100%" display="flex" flexDirection="column" alignItems="left">
            <SSDataTable
               columns={[
                  { field: 'name', headerName: 'User Name', canSort: true },
               ]}
               rowData={pagedRows}
               selectText={true}
            />
            {rowData.length > defaultLimit && (
               <Pagination
                  limit={limit}
                  totalCount={rowData.length}
                  onPageChange={setOffset}
                  offset={offset}
                  onLimitChange={handleLimitChange}
               />
            )}
         </Box>
      </>
   );
}

type ImpactedUserConfirmationModalProps = {
   actionName: string;
   ids: number[];
};

export default function ImpactedUserConfirmationModal({
   actionName,
   ids,
}: ImpactedUserConfirmationModalProps) {
   const route = useRouter();
   const { impactedUsers, isImpactedUsersLoading, submitCallback, isLoading } = useDeletePoliciesForm(ids);
   const disclosure = useDisclosure({ defaultIsOpen: true });

   const handleClose = useCallback(() => {
      disclosure.onClose();
      route.history.back();
   }, [disclosure, route]);

   const submitMutation = useMutation({
      mutationFn: async () => submitCallback(ids),
      onSuccess: () => disclosure.onClose(),
   });

   return (
      <Modal size="3xl" isOpen={disclosure.isOpen} onClose={handleClose}>
         <ModalOverlay />
         <ModalContent>
            <ModalHeader>{actionName} Policies</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
               <Text>Are you sure you want to {actionName.toLowerCase()} {ids.length > 1 ? 'these policies?' : 'this policy?'}</Text>
               {isImpactedUsersLoading ? (
                  <Spinner size="md" mt={4} label="Loading impacted users..." />
               ) : impactedUsers && impactedUsers.length > 0 ? (
                  <>
                     <Text mt={2}>The following users will be disabled on the next synchronization if they are not managed by another policy:</Text>
                     <UserTable rowData={impactedUsers} />
                  </>
               ) : (
                  <Text>No users will be impacted.</Text>
               )}
            </ModalBody>
            <ModalFooter>
               <Button
                  variant="secondary"
                  type="button"
                  mr={3}
                  onClick={handleClose}
               >
                  Cancel
               </Button>
               <Button
                  onClick={() => submitMutation.mutate()}
                  variant="primary"
                  colorScheme={'red'}
                  isLoading={isLoading || submitMutation.isPending}
               >
                  {actionName}
               </Button>
            </ModalFooter>
         </ModalContent>
      </Modal>
   );
}
