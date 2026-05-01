import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import { generateViteConfig } from '../../../libraries/utils/src/viteConfig';

const globalViteConfig = generateViteConfig({
   packageName: 'nim-alerting-libraries',
});

export default defineConfig({
   root: __dirname,
  ...globalViteConfig,
   plugins: [tsconfigPaths()],
   build: {
      ...globalViteConfig.build,
      outDir: '../../../dist/packages/nim/alerting-libraries',
      rollupOptions: {
         input: './packages/nim/alerting-libraries/src/app/tinymce.js',
         output: {
            entryFileNames: 'js/tinymce/[name].js',
            assetFileNames: 'tinymce/[name][extname]',
            chunkFileNames: 'js/tinymce/[name]-chunk.js',
         },
      },
      cssCodeSplit: true,
      minify: 'esbuild', // Use esbuild for CSS and JS minimization
   },
});
