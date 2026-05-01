import { type Meta, type StoryObj } from '@storybook/react-vite';
import { Tag, TagVariants } from './Tag';

const meta = {
   component: Tag,
   parameters: {
      docs: {
         description: {
            component: 'The basic tag component for Statseeker.',
         },
      },
   },
   argTypes: {
      variant: {
         control: 'select',
         type: { name: 'string', required: true },
         options: TagVariants,
         description: 'The visual style of the tag.',
         table: {
            defaultValue: { summary: 'gray' },
         },
      },
      children: {
         control: 'text',
         description: 'Text content of the tag.',
      },
      title: {
         control: 'text',
         description: 'Title of the tag.',
      },
      size: {
         control: 'select',
         description: 'The size of the tag. Can be "sm", "md", or "lg".',
         table: {
            defaultValue: { summary: 'sm' },
         },
      },
      textTransform: {
         control: 'text',
         description: 'Casing of the text.',
      },
   },
   args: {
      variant: 'gray',
      children: 'Label',
      title: '',
      size: 'sm',
   },
} satisfies Meta<typeof Tag>;

export default meta;

export const Default: StoryObj<typeof meta> = {};

export const Medium: StoryObj<typeof meta> = {
   args: {
      size: 'md',
   },
};

export const Large: StoryObj<typeof meta> = {
   args: {
      size: 'lg',
   },
};

export const Success: StoryObj<typeof meta> = {
   args: {
      variant: 'success',
   },
};

export const Warning: StoryObj<typeof meta> = {
   args: {
      variant: 'warning',
   },
};

export const Danger: StoryObj<typeof meta> = {
   args: {
      variant: 'danger',
   },
};

export const WithTitle: StoryObj<typeof meta> = {
   args: {
      title: 'I am Tag. Hear me roar!',
   },
};

export const Blue: StoryObj<typeof meta> = {
   args: {
      variant: 'blue',
   },
};

export const Purple: StoryObj<typeof meta> = {
   args: {
      variant: 'purple',
   },
};

export const Cyan: StoryObj<typeof meta> = {
   args: {
      variant: 'cyan',
   },
};

export const Yellow: StoryObj<typeof meta> = {
   args: {
      variant: 'yellow',
   },
};

export const Pink: StoryObj<typeof meta> = {
   args: {
      variant: 'pink',
   },
};

export const LowerCase: StoryObj<typeof meta> = {
   args: {
      textTransform: 'lowercase',
   },
};

export const UpperCase: StoryObj<typeof meta> = {
   args: {
      textTransform: 'uppercase',
   },
};

export const Capitalize: StoryObj<typeof meta> = {
   args: {
      children: 'label',
      textTransform: 'capitalize',
   },
};
