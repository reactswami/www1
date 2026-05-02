import { type Meta, type StoryObj } from '@storybook/react-vite';
import { Box } from './Box';

const meta = {
   component: Box,
   parameters: {
      docs: {
         description: {
            component:
               "A generic box layout container. Uses the same arguments as Chakra UI's Box component.",
         },
      },
   },
} satisfies Meta<typeof Box>;

export default meta;

export const Default: StoryObj<typeof meta> = {
   args: {
      children: <div>Hello World</div>,
      padding: 4,
      backgroundColor: 'gray.100',
   },
};

export const AsHeader: StoryObj<typeof meta> = {
   args: {
      as: 'header',
      children: <div>Header Content</div>,
      bg: 'primary.500',
      color: 'white',
      p: 4,
   },
};

export const WithBorder: StoryObj<typeof meta> = {
   args: {
      children: <div>Bordered Box</div>,
      border: '1px solid',
      borderColor: 'gray.200',
      borderRadius: 'md',
      p: 4,
   },
};
