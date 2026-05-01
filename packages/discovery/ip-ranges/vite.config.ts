import { defineConfig } from 'vite';
import { generateViteConfig } from '../../../libraries/utils/src/viteConfig';

const globalViteConfig = generateViteConfig({
   packageName: 'discovery-ip-ranges',
   htmlFileName: 'discovery-ip-ranges',
});

export default defineConfig({
   ...globalViteConfig,
   root: __dirname,
});
