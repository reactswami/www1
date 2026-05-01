import { IconButton, Tooltip, type UseDisclosureReturn } from '@chakra-ui/react';
import { Pencil1Icon } from '@statseeker/ui/icons';
import React from 'react';
import { ModalEditForm } from '../ModalEditForm';

export interface EditButtonProps {
   disclosure: UseDisclosureReturn;
   render: () => React.ReactElement;
   title: string;
}

export const TableEditButton = ({ render, disclosure, title }: EditButtonProps) => {
   return (
      <>
         <ModalEditForm disclosure={disclosure} render={render} title={title} />
         <Tooltip label="Edit">
            <IconButton
               aria-label="edit"
               size="xs"
               position={'relative'}
               zIndex={0}
               variant="ghost"
               onClick={() => {
                  disclosure.onOpen();
               }}
               icon={<Pencil1Icon />}
            />
         </Tooltip>
      </>
   );
};
