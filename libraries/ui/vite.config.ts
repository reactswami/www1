/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { generateViteLibraryConfig } from '../utils/src/viteConfig';

const globalViteConfig = generateViteLibraryConfig({
   libraryName: 'ui'
});

export default defineConfig({
   root: __dirname,
   ...globalViteConfig
});
