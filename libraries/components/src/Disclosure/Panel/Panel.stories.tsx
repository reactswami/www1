import { type Meta, type StoryObj } from '@storybook/react-vite';
import { Panel } from '../Panel';
import { Accordion } from '@chakra-ui/react';

const meta = {
   component: Panel,
   parameters: {
      docs: {
         description: {
            component:
               'Panels are used within the Accordian component to display collapsible information.',
         },
      },
   },
   argTypes: {
      title: {
         control: 'text',
         description: 'The title of the alert',
      },
      children: {

      },
      className: {

      },
      subTitle: {

      }
   },
   args: {
      title: 'My Panel',
      children: <p>This some text within the panel</p>,
      className: undefined,
      subTitle: 'Subtitle panel text'
   },
} satisfies Meta<typeof Panel>;

export default meta;

export const TextPanel: StoryObj<typeof meta> = {
   args: {
      title: 'My Panel',
      children: <p>This some text within the panel</p>,
      className: undefined,
      subTitle: 'Subtitle panel text'
   },
   render: (args) => (
      <Accordion>
         <Panel {...args} />
      </Accordion>
   )
};
