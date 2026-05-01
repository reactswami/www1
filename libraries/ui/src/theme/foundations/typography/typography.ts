import { colors } from '../colors/colors';

const lineHeight = { body: '160%', title: '130%' };
const fontFamily = { standard: "var(--font-family)" };

export const typography: { [key in keys]: attributes } = {
   h1: {
      fontSize: '2.5rem',
      letterSpacing: 'calc(-0.015 * 2.5rem)',
      fontWeight: 'bold',
      color: colors.primary[500],
      fontFamily: fontFamily.standard,
      lineHeight: lineHeight.title,
   },
   h2: {
      fontSize: '2rem',
      letterSpacing: 'calc(-0.005 * 2rem)',
      fontWeight: '500',
      fontFamily: fontFamily.standard,
      lineHeight: lineHeight.title,
      color: colors.primary[400],
   },
   h3: {
      fontSize: '1.75rem',
      fontWeight: '500',
      fontFamily: fontFamily.standard,
      lineHeight: lineHeight.title,
      letterSpacing: 'default',
      color: colors.primary[300],
   },
   h4: {
      fontSize: '1.5rem',
      letterSpacing: 'calc(0.0025 * 1.5rem)',
      fontWeight: 'normal',
      fontFamily: fontFamily.standard,
      lineHeight: lineHeight.title,
      color: colors.primary[200],
   },
   h5: {
      fontSize: '1.2rem',
      letterSpacing: 'calc(0.015 * 3rem)',
      fontWeight: 'normal',
      fontFamily: fontFamily.standard,
      lineHeight: lineHeight.title,
      color: colors.primary[200],
   },
   body: {
      fontFamily: fontFamily.standard,
      color: colors.gray[900],
      fontSize: '1rem',
      lineHeight: lineHeight.body,
      letterSpacing: 'calc(1rem * 0.015)',
      fontWeight: '500',
   },
   button: {
      fontFamily: fontFamily.standard,
      fontSize: '.95rem',
      textTransform: 'capitalize',
      lineHeight: lineHeight.body,
      letterSpacing: 'calc(1rem * 0.025)',
      fontWeight: 'bold',
   },
   label: {
      fontFamily: fontFamily.standard,
      fontSize: '.75rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      lineHeight: lineHeight.title,
      color: colors.gray[800],
      letterSpacing: 'calc(0.75rem * 0.05)',
   },
};

export const Typography = typeof typography;

export type keys =
   | 'body'
   | 'h1'
   | 'h2'
   | 'h3'
   | 'h4'
   | 'h5'
   | 'button'
   | 'label';

export type attributes = {
   fontSize: string;
   fontFamily: string;
   letterSpacing: string;
   fontWeight: string;
   lineHeight: string;
   color?: string;
   textTransform?: string;
};
