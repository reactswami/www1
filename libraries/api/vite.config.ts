/// <reference types='vitest' />
import { defineConfig } from 'vite';
import { generateViteLibraryConfig } from '../../libraries/utils/src/viteConfig';

const globalViteConfig = generateViteLibraryConfig({
   libraryName: 'api'
});


export default defineConfig({
   root: __dirname,
   ...globalViteConfig
});
