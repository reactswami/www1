import { type Meta, type StoryObj } from '@storybook/react-vite';
import { Spinner } from '../Spinner';
import { Alert, AlertVariants } from './Alert';

const meta = {
   component: Alert,
   parameters: {
      docs: {
         description: {
            component:
               'Alerts are used to communicate a state that affects a system, feature or page.',
         },
      },
   },
   argTypes: {
      title: {
         control: 'text',
         description: 'The title of the alert',
      },
      description: {
         control: 'text',
         description: 'The description text. ie. the main message',
      },
      variant: {
         control: 'select',
         type: { name: 'string', required: true },
         options: AlertVariants,
         description: 'The type of alert.',
         table: {
            defaultValue: { summary: 'primary' },
         },
      },
      customIcon: {
         control: 'object',
         description: 'A custom icon to display on the alert',
      },
      noIcon: {
         control: 'boolean',
         description: 'If set, no icon will be used on the alert.',
      },
   },
   args: {
      title: 'My Alert',
      description: 'This is an alert message that provides important information to the user.',
      variant: 'info',
      customIcon: undefined,
      noIcon: undefined,
   },
} satisfies Meta<typeof Alert>;

export default meta;

export const Info: StoryObj<typeof meta> = {
   args: {
      title: 'Info',
      description: 'This is an info alert message that provides important information to the user.',
      variant: 'info',
   },
};

export const Success: StoryObj<typeof meta> = {
   args: {
      title: 'Success',
      description: 'This is a success alert message that indicates a successful operation.',
      variant: 'success',
   },
};

export const Warning: StoryObj<typeof meta> = {
   args: {
      title: 'Warning',
      description: 'This is a warning alert message that indicates a potential issue.',
      variant: 'warning',
   },
};

export const Error: StoryObj<typeof meta> = {
   args: {
      title: 'Error',
      description: 'This is an error alert message that indicates a problem occurred.',
      variant: 'error',
   },
};

export const CustomIcon: StoryObj<typeof meta> = {
   args: {
      title: 'Custom Icon',
      description: 'This alert uses a custom icon.',
      variant: 'info',
      customIcon: <Spinner />,
   },
};

export const NoIcon: StoryObj<typeof meta> = {
   args: {
      title: 'No Icon',
      description: 'This alert does not display an icon.',
      variant: 'info',
      noIcon: true,
   },
};

export const NoTitle: StoryObj<typeof meta> = {
   args: {
      title: undefined,
      description: 'This alert uses a custom icon without a title.',
      variant: 'warning',
      customIcon: <Spinner />,
   },
};
