import * as path from 'path'

import { Options } from 'webpack'

interface IApplicationConfiguration {
  server: {
    logStyle?: string,
    session: {
      secret: string,
      maxAge: number
    }
  },
  dev: {
    // Paths
    assetsSubDirectory: string,
    assetsPublicPath: string,

    // Various Dev Server settings
    host: string, // can be overwritten by process.env.HOST
    port: number, // can be overwritten by process.env.PORT
    errorOverlay: boolean,
    notifyOnErrors: boolean,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: Options.Devtool,

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: boolean,

    cssSourceMap: true
  },
  build: {
    // Template for index.html
    index: string,

    // Paths
    assetsRoot: string,
    assetsSubDirectory: string,
    assetsPublicPath: string,

    /**
     * Source Maps
     */

    productionSourceMap: boolean,

    // https://webpack.js.org/configuration/devtool/#production
    devtool: Options.Devtool,

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: boolean
  }
}

const appConfig: IApplicationConfiguration = {
  server: {
    logStyle: 'dev',
    session: {
      secret: 'wowsuchsecret',
      maxAge: 60 * 60 * 1000,
    }
  },
  dev: {
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    host: 'localhost',
    port: 8080,
    errorOverlay: true,
    notifyOnErrors: true,
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    cssSourceMap: true
  },
  build: {
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    devtool: '#source-map',
    bundleAnalyzerReport: !!process.env.ANALYZE_BUNDLE
  }
}

export const Host = process.env.HOST || appConfig.dev.host
export const Port: number = process.env.PORT
  ? parseInt(process.env.PORT)
  : appConfig.dev.port
export const URI = `http://${Host}:${Port}`

export default appConfig
