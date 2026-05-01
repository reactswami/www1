import federation from '@originjs/vite-plugin-federation';
import { nxCopyAssetsPlugin } from '@nx/vite/plugins/nx-copy-assets.plugin';
import { defineConfig } from 'vite';
import { generateViteConfig } from '../../../libraries/utils/src/viteConfig';

const globalViteConfig = generateViteConfig({
   packageName: 'discovery-main',
   htmlFileName: 'discovery-main',
});
const remotePlugin = federation({
   name: 'hostApp',
   remotes: {
      pingDiscover: '/oa-ping-manager/assets/remoteEntry.js',
   },
});
export default defineConfig({
   ...globalViteConfig,
   root: __dirname,
   plugins: globalViteConfig.plugins
      ? [
         ...globalViteConfig.plugins,
         nxCopyAssetsPlugin([{ input: 'src/assets/', output: '/assets', glob: '*.csv' }]),
         remotePlugin
      ]
      : [nxCopyAssetsPlugin([{ input: 'src/assets/', output: '/assets', glob: '*.csv' }]),
         remotePlugin
      ],
});
