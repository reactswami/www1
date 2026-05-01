import { type Meta, type StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';

const meta = {
   component: Divider,
   parameters: {
      docs: {
         description: {
            component:
               "A divider component. Uses the same arguments as Chakra UI's Divider component. The examples below show only a few of the available props",
         },
      },
   },
} satisfies Meta<typeof Divider>;
export default meta;

export const Default: StoryObj<typeof meta> = {};

export const borderColor: StoryObj<typeof meta> = {
   args: {
      borderColor: 'blue.500',
   },
};

export const borderWidth: StoryObj<typeof meta> = {
   args: {
      borderWidth: '2px',
   },
};

export const orientation: StoryObj<typeof meta> = {
   args: {
      orientation: 'vertical',
      height: '100px',
   },
};