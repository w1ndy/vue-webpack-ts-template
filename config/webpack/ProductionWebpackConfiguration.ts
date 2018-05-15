import * as path from 'path'

import webpack from 'webpack'
import merge from 'webpack-merge'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCSSExtractPlugin from 'mini-css-extract-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import UglifyJsPlugin from 'uglifyjs-webpack-plugin'
import BundleAnalyzer from 'webpack-bundle-analyzer'

import config from '../ApplicationConfiguration'
import baseWebpackConfig, { resolveAssetsPath } from './BaseWebpackConfiguration'
import prodEnv from '../env/ProductionEnvironment'
import generateStyleLoaders from './StyleLoadersGenerator'

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: generateStyleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true
    })
  },
  devtool: config.build.devtool,
  output: {
    path: config.build.assetsRoot,
    filename: resolveAssetsPath('js/[name].[chunkhash].js'),
    chunkFilename: resolveAssetsPath('js/[id].[chunkhash].js')
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false
          }
        },
        sourceMap: config.build.productionSourceMap,
        parallel: true
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: config.build.productionSourceMap
          ? { safe: true, map: { inline: false } }
          : { safe: true }
      }),
    ]
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': prodEnv
    }),

    // extract css into its own file
    new MiniCSSExtractPlugin({
      filename: resolveAssetsPath('css/[name].[contenthash].css')
    }),

    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
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
        to: config.build.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
})

if (config.build.bundleAnalyzerReport) {
  const BundleAnalyzerPlugin = BundleAnalyzer.BundleAnalyzerPlugin
  if (webpackConfig && webpackConfig.plugins) {
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
  }
}

export default webpackConfig
