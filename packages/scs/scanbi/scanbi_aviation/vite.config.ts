import { defineConfig } from 'vite';
import { generateViteConfig } from '../../../../libraries/utils/src/viteConfig';

const globalConfig = generateViteConfig({
   packageName: 'scanbi-aviation',
   htmlFileName: 'scanbi_aviation',
   customOutDir: 'scs/scanbi_aviation/'
});

export default defineConfig(({ mode }) => ({
      ...globalConfig,
      root: __dirname,
      base: mode === "production" ? '/scs/scanbi_aviation/' : '/',
      test: {
         ...globalConfig.test,
         coverage: {
            ...globalConfig.test?.coverage,
            reportsDirectory: `../../../../coverage/packages/scs/scanbi_aviation`
         }
      },
      build: {
         ...globalConfig.build,
         rollupOptions: {
            ...globalConfig.build?.rollupOptions,
            output: {
               ...globalConfig.build?.rollupOptions?.output,
               chunkFileNames: `js/scanbi_[name].[hash].js`,
               entryFileNames: `js/scanbi_[name].[hash].js`,
               assetFileNames: () => {
                  return 'scanbi_[name]-[hash][extname]'; // CSS files go to the root
               },
            }
         }
      }
   })
);