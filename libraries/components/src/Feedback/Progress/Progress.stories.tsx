import { type Meta, type StoryObj } from '@storybook/react-vite';
import { Progress } from './Progress';

const meta = {
   component: Progress,
   parameters: {
      docs: {
         description: {
            component:
               "A progress container. Uses the same arguments as Chakra UI's Progress component. The examples below show only a few of the available props",
         },
      },
   },
} satisfies Meta<typeof Progress>;

export default meta;

export const Default: StoryObj<typeof meta> = {
   args: {
      value: 50,
      size: 'md',
      isIndeterminate: false,
      max: 100,
      min: 0,
   },
};
