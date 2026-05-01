import { defineConfig } from 'vite';
import { generateViteConfig } from '../../../libraries/utils/src/viteConfig';

const globalViteConfig = generateViteConfig({
   packageName: 'scs-meraki-polller',
   customOutDir: '/scs/meraki-poller/'
});

export default defineConfig(({ mode }) => {
   return {
      ...globalViteConfig,
      root: __dirname,
      base: mode === "production" ? '/scs/meraki/' : '/',
      build: {
         ...globalViteConfig.build,
         rollupOptions: {
            ...globalViteConfig.build?.rollupOptions,
            output: {
               ...globalViteConfig.build?.rollupOptions?.output,
               chunkFileNames: `js/meraki_[name].[hash].js`,
               entryFileNames: `js/meraki_[name].[hash].js`,
               assetFileNames: () => {
                  return 'meraki_[name]-[hash][extname]'; // CSS files go to the root
               },
            }
         }
      }
   };
});
