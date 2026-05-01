import { typography } from '../../foundations/typography/typography';

export const button = {
   baseStyle: {
      letterSpacing: typography.button.letterSpacing,
      fontWeight: typography.button.fontWeight,
      textTransform: typography.button.textTransform,
      fontFamily: typography.button.fontFamily,
      borderRadius: 'sm',
   },
   variants: {
      solid: {
         boxShadow: 'var(--chakra-shadows-sm)',
         _hover: {
            boxShadow: 'var(--chakra-shadows-md)',
         },
         _active: {
            boxShadow: 'var(--chakra-shadows-inner)',
            background: 'var(--chakra-colors-primary-50)',
         },
         _disabled: {
            boxShadow: 'var(--chakra-shadows-none)',
            _hover: {
               boxShadow: 'var(--chakra-shadows-none)',
            },
         },
      },
      outline: {
         boxShadow: 'var(--chakra-shadows-sm)',
         _hover: {
            boxShadow: 'var(--chakra-shadows-md)',
         },
         _active: {
            boxShadow: 'var(--chakra-shadows-inner)',
            background: 'var(--chakra-colors-primary-50)',
         },
         _disabled: {
            boxShadow: 'var(--chakra-shadows-none)',
            _hover: {
               boxShadow: 'var(--chakra-shadows-none)',
            },
         },
      },

      ghost: {
         _hover: {
            boxShadow: 'var(--chakra-shadows-md)',
         },
         _active: {
            boxShadow: 'var(--chakra-shadows-inner)',
            background: 'var(--chakra-colors-primary-50)',
         },
         _disabled: {
            boxShadow: 'var(--chakra-shadows-none)',
            _hover: {
               boxShadow: 'var(--chakra-shadows-none)',
            },
         },
      },
   },
   defaultProps: {
      size: 'sm',
      colorScheme: 'primary',
      variant: 'solid',
   },
};
