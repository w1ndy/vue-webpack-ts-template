import * as path from 'path'

import { Configuration } from 'webpack'
import { VueLoaderPlugin } from 'vue-loader/lib'
import MiniCSSExtractPlugin from 'mini-css-extract-plugin'

import config from '../ApplicationConfiguration'
import generateStyleLoaders from './StyleLoadersGenerator'
import generateCSSLoaders from './CSSLoadersGenerator'

// const path = require('path')
// const utils = require('./utils')
// const config = require('../config')
// const vueLoaderConfig = require('./vue-loader.conf')

export function resolve (dir: string) {
  return path.join(__dirname, '../..', dir)
}
export function resolveAssetsPath (_path: string) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}
export function normalizeNodeEnv (): 'production' | 'development' | 'none' {
  switch (process.env.NODE_ENV) {
    case 'production': return 'production'
    case 'development': return 'development'
    default: return 'none'
  }
}

const isProduction = process.env.NODE_ENV === 'production'
const sourceMapEnabled = isProduction
  ? config.build.productionSourceMap
  : config.dev.cssSourceMap

const baseConfig: Configuration = {
  mode: normalizeNodeEnv(),
  context: path.resolve(__dirname, '../../'),
  entry: {
    app: './src/main.ts'
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src'),
    }
  },
  devServer: {
    historyApiFallback: true
  },
  module: {
    rules: [
      ...generateStyleLoaders({
        sourceMap: sourceMapEnabled,
        extract: isProduction
      }),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          cssSourceMap: sourceMapEnabled,
          cacheBusting: config.dev.cacheBusting,
          transformToRequire: {
            video: ['src', 'poster'],
            source: 'src',
            img: 'src',
            image: 'xlink:href'
          }
        }
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [
          resolve('src'),
          resolve('test'),
          resolve('node_modules/webpack-dev-server/client')
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: resolveAssetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: resolveAssetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: resolveAssetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}

export default baseConfig
