import { defineConfig } from 'vite';
import { generateViteConfig } from '../../../libraries/utils/src/viteConfig';

const globalViteConfig = generateViteConfig({
   packageName: 'oa-image-downloader',
   htmlFileName: 'oa_image_downloader'
});

export default defineConfig({
   root: __dirname,
   ...globalViteConfig
});
