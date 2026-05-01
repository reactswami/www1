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
import { usePingTableContext } from '~/contexts';

export const TableViewSettings = () => {
   const { isInitialLoading, setViewMode } = usePingTableContext();

   return (
      <Skeleton isLoaded={!isInitialLoading}>
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
