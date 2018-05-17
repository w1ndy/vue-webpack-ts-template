const webpackHotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true&timeout=3000')

webpackHotClient.subscribe(event => {
  if (event.action === 'reload') {
    window.location.reload(true)
  }
})
