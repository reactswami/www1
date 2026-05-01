import { defineConfig } from 'vite';
import { generateViteConfig } from '../../../libraries/utils/src/viteConfig';

const globalViteConfig = generateViteConfig({
   packageName: 'oa-nim-console-assign-pollers',
   htmlFileName: 'oa_nim_assign_pollers',
});

export default defineConfig({
   root: __dirname,
   ...globalViteConfig
});