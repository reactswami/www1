import path from 'path';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig(() => {
   return {
      root: __dirname,
      cacheDir: '../../node_modules/.vite/packages/globalsearch',
      server: {
         port: 4200,
         host: 'localhost',
      },
      preview: {
         port: 4300,
         host: 'localhost',
      },
      test: {
         globals: true,
         environment: 'jsdom',
         setupFiles: ['./src/test/test-setup.ts'],
         css: false, // disable CSS processing in tests for better performance
         deps: {
            inline: ['@chakra-ui/react', '@statseeker/components', '@statseeker/hooks'],
         },
      },
      plugins: [react(), nxViteTsPaths(), nxCopyAssetsPlugin(['*.md'])],
      build: {
         outDir: '../../dist/packages/globalsearch',
         emptyOutDir: true,
         reportCompressedSize: true,
         commonjsOptions: {
            transformMixedEsModules: true,
         },
         rollupOptions: {
            input: {
               globalsearch: path.resolve(__dirname, 'src/main.tsx'),
            },
            output: {
               entryFileNames: 'js/[name].js',
               assetFileNames: 'css/[name].[ext]',
            },
         },
      },
   };
});
