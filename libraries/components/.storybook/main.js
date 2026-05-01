/** @type { import('@storybook/react-vite').StorybookConfig } */

const config = {
   stories: ['../src/**/*.@(mdx|stories.@(js|jsx|ts|tsx))'],
   addons: ['@storybook/addon-docs'],
   framework: {
      name: '@storybook/react-vite',
      options: {
         builder: {
            viteConfigPath: 'vite.config.ts',
         },
      },
   },
   refs: {
      '@chakra-ui/react': {
         disable: true,
      },
   },
};

module.exports = config;

// To customize your Vite configuration you can use the viteFinal field.
// Check https://storybook.js.org/docs/react/builders/vite#configuration
// and https://nx.dev/recipes/storybook/custom-builder-configs
