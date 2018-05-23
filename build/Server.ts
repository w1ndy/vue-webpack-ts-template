// tslint:disable:match-default-export-name
import * as path from 'path'

import express, { Express, Handler } from 'express'

import bodyParser from 'body-parser'
import compression from 'compression'
import connectHistoryAPIFallback from 'connect-history-api-fallback'
import cookieSession from 'cookie-session'
import morgan from 'morgan'

import webpack, { compilation, Compiler } from 'webpack'
import webpackDevMiddleware, { WebpackDevMiddleware } from 'webpack-dev-middleware'
import webpackHotMiddleware, { EventStream } from 'webpack-hot-middleware'

import { AsyncSeriesHook } from 'tapable'

import { APPLICATION_CONFIGURATION, HOST, PORT, URI } from '../config/ApplicationConfiguration'
import { developmentWebpackConfiguration } from '../config/webpack/DevelopmentWebpackConfiguration'

import { serverRouter } from '../src/server'

const app: Express = ((): Express => {
  const expressApp: Express = express()
  if (!!APPLICATION_CONFIGURATION.server.logStyle) {
    expressApp.use(morgan(APPLICATION_CONFIGURATION.server.logStyle))
  }
  expressApp.use(compression())
  expressApp.use(bodyParser.json({ limit: '20mb' }));
  expressApp.use(bodyParser.urlencoded({ limit: '20mb', extended: true }))
  expressApp.use(cookieSession({
    name: 'session',
    secret: APPLICATION_CONFIGURATION.server.session.secret,
    maxAge: APPLICATION_CONFIGURATION.server.session.maxAge
  }))
  expressApp.use('/api', serverRouter)
  expressApp.use(connectHistoryAPIFallback())

  return expressApp
})()

if (process.env.NODE_ENV !== 'production') {
  ((): void => {
    const compiler: Compiler = webpack(developmentWebpackConfiguration)
    const publicPath: string = !!developmentWebpackConfiguration.output
      ? (!!developmentWebpackConfiguration.output.publicPath
        ? developmentWebpackConfiguration.output.publicPath
        : '/')
      : '/'

    const devMiddleware: WebpackDevMiddleware & Handler = webpackDevMiddleware(compiler, {
      publicPath,
      logLevel: 'silent'
    })
    const hotMiddleware: EventStream & Handler = webpackHotMiddleware(compiler, {
      log: false,
      heartbeat: 2000
    })

    // force page reload when html-webpack-plugin template changes
    compiler.hooks.compilation.tap(
      'webpackReloadAfterTemplateChanged',
      (compInst: compilation.Compilation) => {
        // tslint:disable-next-line:no-any no-unsafe-any
        (<AsyncSeriesHook<any, () => void>>(<any>compInst.hooks).htmlWebpackPluginAfterEmit)
        .tapAsync(
          'reloadAfterTemplateChanged',
          // tslint:disable-next-line:no-any no-unsafe-any
          (data: any, cb: () => void) => {
            console.log('Reloading html template...')
            hotMiddleware.publish({ action: 'reload' })
            cb()
          }
        )
      }
    )

    // serve webpack bundle output
    app.use(devMiddleware)
    app.use(hotMiddleware)

    console.log('> Starting dev server...')

    devMiddleware.waitUntilValid(() => {
      if (!!process.env.SERVE_TEST) {
        console.log(' > Serve-test completed successfully.')
        process.exit(0)
      }
    })
  })()

  // serve pure static assets
  const staticPath: string = path.posix.join(
    APPLICATION_CONFIGURATION.dev.assetsPublicPath,
    APPLICATION_CONFIGURATION.dev.assetsSubDirectory)
  app.use(staticPath, express.static('./static'))
} else {
  app.use('/', express.static('./dist'))
  console.log('> Starting prod server...')
  console.log(`> Listening at ${URI}\n`)
}

app.listen(PORT, HOST)
