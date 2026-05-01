import { defineConfig } from 'vite';
import { generateViteConfig } from '../../../libraries/utils/src/viteConfig';

const globalViteConfig = generateViteConfig({
   packageName: 'nim-edit-snmp-creds',
   htmlFileName: 'nim-edit-snmp-creds',
});

export default defineConfig({
   root: __dirname,
   ...globalViteConfig,
   build: {
      ...globalViteConfig.build,
      outDir: '../../../dist/packages/nim/edit-snmp-creds',
   }
});
