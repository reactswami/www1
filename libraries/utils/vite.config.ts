/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { generateViteLibraryConfig } from './src/viteConfig';

const globalViteConfig = generateViteLibraryConfig({
   libraryName: 'utils'
});

export default defineConfig({
   root: __dirname,
   ...globalViteConfig
});
