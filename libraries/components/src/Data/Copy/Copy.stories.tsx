import { Text } from '@statseeker/components';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { Copy } from './Copy';

const meta = {
   component: Copy,
   parameters: {
      docs: {
         description: {
            component:
               'A simple way to copy text, The `Copy` component displays an icon next to a text value. When the icon is clicked, the adjacent text is copied to the clipboard.',
         },
      },
   },
   argTypes: {
      text: {
         control: 'text',
         description: 'The text to copy.',
      },
      children: {
         description: 'The elements to display next to the copy icon.',
      },
   },
   args: {
      text: 'You copied me!!',
      children: <Text>Click on the copy icon to copy me</Text>,
   },
} satisfies Meta<typeof Copy>;

export default meta;

export const CopyExample: StoryObj<typeof meta> = {};
