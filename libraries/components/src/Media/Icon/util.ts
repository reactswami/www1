import type React from 'react';

export interface IconProps {
   size?: 'sm' | 'md' | 'lg' | 'xl';
   style?: React.CSSProperties;
}

export const getIconSize = (size: IconProps['size']): number => {
   switch (size) {
      case 'sm':
         return 16;
      case 'md':
         return 24;
      case 'lg':
         return 32;
      case 'xl':
         return 48;
      default:
         return 24;
   }
};


export const getIconStrokeWidth = (size: IconProps['size']): number => {
   switch (size) {
      case 'sm':
         return 2.5;
      case 'md':
         return 2;
      case 'lg':
         return 1.5;
      case 'xl':
         return 1;
      default:
         return 2;
   }
};