const { IgnorePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const path = require('path');

export function generateWebpackConfig(nxConfig, { packageName, htmlFilename, publicPath }) {
   const config = {
      ...nxConfig,
      devServer: {
         ...nxConfig.devServer,
         static: {
            ...nxConfig.devServer?.static,
            directory: path.join(__dirname, 'public'),
         },
      },
      output: {
         ...nxConfig.output,
         filename: `${packageName}/[name].[contenthash].js`,
         chunkFilename: `${packageName}/[name].[contenthash].js`,
         publicPath,
      },
      resolve: {
         ...nxConfig.resolve,
         fallback: {
            ...nxConfig.resolve.fallback,
            // These below are only used to avoid errors when running msw in the browser.
            timers: false,
            http: false,
            https: false,
            zlib: false,
            stream: false,
         },
      },
      optimization: {
         splitChunks: {
            cacheGroups: {
               // React bundle
               reactVendor: {
                  test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|react-icons)[\\/]/,
                  name: 'vendor-react',
                  chunks: 'all',
               },
               // Chakra Bundle
               chakraVendor: {
                  test: /[\\/]node_modules[\\/]@chakra-ui.*/,
                  name: 'vendor-chakra',
                  chunks: 'all',
               },
               // Tanstack (react-table, react query)
               tanstack: {
                  test: /[\\/]node_modules[\\/]@tanstack.*/,
                  name: 'vendor-tanstack',
                  chunks: 'all',
               },
               // AG Grid (ag-grid)
               agGrid: {
                  test: /[\\/]node_modules[\\/].*ag-grid.*/,
                  name: 'vendor-ag-grid',
                  chunks: 'all',
               },
               // Statseeker's libraries
               statseekerLibrary: {
                  test: /[\\/]node_modules[\\/]libraries.*/,
                  name: 'statseeker-libraries',
                  chunks: 'all',
               },
               // Other vendors
               commons: {
                  test: /[\\/]node_modules[\\/]/,
                  name(module, chunks, cacheGroupKey) {
                     const moduleFileName = module
                        .identifier()
                        .split('/')
                        .reduceRight((item) => item);
                     const allChunksNames = chunks.map((item) => item.name).join('~');
                     return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
                  },
                  chunks: 'all',
               },
            },
         },
      },
      plugins: [
         ...nxConfig.plugins,
         new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: `${htmlFilename}.html`,
         }),
         // new BundleAnalyzerPlugin({generateStatsFile: true,analyzerMode: 'static'})
      ],
   };

   if (process.env.NODE_ENV === 'production') {
      /* if we're in production, ignore faker and msw (mock server related modules) */
      config.plugins.push(new IgnorePlugin({ resourceRegExp: /./, contextRegExp: /faker|msw/ }));
   }

   return config;
}
