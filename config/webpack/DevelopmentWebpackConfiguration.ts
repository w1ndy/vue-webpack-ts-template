// 'use strict'
// const utils = require('./utils')
import * as path from 'path'

import portfinder from 'portfinder'
import notifier from 'node-notifier'
import webpack from 'webpack'
import merge from 'webpack-merge'

import CopyWebpackPlugin from 'copy-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import FriendlyErrorsPlugin, { Severity, WebpackError } from 'friendly-errors-webpack-plugin'

import config, { URI } from '../ApplicationConfiguration'
import baseWebpackConfig from './BaseWebpackConfiguration'
import generateStyleLoaders from './StyleLoadersGenerator'
import devEnv from '../env/DevelopmentEnvironment'

// const webpack = require('webpack')
// const config = require('../config')
// const merge = require('webpack-merge')
// const path = require('path')
// const baseWebpackConfig = require('./webpack.base.conf')
// const CopyWebpackPlugin = require('copy-webpack-plugin')
// const HtmlWebpackPlugin = require('html-webpack-plugin')
// const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
// const portfinder = require('portfinder')

function createNotifierCallback() {
  return (severity: Severity, errors: string) => {
    if (severity !== 'error') return

    const error = (<any>errors[0] as WebpackError)
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: filename || '',
      message: severity + ': ' + error.name,
      icon: path.join(__dirname, '../logo.png')
    })
  }
}

const webpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: generateStyleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  entry: {
    app: ['webpack-hot-middleware/client?noInfo=true&reload=true', './src/main.ts']
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': devEnv
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
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ]),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [`Your application is running here: ${URI}`],
        notes: []
      },
      onErrors: config.dev.notifyOnErrors
        ? createNotifierCallback()
        : undefined
    })
  ]
})

export default webpackConfig
