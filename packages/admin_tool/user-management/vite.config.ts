import { defineConfig } from 'vite';
import { generateViteConfig } from '../../../libraries/utils/src/viteConfig';

const globalViteConfig = generateViteConfig({
   packageName: 'user-management',
   htmlFileName: 'user-management',
});

export default defineConfig({
   root: __dirname,
   ...globalViteConfig,
});

// export default defineConfig({
//    root: __dirname,
//    ...globalViteConfig,
//    server: {
//       proxy: {
//          '/cgi': {
//             target: 'https://10.2.19.2',
//             changeOrigin: true,   // rewrite Host header for upstream
//             secure: false,        // allow self-signed TLS (not used for http, but safe to keep if you switch to https)
//             configure: (proxy /*, options*/) => {
//                proxy.on('proxyReq', (proxyReq, req /*, res*/) => {
//                   proxyReq.setHeader(
//                      'Cookie',
//                      'X-ss-authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3Njk1ODUzOTUsImlhdCI6MTc2OTU3NTM5NSwibmJmIjoxNzY5NTc1Mzk1LCJ1c2VyIjoiYWRtaW4ifQ.BpsIQyTKXqEcvnCRn6_pFVT9VjpAeWaRe5CQGcERg0s'
//                   )
//                })
//             },
//          },
//       },
//    },
// })
