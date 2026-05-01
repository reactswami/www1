import {
   Button,
   Flex,
   Menu,
   MenuButton,
   MenuItem,
   MenuList,
   Text,
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';

import { type ReactElement } from 'react';

type Action = {
   label: string;
   icon?: ReactElement;
   onClick: (args?: any) => void;
   isShow?: () => boolean;
};

interface Props {
   selectedRowsCount: number;
   actions: Action[];
}

export const TableBulkActions = ({ selectedRowsCount, actions }: Props) => {
   return (
      <Menu>
         {({ isOpen }) => (
            <>
               <Flex alignItems="center" gap="sm">
                  <Text>{selectedRowsCount} selected</Text>
                  <MenuButton
                     as={Button}
                     variant="outline"
                     isDisabled={selectedRowsCount === 0}
                     rightIcon={
                        isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />
                     }
                  >
                     Bulk actions
                  </MenuButton>
               </Flex>
               <MenuList>
                  {actions.map(
                     ({ label, onClick, isShow = () => true, icon }, idx) => (
                        <MenuItem
                           key={idx}
                           isDisabled={!isShow() || selectedRowsCount === 0}
                           closeOnSelect
                           onClick={async () => await onClick()}
                           background={'white'}
                           gap="sm"
                        >
                           {icon}
                           {label}
                        </MenuItem>
                     )
                  )}
               </MenuList>
            </>
         )}
      </Menu>
   );
};
