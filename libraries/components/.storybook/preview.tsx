import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import {
   Title,
   Subtitle,
   Description,
   Primary,
   Controls,
   Stories,
} from '@storybook/addon-docs/blocks';
import { type Preview } from '@storybook/react';
import { theme } from '../../ui/src/theme';
import {
   RouterProvider,
   createMemoryHistory,
   createRootRoute,
   createRoute,
   createRouter,
   Outlet,
} from '@tanstack/react-router';
import React from 'react';

// Define the router context type
interface RouterContext {
   story: React.ComponentType<any>;
}

// Create a root route that renders the Outlet
const rootRoute = createRootRoute<RouterContext>({
   component: () => {
      return (
         <ChakraProvider theme={extendTheme(theme)}>
            <Outlet />
         </ChakraProvider>
      );
   },
});

// Create a dynamic route that renders the story from context
const storyRoute = createRoute({
   getParentRoute: () => rootRoute,
   path: '/',
   component: function StoryComponent() {
      const { story: Story } = storyRoute.useRouteContext();
      return <Story />;
   },
});

// Also add other routes for navigation testing
const settingsRoute = createRoute({
   getParentRoute: () => rootRoute,
   path: '/settings',
   component: function SettingsComponent() {
      const { story: Story } = settingsRoute.useRouteContext();
      return <Story />;
   },
});

const networkRoute = createRoute({
   getParentRoute: () => rootRoute,
   path: '/network',
   component: function NetworkComponent() {
      const { story: Story } = networkRoute.useRouteContext();
      return <Story />;
   },
});

const networkConfigRoute = createRoute({
   getParentRoute: () => rootRoute,
   path: '/network/config',
   component: function NetworkConfigComponent() {
      const { story: Story } = networkConfigRoute.useRouteContext();
      return <Story />;
   },
});

const resultsRoute = createRoute({
   getParentRoute: () => rootRoute,
   path: '/results',
   component: function ResultsComponent() {
      const { story: Story } = resultsRoute.useRouteContext();
      return <Story />;
   },
});

const historyRoute = createRoute({
   getParentRoute: () => rootRoute,
   path: '/history',
   component: function HistoryComponent() {
      const { story: Story } = historyRoute.useRouteContext();
      return <Story />;
   },
});

// Build the route tree
const routeTree = rootRoute.addChildren([
   storyRoute,
   settingsRoute,
   networkRoute,
   networkConfigRoute,
   resultsRoute,
   historyRoute,
]);

// Create memory history for Storybook
const memoryHistory = createMemoryHistory({
   initialEntries: ['/'],
});

// Global decorator that wraps all stories with RouterProvider
const withRouter = (Story: any) => {
   // Create the router instance with the story in context
   const router = createRouter({
      routeTree,
      history: memoryHistory,
      context: {
         story: Story,
      },
   });



   // Reset router to home on each story render
   React.useEffect(() => {
      router.navigate({ to: '/' });
   }, []);

   return <RouterProvider router={router} />;
};

const preview: Preview = {
   decorators: [withRouter],
   parameters: {
      controls: {
         disable: true,
      },
      docs: {
         page: () => (
            <>
               <Title />
               <Subtitle />
               <Description />
               <Primary />
               <Controls />
               <Stories title={'Examples'} />
            </>
         ),
      },
   },
   tags: ['autodocs'],
};

export default preview;