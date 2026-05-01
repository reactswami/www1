import { defineConfig } from 'vite';
import { generateViteConfig } from '../../../libraries/utils/src/viteConfig';

const globalViteConfig = generateViteConfig({
   packageName: 'license_upgrade',
   htmlFileName: 'license_upgrade',
});

globalViteConfig.build!.rollupOptions!.output!.assetFileNames = 'license_upgrade/[name]-[hash][extname]';
delete globalViteConfig.build!.rollupOptions!.output!.manualChunks.lodash;
delete globalViteConfig.build!.rollupOptions!.output!.manualChunks.agGrid;

export default defineConfig({
   root: __dirname,
   ...globalViteConfig,
});
