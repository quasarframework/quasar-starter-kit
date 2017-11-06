const debug = require('debug')('qapp:dev-server')
debug.color = 2 // force green color

const
  chalk = require('chalk'),
  path = require('path'),
  express = require('express'),
  webpack = require('webpack'),
  opn = require('opn'),
  proxyMiddleware = require('http-proxy-middleware'),
  webpackDevMiddleware = require('webpack-dev-middleware'),
  webpackHotMiddleware = require('webpack-hot-middleware'),
  connectHistoryApiFallback = require('connect-history-api-fallback')

const
  appPaths = require('./app-paths')

class DevServer {
  constructor (quasarConfig) {
    this.webpackConfig = quasarConfig.getWebpackConfig()
    const
      cfg = quasarConfig.getBuildConfig(),
      ctx = quasarConfig.getQuasarConfigCtx()

    this.port = cfg.build.devPort
    this.uri = `http://localhost:${this.port}`
    this.proxyTable = cfg.build.devProxyTable
    this.openBrowser = cfg.build.devOpenBrowser
    this.publicPath = cfg.build.publicPath
    this.theme = ctx.themeName
  }

  build () {
    debug(`Starting dev server with "${chalk.bold(this.theme)}" theme...`)
    debug(`Will listen at ${chalk.bold(this.uri)}`)

    if (this.openBrowser) {
      debug('Browser will open when build is ready.')
    }

    const compiler = webpack(this.webpackConfig)

    console.log(this.publicPath)
    this.devMiddleware = webpackDevMiddleware(compiler, {
      publicPath: this.publicPath,
      quiet: true
    })
    this.hotMiddleware = webpackHotMiddleware(compiler, {
      log: false,
      heartbeat: 2000
    })

    // force page reload when html-webpack-plugin template changes
    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-after-emit', (data, cb) => {
        this.hotMiddleware.publish({ action: 'reload' })
        cb()
      })
    })
  }

  listen () {
    const app = express()

    // proxy requests like API. See /config/index.js -> dev.proxyTable
    // https://github.com/chimurai/http-proxy-middleware
    Object.keys(this.proxyTable).forEach(context => {
      var options = proxyTable[context]
      if (typeof options === 'string') {
        options = { target: options }
      }
      app.use(proxyMiddleware(context, options))
    })

    // handle fallback for HTML5 history API
    app.use(connectHistoryApiFallback())

    // serve webpack bundle output
    app.use(this.devMiddleware)

    // enable hot-reload and state-preserving
    // compilation error display
    app.use(this.hotMiddleware)

    // serve pure static assets
    const staticsPath = path.posix.join(this.publicPath, 'statics/')
    app.use(staticsPath, express.static(path.join(appPaths.srcDir, 'statics')))

    this.devMiddleware.waitUntilValid(() => {
      this.server = app.listen(this.port, err => {
        if (err) {
          console.error(err)
          process.exit(1)
        }

        if (this.openBrowser) {
          opn(this.uri)
        }
      })
    })
  }

  stop () {
    this.server.close()
  }
}

module.exports = DevServer
