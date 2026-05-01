import federation from '@originjs/vite-plugin-federation';
import { defineConfig } from 'vite';
import { generateViteConfig } from '../../../libraries/utils/src/viteConfig';

const globalViteConfig = generateViteConfig({
   packageName: 'discovery-devices',
   htmlFileName: 'discovery-devices',
});

export default defineConfig({
   ...globalViteConfig,
   root: __dirname,
   plugins: [
      ...globalViteConfig.plugins || [],
      federation({
         name: 'hostApp',
         remotes: {
            oaManager: '/oa-manager/assets/remoteEntry.js',
         },
         // Simplified shared config for @originjs/vite-plugin-federation
      })
   ],
});
