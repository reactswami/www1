import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
   menuAnatomy.keys
);

// define the base component styles
const baseStyle = definePartsStyle({
   list: {
      // this will style the MenuList component
      py: '4',
      borderRadius: 'xl',
      bg: 'white',
      color: 'black',
   },
   item: {
      // this will style the MenuItem and MenuItemOption components
      _hover: {
         bg: 'var(--chakra-colors-primary-50)',
      },
      _focus: {
         bg: 'var(--chakra-colors-primary-50)',
      },
      _disabled: {
         opacity: '0.4'
      },
   },
   button: {
      _disabled: {
         opacity: '0.4'
      },
   }
});
// export the base styles in the component theme
export const menuTheme = defineMultiStyleConfig({ baseStyle });
