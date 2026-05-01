import { defineConfig } from 'vite';
import { generateViteConfig } from '../../../libraries/utils/src/viteConfig';

const globalViteConfig = generateViteConfig({
   packageName: 'admin_tool-license_management',
   htmlFileName: 'admin_tool-license_management',
});

export default defineConfig({
   root: __dirname,
   ...globalViteConfig,
});
