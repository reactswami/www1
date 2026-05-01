import { defineConfig } from 'vite';
import { generateViteConfig } from '../../../libraries/utils/src/viteConfig';

const globalViteConfig = generateViteConfig({
   packageName: 'oa-ping-manager',
   htmlFileName: 'oa_ping_manager',
});

export default defineConfig({
   root: __dirname,
   ...globalViteConfig
});