import { Button } from '@statseeker/components';
import { type Meta, type StoryObj } from '@storybook/react-vite';
import { StatseekerThemeProvider } from './StatseekerThemeProvider';

const meta = {
   component: StatseekerThemeProvider,
   parameters: {
      docs: {
         description: {
            component: 'The Statseeker theme for all apps',
         },
      },
   },
} satisfies Meta<typeof StatseekerThemeProvider>;

export default meta;

export const ThemedButton: StoryObj<typeof meta> = {
   args: {
      children: <Button variant="primary">Primary Button</Button>,
   },
};
