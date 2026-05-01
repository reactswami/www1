import { type Meta, type StoryObj } from '@storybook/react-vite';
import { Text } from './Text';

const meta = {
   component: Text,
   parameters: {
      docs: {
         description: {
            component:
               "A text container. Uses the same arguments as Chakra UI's Text component. The examples below show only a few of the available props",
         },
      },
   },
} satisfies Meta<typeof Text>;

export default meta;

export const Small: StoryObj<typeof meta> = {
   args: {
      children: 'Some text',
   },
};
