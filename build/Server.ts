import * as path from 'path'

import express from 'express'
import bodyParser from 'body-parser'
import compression from 'compression'
import morgan from 'morgan'
import cookieSession from 'cookie-session'
import connectHistoryAPIFallback from 'connect-history-api-fallback'

import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import config, { Host, Port, URI } from '../config/ApplicationConfiguration'
import webpackConfig from '../config/webpack/DevelopmentWebpackConfiguration'
import APIServer from '../src/server'

const app = (function initializeExpress () {
  const app = express()
  if (config.server.logStyle) {
    app.use(morgan(config.server.logStyle))
  }
  app.use(compression())
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }))
  app.use(cookieSession({
    name: 'session',
    secret: config.server.session.secret,
    maxAge: config.server.session.maxAge
  }))
  app.use('/api', APIServer)
  app.use(connectHistoryAPIFallback())
  return app
})()

if (process.env.NODE_ENV !== 'production') {
  (function initializeWebpack() {
    const compiler = webpack(webpackConfig)
    const publicPath =
      (webpackConfig.output && webpackConfig.output.publicPath) ||
      '/'

    const devMiddleware = webpackDevMiddleware(compiler, {
      publicPath,
      logLevel: 'silent'
    })
    const hotMiddleware = webpackHotMiddleware(compiler, {
      log: false,
      heartbeat: 2000
    })

    // force page reload when html-webpack-plugin template changes
    compiler.plugin('compilation', (compilation: webpack.Compiler) => {
      compilation.plugin('html-webpack-plugin-after-emit',
        (data: any, cb: () => void) => {
          hotMiddleware.publish({ action: 'reload' })
          cb()
        })
    })

    // serve webpack bundle output
    app.use(devMiddleware)
    app.use(hotMiddleware)

    console.log('> Starting dev server...')
  })()

  // serve pure static assets
  const staticPath = path.posix.join(
    config.dev.assetsPublicPath,
    config.dev.assetsSubDirectory)
  app.use(staticPath, express.static('./static'))
} else {
  app.use('/', express.static('./dist'))
  console.log('> Starting prod server...')
  console.log('> Listening at ' + URI + '\n')
}

app.listen(Port, Host)


// const api = require('../src/server')
// app.use('/api', api)


// if (process.env.NODE_ENV !== 'production') {
//   var devMiddleware = require('webpack-dev-middleware')(compiler, {
//     publicPath: webpackConfig.output.publicPath,
//     quiet: true
//   })

//   var hotMiddleware = require('webpack-hot-middleware')(compiler, {
//     log: false,
//     heartbeat: 2000
//   })
//   // force page reload when html-webpack-plugin template changes
//   compiler.plugin('compilation', function (compilation) {
//     compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
//       hotMiddleware.publish({ action: 'reload' })
//       cb()
//     })
//   })

//   // proxy api requests
//   Object.keys(proxyTable).forEach(function (context) {
//     var options = proxyTable[context]
//     if (typeof options === 'string') {
//       options = { target: options }
//     }
//     app.use(proxyMiddleware(options.filter || context, options))
//   })

//   // serve webpack bundle output
//   app.use(devMiddleware)

//   // enable hot-reload and state-preserving
//   // compilation error display
//   app.use(hotMiddleware)

//   // serve pure static assets
//   var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
//   app.use(staticPath, express.static('./static'))
// } else {
//   app.use('/', express.static('./dist'))
// }

// // deal with errors
// app.use(function (err, req, res, next) {
//   if (res.headersSent) {
//     return next(err)
//   }

//   if (err.code === 'LIMIT_FILE_SIZE') {
//     res.json({ code: StatusCode.E_FILE_TOO_LARGE })
//     return
//   }
//   if (err.code === 'ERROR_NOT_LOGIN') {
//     res.json({ code: StatusCode.E_NOT_LOGIN })
//     return
//   }

//   console.log(err)
//   res.json({ code: StatusCode.E_UNKNOWN })
// })

// var uri = `http://${host}:${port}`

// var _resolve
// readyPromise = new Promise(resolve => {
//   _resolve = resolve
// })

// if (process.env.NODE_ENV !== 'production') {
//   console.log('> Starting dev server...')
//   devMiddleware.waitUntilValid(() => {
//     console.log('> Listening at ' + uri + '\n')
//     // when env is testing, don't need open it
//     if (autoOpenBrowser && process.env.NODE_ENV !== 'testing') {
//       opn(uri)
//     }
//     _resolve()
//   })
// } else {
//   console.log('> Starting prod server...')
//   console.log('> Listening at ' + uri + '\n')
//   _resolve()
// }

// server = app.listen(port, host)

// module.exports = {
//   ready: readyPromise,
//   close: () => {
//     server.close()
//   }
// }
