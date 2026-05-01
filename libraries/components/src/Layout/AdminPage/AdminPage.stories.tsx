import { type Meta, type StoryObj } from '@storybook/react-vite';
import { AdminPage } from './AdminPage';

const meta = {
   component: AdminPage,
   parameters: {
      docs: {
         description: {
            component: 'The container for an administration tool page.',
         },
      },
   },
   argTypes: {
      className: {
         control: 'text',
         description: 'THe CSS class that is applied to the page.',
      },
      children: {
         control: 'text',
         description: 'Text content of the page.',
      }
   },
   args: {
      className: 'my-page',
      children: 'Hello, this is an admin page.'
   },
} satisfies Meta<typeof AdminPage>;

export default meta;

export const Page: StoryObj<typeof meta> = {};
