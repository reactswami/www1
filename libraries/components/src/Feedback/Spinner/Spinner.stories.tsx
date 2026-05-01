import { type Meta, type StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';

const meta = {
   component: Spinner,
   parameters: {
      docs: {
         description: {
            component: 'A spinner icon, used as an indefinite loading indicator',
         },
      },
   },
   argTypes: {
      size: {
         control: 'select',
         type: { name: 'string', required: true },
         options: ['sm', 'md', 'lg'],
         description: 'The size of the spinner.',
         table: {
            defaultValue: { summary: 'md' },
         },
      },
   },
   args: {
      size: 'md',
   },
} satisfies Meta<typeof Spinner>;

export default meta;

export const Standard: StoryObj<typeof meta> = {
   args: {
      size: 'md',
   },
};

export const Small: StoryObj<typeof meta> = {
   args: {
      size: 'sm',
   },
};

export const Large: StoryObj<typeof meta> = {
   args: {
      size: 'lg',
   },
};

export const Centered: StoryObj<typeof meta> = {
   args: {
      centered: true,
   },
};
