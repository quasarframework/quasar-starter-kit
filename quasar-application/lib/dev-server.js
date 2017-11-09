const
  chalk = require('chalk'),
  path = require('path'),
  opn = require('opn'),
  express = require('express'),
  webpack = require('webpack'),
  webpackDevServer = require('webpack-dev-server')

const
  log = require('./helpers/logger')('app:dev-server'),
  notify = require('./helpers/notifier'),
  appPaths = require('./build/app-paths')

let alreadyListening = false

class DevServer {
  constructor (quasarConfig) {
    this.webpackConfig = quasarConfig.getWebpackConfig()

    const cfg = quasarConfig.getBuildConfig()
    this.ctx = cfg.ctx
    this.notify = cfg.build.useNotifier
    this.opts = cfg.devServer
    this.uri = cfg.build.uri
  }

  listen () {
    log(`Booting up...`)
    log()

    this.compiler = webpack(this.webpackConfig)
    this.compiler.plugin('done', () => {
      if (this.__started) { return }
      this.__started = true

      this.server.listen(this.opts.port, this.opts.host, () => {
        if (alreadyListening) { return }
        alreadyListening = true

        if (this.opts.open) {
          opn(this.uri)
        }
        else if (this.notify) {
          notify({
            subtitle: `App is ready for dev`,
            message: `Listening at ${this.uri}`,
            onClick: () => {
              opn(this.uri)
            }
          })
        }
      })
    })

    // start building & launch server
    this.server = new webpackDevServer(this.compiler, this.opts)
  }

  stop () {
    log(`Shutting down`)
    this.server.close()
  }
}

module.exports = DevServer
