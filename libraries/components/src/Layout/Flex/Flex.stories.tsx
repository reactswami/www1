import { type Meta, type StoryObj } from '@storybook/react-vite';
import { Flex } from './Flex';

const meta = {
   component: Flex,
   parameters: {
      docs: {
         description: {
            component:
               "A standard flex box. Uses the same arguments as Chakra UI's Flex component. The examples below show only a few of the available props",
         },
      },
   },
} satisfies Meta<typeof Flex>;

export default meta;

export const SpaceBetween: StoryObj<typeof meta> = {
   args: {
      children: (
         <>
            <div>Hello</div>
            <div>World</div>
         </>
      ),
      justifyContent: 'space-between',
   },
};

export const Column: StoryObj<typeof meta> = {
   args: {
      children: (
         <>
            <div>Hello</div>
            <div>World</div>
         </>
      ),
      flexDir: 'column',
   },
};

export const Gap: StoryObj<typeof meta> = {
   args: {
      children: (
         <>
            <div>Hello</div>
            <div>World</div>
         </>
      ),
      gap: 4,
   },
};
