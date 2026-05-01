const baseUnit = '1em';
const multiplicators = {
   xxs: 0.25,
   xs: 0.5,
   sm: 0.75,
   base: 1,
   md: 1.25,
   lg: 2,
   xl: 3.25,
   xxl: 5.25,
};

export const spacing = {
   none: 0,
   px: '1px',
   ...Object.entries(multiplicators)
      .map(([key, value]) => ({
         [key]: `calc(${value} * ${baseUnit})`,
      }))
      .reduce(
         (previousValue, currentValue) => ({
            ...previousValue,
            ...currentValue,
         }),
         {}
      ),
} as unknown as Spacing;

export const getSpacing = (key?: Spacing): string => {
   if (!spacing) {
      return '';
   }
   return spacing[key as unknown as number];
};

export type Spacing = keyof typeof multiplicators | 'px' | 'none';
