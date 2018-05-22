import * as path from 'path'

import webpack, { Configuration } from 'webpack'
import webpackMerge from 'webpack-merge'

import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCssAssetsWebpackPlugin from 'optimize-css-assets-webpack-plugin'
import UglifyJsWebpackPlugin from 'uglifyjs-webpack-plugin'
import webpackBundleAnalyzer, { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

import { APPLICATION_CONFIGURATION } from '../ApplicationConfiguration'
import { PRODUCTION_ENVIRONMENT } from '../env/ProductionEnvironment'

import { baseWebpackConfiguration, resolveAssetsPath } from './BaseWebpackConfiguration'
import { generateStyleLoaders } from './StyleLoadersGenerator'

// tslint:disable-next-line:export-name
export const productionWebpackConfiguration: Configuration = webpackMerge(baseWebpackConfiguration, {
  mode: 'production',
  module: {
    rules: generateStyleLoaders({
      sourceMap: APPLICATION_CONFIGURATION.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: APPLICATION_CONFIGURATION.build.devtool,
  output: {
    path: APPLICATION_CONFIGURATION.build.assetsRoot,
    filename: resolveAssetsPath('js/[name].[chunkhash].js'),
    chunkFilename: resolveAssetsPath('js/[id].[chunkhash].js')
  },
  optimization: {
    minimizer: [
      new UglifyJsWebpackPlugin({
        uglifyOptions: {
          compress: {
            warnings: false
          }
        },
        sourceMap: APPLICATION_CONFIGURATION.build.productionSourceMap,
        parallel: true
      }),
      new OptimizeCssAssetsWebpackPlugin({
        cssProcessorOptions: APPLICATION_CONFIGURATION.build.productionSourceMap
          ? { safe: true, map: { inline: false } }
          : { safe: true }
      })
    ]
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': PRODUCTION_ENVIRONMENT
    }),

    // extract css into its own file
    new MiniCssExtractPlugin({
      filename: resolveAssetsPath('css/[name].[contenthash].css')
    }),

    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: APPLICATION_CONFIGURATION.build.index,
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'dependency'
    }),

    // keep module.id stable when vendor modules does not change
    new webpack.HashedModuleIdsPlugin(),

    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../../static'),
        to: APPLICATION_CONFIGURATION.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (APPLICATION_CONFIGURATION.build.bundleAnalyzerReport) {
  if (productionWebpackConfiguration && productionWebpackConfiguration.plugins) {
    productionWebpackConfiguration.plugins.push(new (webpackBundleAnalyzer.BundleAnalyzerPlugin)())
  }
}
