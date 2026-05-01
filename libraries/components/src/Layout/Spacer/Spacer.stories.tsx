import { type Meta, type StoryObj } from '@storybook/react-vite';
import { Spacer } from './Spacer';

const meta = {
   component: Spacer,
   parameters: {
      docs: {
         description: {
            component:
               "A spacer container. Uses the same arguments as Chakra UI's Spacer component. The examples below show only a few of the available props",
         },
      },
   },
} satisfies Meta<typeof Spacer>;

export default meta;

export const Default: StoryObj<typeof meta> = {};
