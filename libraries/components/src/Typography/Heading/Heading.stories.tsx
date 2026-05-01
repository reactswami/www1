import { type Meta, type StoryObj } from '@storybook/react-vite';
import { Heading } from './Heading';

const meta = {
   component: Heading,
   parameters: {
      docs: {
         description: {
            component:
               "A heading. Uses the same arguments as Chakra UI's Heading component. The examples below show only a few of the available props",
         },
      },
   },
} satisfies Meta<typeof Heading>;

export default meta;

export const Small: StoryObj<typeof meta> = {
   args: {
      children: 'Small heading',
      size: 'sm',
   },
};

export const Medium: StoryObj<typeof meta> = {
   args: {
      children: 'Medium heading',
      size: 'md',
   },
};

export const Large: StoryObj<typeof meta> = {
   args: {
      children: 'Large heading',
      size: 'lg',
   },
};

