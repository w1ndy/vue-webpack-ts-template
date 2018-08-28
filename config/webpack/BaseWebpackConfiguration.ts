import * as path from 'path'

import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import { VueLoaderPlugin } from 'vue-loader/lib'
import { Configuration } from 'webpack'

import { APPLICATION_CONFIGURATION } from '../ApplicationConfiguration'
import { generateCSSLoaders } from './CSSLoadersGenerator'
import { generateStyleLoaders } from './StyleLoadersGenerator'

export function resolve(dir: string): string {
  return path.join(__dirname, '../..', dir)
}

export function resolveAssetsPath (assetPath: string): string {
  const assetsSubDirectory: string = process.env.NODE_ENV === 'production'
    ? APPLICATION_CONFIGURATION.build.assetsSubDirectory
    : APPLICATION_CONFIGURATION.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, assetPath)
}

export function normalizeNodeEnv (): 'production' | 'development' | 'none' {
  switch (process.env.NODE_ENV) {
    case 'production': return 'production'
    case 'development': return 'development'
    default: return 'none'
  }
}

const isProduction: boolean = process.env.NODE_ENV === 'production'
const sourceMapEnabled: boolean = isProduction
  ? APPLICATION_CONFIGURATION.build.productionSourceMap
  : APPLICATION_CONFIGURATION.dev.cssSourceMap

export const baseWebpackConfiguration: Configuration = {
  mode: normalizeNodeEnv(),
  context: path.resolve(__dirname, '../../'),
  entry: {
    app: './src/main.ts'
  },
  output: {
    path: APPLICATION_CONFIGURATION.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? APPLICATION_CONFIGURATION.build.assetsPublicPath
      : APPLICATION_CONFIGURATION.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  devServer: {
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          cssSourceMap: sourceMapEnabled,
          cacheBusting: APPLICATION_CONFIGURATION.dev.cacheBusting,
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
          transpileOnly: true
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
    new VueLoaderPlugin(),
    new ForkTsCheckerWebpackPlugin({
      async: false,
      tslint: true,
      vue: true
    })
  ]
}
