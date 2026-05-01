/// <reference types='vitest' />
import path from 'path';
import { workspaceRoot } from '@nx/devkit';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

type DefaultConfigOptions = {
   packageName: string;
   customOutDir?: string;
   htmlFileName?: string;
};

/**
 *
 * @param segments The path segments to join
 * @returns This will return a path from the workspace root which is currently www
 */
function fromWorkSpaceRoot(...segments: string[]) {
   return path.join(workspaceRoot, ...segments);
}

export function generateViteConfig(options: DefaultConfigOptions) {
   const plugins = [tsconfigPaths(), react()];

   if (options.htmlFileName) {
      plugins.push({
         name: 'renameIndex',
         enforce: 'post',
         generateBundle(_, bundle) {
            const indexHtml = bundle['index.html'];
            if (indexHtml) {
               indexHtml.fileName = `${options.htmlFileName}.html`;
            }
         },
      });
   }

   return defineConfig({
      test: {
         watch: false,
         setupFiles: [fromWorkSpaceRoot('vitest.setup.ts'), 'src/test/test-setup.ts'],
         passWithNoTests: true,
         globals: true,
         environment: 'jsdom',
         include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
         reporters: ['default'],
         coverage: {
            enabled: true,
            reportsDirectory: options.customOutDir
               ? fromWorkSpaceRoot('coverage/packages', options.customOutDir)
               : fromWorkSpaceRoot('coverage/packages', options.packageName),
            provider: 'v8',
            reporter: ['html', 'cobertura'],
         },
         cacheDir: fromWorkSpaceRoot('node_modules/.vitest', options.packageName),
      },
      cacheDir: fromWorkSpaceRoot('node_modules/.vite', options.packageName),
      server: {
         port: 4200,
         host: 'localhost',
         open: true,
      },
      build: {
         outDir: fromWorkSpaceRoot('dist/packages', options.customOutDir ?? options.packageName),
         emptyOutDir: true,
         reportCompressedSize: true,
         commonjsOptions: {
            transformMixedEsModules: true,
         },
         rollupOptions: {
            output: {
               manualChunks: {
                  vendor: ['react', 'react-dom', 'react-router-dom'],
                  lodash: ['lodash'],
                  agGrid: ['ag-grid-community', 'ag-grid-react'],
                  tanstack: [
                     '@tanstack/react-query',
                     '@tanstack/react-router',
                     '@tanstack/react-table',
                  ],
                  chakra: ['@chakra-ui/anatomy', '@chakra-ui/react', '@chakra-ui/icons'],
               },
               chunkFileNames: `${options.packageName}/[name].[hash].js`,
               entryFileNames: `${options.packageName}/[name].[hash].js`,
               assetFileNames: '[name]-[hash][extname]',
            },
         },
      },
      plugins,
   });
}

type LibraryConfigOptions = {
   libraryName: string;
};

export function generateViteLibraryConfig(options: LibraryConfigOptions) {
   return defineConfig({
      cacheDir: fromWorkSpaceRoot('node_modules/.vite/libraries', options.libraryName),
      test: {
         watch: false,
         setupFiles: [fromWorkSpaceRoot('vitest.setup.ts')],
         globals: true,
         environment: 'jsdom',
         include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
         reporters: ['default'],
         coverage: {
            enabled: true,
            reportsDirectory: fromWorkSpaceRoot('coverage/libraries', options.libraryName),
            provider: 'v8',
            reporter: ['html', 'cobertura'],
         },
         passWithNoTests: true,
         cacheDir: fromWorkSpaceRoot('node_modules/.vitest/libraries', options.libraryName),
      },
      plugins: [tsconfigPaths()],
   });
}
