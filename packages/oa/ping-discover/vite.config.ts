import path from 'path';
import federation from '@originjs/vite-plugin-federation';
import { defineConfig } from 'vite';
import { generateViteConfig } from '../../../libraries/utils/src/viteConfig';

const globalViteConfig = generateViteConfig({
   packageName: 'oa-ping-discover',
   htmlFileName: 'oa_ping_discover',
});

export default defineConfig({
   root: __dirname,
   ...globalViteConfig,
   plugins: [...(globalViteConfig?.plugins || []),
   federation({
      name: 'oaPingManager',
      filename: 'remotePingDiscover.js',
      exposes: {
         './RemoteApp': path.resolve(__dirname, 'src/RemoteApp.tsx'),
      },
      shared: [
         'react',
         'react-dom',
         '@tanstack/react-query',
         "@tanstack/react-table",
         '@chakra-ui/react',
         '@chakra-ui/anatomy',
         '@chakra-ui/icons',
         '@emotion/react',
         '@emotion/styled',
         '@radix-ui/react-icons',
         'react-select'
      ],
   })
   ],
   build: {
      ...globalViteConfig.build,
      modulePreload: false,
      target: 'esnext',
      minify: false,
      cssCodeSplit: false,
      rollupOptions: {
         output: {
            chunkFileNames: `oa-ping-discover/[name].[hash].js`,
            entryFileNames: `oa-ping-discover/[name].[hash].js`,
            assetFileNames: '[name].[hash][extname]',
         },
         external: [
            'react',
            'react-dom',
            '@chakra-ui/react',
            "@tanstack/react-table",
            '@tanstack/react-query',
            '@chakra-ui/anatomy',
            '@chakra-ui/icons',
            '@emotion/react',
            '@emotion/styled',
            '@radix-ui/react-icons'
         ],
      }
   },
});