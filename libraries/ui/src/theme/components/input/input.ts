import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';
import { borderRadius } from '../../foundations/borderRadius/borderRadius';
import { typography } from '../../foundations/typography/typography';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(inputAnatomy.keys);

export const input = defineMultiStyleConfig({
   sizes: {
      lg: definePartsStyle({
         group: defineStyle({
            '--input-height': 'sizes.10',
         }),
         field: defineStyle({
            fontSize: 'md',
            borderRadius: borderRadius.radii.base,
            h: 10,
         }),
         element: defineStyle({
            fontSize: typography.label.fontSize,
            borderRadius: borderRadius.radii.base,
            h: 10,
         }),
         addon: defineStyle({
            fontSize: typography.label.fontSize,
            borderRadius: borderRadius.radii.base,
            h: 10,
         }),
      }),
      md: definePartsStyle({
         group: defineStyle({
            '--input-height': 'sizes.8',
         }),
         field: defineStyle({
            fontSize: 'sm',
            borderRadius: borderRadius.radii.base,
            h: 8,
         }),
         element: defineStyle({
            fontSize: typography.label.fontSize,
            borderRadius: borderRadius.radii.base,
            h: 8,
         }),
         addon: defineStyle({
            fontSize: typography.label.fontSize,
            borderRadius: borderRadius.radii.base,
            h: 8,
         }),
      }),
      sm: definePartsStyle({
         group: defineStyle({
            '--input-height': 'sizes.7',
         }),
         field: defineStyle({
            fontSize: 'sm',
            borderRadius: borderRadius.radii.base,
            h: 7,
         }),
         element: defineStyle({
            fontSize: typography.label.fontSize,
            borderRadius: borderRadius.radii.base,
            h: 7,
         }),
         addon: defineStyle({
            fontSize: typography.label.fontSize,
            borderRadius: borderRadius.radii.base,
            h: 7,
         }),
      }),
   },
});
