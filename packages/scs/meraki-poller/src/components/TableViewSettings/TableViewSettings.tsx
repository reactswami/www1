import {
   Button,
   Menu,
   MenuButton,
   MenuItemOption,
   MenuList,
   MenuOptionGroup,
   Skeleton,
} from '@chakra-ui/react';

import { MixerHorizontalIcon } from '@radix-ui/react-icons';

interface Props {
   isLoading?: boolean;
   viewMode: 'sm' | 'md';
   setViewMode: (arg: 'sm' | 'md') => void;
}

export const TableViewSettings = ({
   viewMode,
   setViewMode,
   isLoading = false,
}: Props) => {
   return (
      <Skeleton isLoaded={!isLoading}>
         <Menu>
            <MenuButton
               as={Button}
               variant="outline"
               leftIcon={<MixerHorizontalIcon />}
            >
               View settings
            </MenuButton>
            <MenuList>
               <MenuOptionGroup
                  type="radio"
                  defaultValue={'normal'}
                  title="View mode"
               >
                  <MenuItemOption
                     fontSize="sm"
                     value="compact"
                     onClick={() => setViewMode('sm')}
                  >
                     Compact
                  </MenuItemOption>
                  <MenuItemOption
                     fontSize="sm"
                     value={'normal'}
                     onClick={() => setViewMode('md')}
                  >
                     Normal
                  </MenuItemOption>
               </MenuOptionGroup>
            </MenuList>
         </Menu>
      </Skeleton>
   );
};
