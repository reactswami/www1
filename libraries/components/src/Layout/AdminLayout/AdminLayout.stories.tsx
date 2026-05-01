import { Button } from '@statseeker/components';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { AdminLayout } from './AdminLayout';

const meta = {
   component: AdminLayout,
   parameters: {
      docs: {
         description: {
            component: 'The layout for an administration tool page.',
         },
      },
   },
   argTypes: {
      children: {
         description:
            ' The react component to render as the page body. Note that this is typically an `AdminPage` component.',
      },
      title: {
         control: 'text',
         description: 'The primary page title.',
      },
      subtitle: {
         control: 'text',
         description: 'Optional page sub-title, shown under the primary title.',
      },
      buttonComponent: {
         description: 'Optional button to show in the top right as page-level navigation',
      },
      backButtonLink: {
         control: 'text',
         description: 'Optional to set where the back to back button goes',
      },
      customBackButtonComponent: {
         description: 'If provided this will be shown before the back button link',
      },
   },
   args: {
      children: <>Content goes here</>,
      title: 'My Page',
      subtitle: 'Sub-Title',
      buttonComponent: <Button variant='primary'>Button</Button>,
      backButtonLink: '/',
      customBackButtonComponent: <Button variant='secondary'>Back Button</Button>,
   },
} satisfies Meta<typeof AdminLayout>;

export default meta;

export const Layout: StoryObj<typeof meta> = {};
