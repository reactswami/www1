/// <reference types='vitest' />
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
   root: __dirname,
   cacheDir: '../../../node_modules/.vite/libraries/tooling/nx',
   plugins: [tsconfigPaths()],
   test: {
      watch: false,
      globals: true,
      environment: 'jsdom',
      include: [ "**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)" ],
      reporters: ['default'],
      coverage: {
         enabled: true,
         reportsDirectory: '../../../coverage/libraries/tooling/nx',
         provider: 'v8',
      },
      cache: {
         dir:  '../../../node_modules/.vitest/libraries/tooling/nx',
      },
      exclude: ['src/generators'], //we want to exclude generators because they have files that aren't in there normal format until generated
      passWithNoTests: true
   },
});
