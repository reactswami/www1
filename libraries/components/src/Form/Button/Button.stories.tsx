import { SearchIcon, CrossIcon } from '@statseeker/components';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { Button, ButtonVariants } from './Button';

const meta = {
   component: Button,
   parameters: {
      docs: {
         description: {
            component: 'The basic button component for Statseeker.',
         },
      },
   },
   argTypes: {
      variant: {
         control: 'select',
         type: { name: 'string', required: true },
         options: ButtonVariants,
         description: 'The visual style of the button.',
         table: {
            defaultValue: { summary: 'primary' },
         },
      },
      children: {
         control: 'text',
         description: 'Text content of the button. Required for text buttons.',
      },
      isLoading: {
         control: 'boolean',
         description: 'If true, shows a loading spinner instead of button text.',
      },
      isDisabled: {
         control: 'boolean',
         description: 'If true, disables the button and prevents interaction.',
      },
      icon: {
         control: 'object',
         description: 'An icon to display inside the button. Used for icon buttons.',
      },
      'aria-label': {
         control: 'text',
         description: 'Used for icon buttons to provide accessible labels.',
      },
      onClick: {
         action: 'clicked',
         description: 'Function called when the button is clicked.',
      },
   },
   args: {
      variant: 'primary',
      children: 'Button',
      isLoading: false,
      isDisabled: false,
      icon: undefined,
      'aria-label': undefined,
      onClick: fn(),
   },
} satisfies Meta<typeof Button>;

export default meta;

export const Primary: StoryObj<typeof meta> = {
   args: {
      variant: 'primary',
   },
};

export const Secondary: StoryObj<typeof meta> = {
   args: {
      variant: 'secondary',
   },
};

export const Tertiary: StoryObj<typeof meta> = {
   args: {
      variant: 'tertiary',
   },
};

export const Link: StoryObj<typeof meta> = {
   args: {
      variant: 'link',
   },
};

export const Loading: StoryObj<typeof meta> = {
   args: {
      isLoading: true,
   },
};

export const Disabled: StoryObj<typeof meta> = {
   args: {
      isDisabled: true,
   },
};

export const Danger: StoryObj<typeof meta> = {
   args: {
      variant: 'danger',
   },
};

export const DangerLight: StoryObj<typeof meta> = {
   args: {
      variant: 'danger-light',
   },
};

export const Icon: StoryObj<typeof meta> = {
   args: {
      variant: 'danger-light',
      icon: <CrossIcon size={'sm'} />,
      children: undefined,
   },
};

export const IconText: StoryObj<typeof meta> = {
   args: {
      variant: 'secondary',
      icon: <SearchIcon size={'sm'} />,
      children: 'Search',
   },
};

export const Warning: StoryObj<typeof meta> = {
   args: {
      variant: 'warning',
   },
};

export const WarningLight: StoryObj<typeof meta> = {
   args: {
      variant: 'warning-light',
   },
};
