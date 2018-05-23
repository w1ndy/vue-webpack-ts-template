// 'use strict'
// const utils = require('./utils')
import * as path from 'path'

import nodeNotifier from 'node-notifier'
import webpack, { Configuration } from 'webpack'
import webpackMerge from 'webpack-merge'

import copyWebpackPlugin from 'copy-webpack-plugin'
import FriendlyErrorsWebpackPlugin, { Severity, WebpackError } from 'friendly-errors-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

import { APPLICATION_CONFIGURATION, URI } from '../ApplicationConfiguration'
import { DEVELOPMENT_ENVIRONMENT } from '../env/DevelopmentEnvironment'

import { baseWebpackConfiguration } from './BaseWebpackConfiguration'
import { generateStyleLoaders } from './StyleLoadersGenerator'

function createNotifierCallback(): (severity: Severity, errors: string) => void {
  return (severity: Severity, errors: string): void => {
    if (severity !== 'error') {
      return
    }

    // tslint:disable-next-line:no-any
    const error: WebpackError = (<any>errors[0])
    const filename: string | undefined = error.file && error.file.split('!').pop()

    const COLOR_CODES_REGEX: RegExp = /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g
    const cleanMessage: string = error.message.replace(COLOR_CODES_REGEX, '')
    const match: RegExpMatchArray | null = cleanMessage.match(/^\s+(.*)$/m)
    const message: string = match ? match[1] : cleanMessage

    const severityTitle: string = severity.toString()[0].toUpperCase() + severity.toString().slice(1)
    const filenameTitle: string = filename ? ` @ ${filename.replace(path.resolve('.'), '')}` : ''
    const title: string = `${severityTitle}${filenameTitle}`

    nodeNotifier.notify({
      title,
      message,
      icon: path.join(__dirname, '../logo.png')
    })
  }
}

// tslint:disable-next-line:export-name
export const developmentWebpackConfiguration: Configuration = webpackMerge(baseWebpackConfiguration, {
  module: {
    rules: generateStyleLoaders({
      sourceMap: APPLICATION_CONFIGURATION.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  entry: {
    app: ['./build/client-polyfill.js', './src/main.ts']
  },
  // cheap-module-eval-source-map is faster for development
  devtool: APPLICATION_CONFIGURATION.dev.devtool,

  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': DEVELOPMENT_ENVIRONMENT
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new copyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../../static'),
        to: APPLICATION_CONFIGURATION.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    new FriendlyErrorsWebpackPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: ${URI}`],
        notes: []
      },
      onErrors: APPLICATION_CONFIGURATION.dev.notifyOnErrors
        ? createNotifierCallback()
        : undefined
    })
  ]
})
