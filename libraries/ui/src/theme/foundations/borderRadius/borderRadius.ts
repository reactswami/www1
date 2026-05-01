export const borderRadius = {
   radii: {
      none: '0',
      sm: '0.0625rem',
      base: '0.125rem',
      md: '0.25rem',
      lg: '0.5rem',
      xl: '0.375rem',
      '2xl': '.75rem',
      '3xl': '1rem',
      full: '9999px',
   },
};

export type BorderRadius = keyof typeof borderRadius.radii;
