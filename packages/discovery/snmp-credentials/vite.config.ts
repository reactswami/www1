import { defineConfig } from 'vite';
import { generateViteConfig } from '../../../libraries/utils/src/viteConfig';

const globalViteConfig = generateViteConfig({
   packageName: 'discovery-snmp-credentials',
   htmlFileName: 'discovery-snmp-credentials',
});

export default defineConfig({
   ...globalViteConfig,
   root: __dirname,
});
