import { type Meta, type StoryObj } from '@storybook/react-vite';
import { Grid, GridItem } from './Grid';

const meta = {
   component: Grid,
   parameters: {
      docs: {
         description: {
            component:
               "A CSS Grid layout container. Uses the same arguments as Chakra UI's Grid component. Use GridItem for each cell.",
         },
      },
   },
} satisfies Meta<typeof Grid>;

export default meta;

export const TwoColumn: StoryObj<typeof meta> = {
   args: {
      templateColumns: 'repeat(2, 1fr)',
      gap: 4,
      children: (
         <>
            <GridItem><div>Column 1</div></GridItem>
            <GridItem><div>Column 2</div></GridItem>
         </>
      ),
   },
};

export const ThreeColumn: StoryObj<typeof meta> = {
   args: {
      templateColumns: 'repeat(3, 1fr)',
      gap: 6,
      children: (
         <>
            <GridItem><div>Column A</div></GridItem>
            <GridItem><div>Column B</div></GridItem>
            <GridItem><div>Column C</div></GridItem>
         </>
      ),
   },
};

export const AsymmetricColumns: StoryObj<typeof meta> = {
   args: {
      templateColumns: '30% 70%',
      gap: 4,
      children: (
         <>
            <GridItem><div>Sidebar</div></GridItem>
            <GridItem><div>Main Content</div></GridItem>
         </>
      ),
   },
};
