import { IconButton, Tooltip, useDisclosure } from '@chakra-ui/react';
import { Link2Icon } from '@radix-ui/react-icons';
import { type Cell } from '@tanstack/react-table';
import { ModalAssignToExisting } from '~/components';
import { type OrganizationRow } from '~/features/organizations/components';

interface Props {
   type: 'networks' | 'organizations';
   cell: Cell<any, any>;
}

export const AssignToRuleButton = ({ type, cell }: Props) => {
   const disclosure = useDisclosure();
   const { onOpen } = disclosure;
   return (
      <>
         <Tooltip label="Assign to an existing rule">
            <IconButton
               aria-label="assign to existing rule"
               icon={<Link2Icon />}
               variant={'ghost'}
               size="xs"
               onClick={(e) => {
                  e.stopPropagation(); // Prevent the row from being selected
                  onOpen();
               }}
            />
         </Tooltip>
         <ModalAssignToExisting
            disclosure={disclosure}
            type={type}
            selectedRows={[cell.row as unknown as OrganizationRow]}
         />
      </>
   );
};
