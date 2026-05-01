import {
   Title,
   Subtitle,
   Description,
   Primary,
   Controls,
   IconGallery,
} from '@storybook/addon-docs/blocks';
import { type Meta, type StoryObj } from '@storybook/react';
import { StorybookIconItem } from './StorybookIconItem';
import {
   CheckIcon,
   ChevronDownIcon,
   CopyIcon,
   CrossIcon,
   HistoryIcon,
   ListRestartIcon,
   MapPinRadarIcon,
   RadarIcon,
   RotateCwIcon,
   SearchIcon,
   SquarePenIcon,
} from '.';

const meta: Meta<typeof SearchIcon> = {
   component: SearchIcon,
   title: 'Media/Icon',
   argTypes: {
      size: {
         control: 'select',
         description: 'Size of the icon',
         defaultValue: 'md',
      },
   },
   parameters: {
      docs: {
         description: {
            component: 'A simple search icon that can be used in various sizes.',
         },
         page: () => (
            <>
               {' '}
               <Title />
               <Subtitle />
               <Description />
               <Primary />
               <Controls />
               <IconGallery>
                  <StorybookIconItem icon={<CheckIcon />} />
                  <StorybookIconItem icon={<ChevronDownIcon />} />
                  <StorybookIconItem icon={<CopyIcon />} />
                  <StorybookIconItem icon={<CrossIcon />} />
                  <StorybookIconItem icon={<HistoryIcon />} />
                  <StorybookIconItem icon={<ListRestartIcon />} />
                  <StorybookIconItem icon={<MapPinRadarIcon />} />
                  <StorybookIconItem icon={<RadarIcon />} />
                  <StorybookIconItem icon={<RotateCwIcon />} />
                  <StorybookIconItem icon={<SearchIcon />} />
                  <StorybookIconItem icon={<SquarePenIcon />} />
               </IconGallery>
            </>
         ),
      },
   },
};

export default meta;


export const Basic: StoryObj<typeof meta> = {
   args: {
      size: 'md',
   },
};
