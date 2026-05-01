import { defineConfig } from 'vite';
import { generateViteConfig } from '<%= offsetFromRoot %>libraries/utils/src/viteConfig';

const globalViteConfig = generateViteConfig({
   packageName: '<%= projectName %>',
   htmlFileName: '<%= projectName %>',
});

export default defineConfig({
   root: __dirname,
   ...globalViteConfig,
});
