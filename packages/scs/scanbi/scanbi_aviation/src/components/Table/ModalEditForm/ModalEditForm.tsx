import { Heading, type UseDisclosureReturn } from '@chakra-ui/react';
import { SSModal } from '@statseeker/components/Layout/Modal';
import React from 'react';

export interface EditProps {
   disclosure: UseDisclosureReturn;
   render: () => React.ReactElement;
   title: string;
}

export const ModalEditForm = ({ disclosure, render, title }: EditProps) => {
   return (
      <SSModal
         disclosure={disclosure}
         isCentered
         closeOnOverlayClick={false}
         contentProps={{ maxWidth: '100vw', width: 'max-content', padding: 8 }}
         bodyProps={{ padding: 0 }}
      >
         <Heading>{title}</Heading>
         {render()}
      </SSModal>
   );
};
