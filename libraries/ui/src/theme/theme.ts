import { extendTheme } from '@chakra-ui/react';
import { button } from './components/button/button';
import { formControl } from './components/formControl/formControl';
import { formLabel } from './components/formLabel/formLabel';
import { input } from './components/input/input';
import { menuTheme } from './components/menu/menu';
import { table } from './components/table/table';
import { TypeAheadTheme } from './components/typeahead/typeahead';
import { borderRadius } from './foundations/borderRadius/borderRadius';
import { colors } from './foundations/colors/colors';
import { spacing } from './foundations/spacing/spacing';
import { typography } from './foundations/typography/typography';

export const theme = {
   fonts: {
      heading: 'var(--font-family)',
      subHeading: 'var(--font-family)',
      body: 'var(--font-family)',
   },
   colors,
   textStyles: typography,
   space: spacing,
   borderRadius: borderRadius,
   components: {
      Button: button,
      Input: input,
      FormControl: formControl,
      FormLabel: formLabel,
      Table: table,
      Menu: menuTheme,
      Switch: {
         defaultProps: {
            colorScheme: 'green',
         },
      },
      Code: {
         baseStyle: {
            border: '1px',
            borderColor: 'gray.300',
            paddingX: '1',
         },
      },
      Alert: {
         baseStyle: {
            container: {
               borderRadius: 'base',
               shadow: 'xs',
            },
         },
      },
      Modal: {
         baseStyle: {
            dialog: {
               backgroundColor: 'var(--chakra-colors-white-500)',
            },
         },
      },
      Select: {
         sizes: {
            md: {
               field: {
                  fontSize: 'sm',
                  borderRadius: borderRadius.radii.base,
                  h: 8,
               },
            },
         },
         defaultProps: {
            size: 'md',
         },
      },
      TypeAhead: TypeAheadTheme
   },
};

export const chakraTheme = extendTheme(theme);
