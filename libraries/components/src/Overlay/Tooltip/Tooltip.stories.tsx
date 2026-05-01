import { Box, VStack, HStack } from '@chakra-ui/react';
import { Button } from '@statseeker/components';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';

const meta: Meta<typeof Tooltip> = {
   title: 'Overlay/Tooltip',
   component: Tooltip,
   parameters: {
      layout: 'centered',
      docs: {
         description: {
            component:
               'A tooltip component that displays helpful information when hovering over an element.',
         },
      },
   },
   argTypes: {
      label: {
         control: 'text',
         description: 'The label of the tooltip',
      },
      placement: {
         control: 'select',
         options: [
            'auto',
            'auto-start',
            'auto-end',
            'top',
            'top-start',
            'top-end',
            'bottom',
            'bottom-start',
            'bottom-end',
            'right',
            'right-start',
            'right-end',
            'left',
            'left-start',
            'left-end',
         ],
         description: 'The placement of the tooltip',
      },
   },
   args: {
      label: 'This is a tooltip',
      placement: 'top',
   },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic story with controls
export const Default: Story = {
   render: (args) => (
      <Tooltip {...args}>
         <Button variant={'primary'}>Hover me</Button>
      </Tooltip>
   ),
};

// Different placements
export const Placements: Story = {
   render: () => (
      <Box p={20}>
         <VStack spacing={8}>
            <HStack spacing={8}>
               <Tooltip label="Top start" placement="top-start" hasArrow>
                  <Button variant={'primary'}>Top Start</Button>
               </Tooltip>
               <Tooltip label="Top" placement="top" hasArrow>
                  <Button variant={'primary'} size="sm">
                     Top
                  </Button>
               </Tooltip>
               <Tooltip label="Top end" placement="top-end" hasArrow>
                  <Button variant={'primary'} size="sm">
                     Top End
                  </Button>
               </Tooltip>
            </HStack>

            <HStack spacing={8}>
               <Tooltip label="Left start" placement="left-start" hasArrow>
                  <Button variant={'primary'} size="sm">
                     Left Start
                  </Button>
               </Tooltip>
               <Tooltip label="Center" placement="top" hasArrow>
                  <Button variant={'primary'} size="sm">
                     Center
                  </Button>
               </Tooltip>
               <Tooltip label="Right start" placement="right-start" hasArrow>
                  <Button variant={'primary'} size="sm">
                     Right Start
                  </Button>
               </Tooltip>
            </HStack>

            <HStack spacing={8}>
               <Tooltip label="Left" placement="left" hasArrow>
                  <Button variant={'primary'} size="sm">
                     Left
                  </Button>
               </Tooltip>
               <Tooltip label="Auto" placement="auto" hasArrow>
                  <Button variant={'primary'} size="sm">
                     Auto
                  </Button>
               </Tooltip>
               <Tooltip label="Right" placement="right" hasArrow>
                  <Button variant={'primary'} size="sm">
                     Right
                  </Button>
               </Tooltip>
            </HStack>

            <HStack spacing={8}>
               <Tooltip label="Bottom start" placement="bottom-start" hasArrow>
                  <Button variant={'primary'} size="sm">
                     Bottom Start
                  </Button>
               </Tooltip>
               <Tooltip label="Bottom" placement="bottom" hasArrow>
                  <Button variant={'primary'} size="sm">
                     Bottom
                  </Button>
               </Tooltip>
               <Tooltip label="Bottom end" placement="bottom-end" hasArrow>
                  <Button variant={'primary'} size="sm">
                     Bottom End
                  </Button>
               </Tooltip>
            </HStack>
         </VStack>
      </Box>
   ),
   parameters: {
      controls: { disable: true },
   },
};
