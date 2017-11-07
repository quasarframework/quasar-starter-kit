const debug = require('debug')('qapp:dev-server')
debug.color = 2 // force green color

const
  chalk = require('chalk'),
  path = require('path'),
  opn = require('opn'),
  express = require('express'),
  webpack = require('webpack'),
  webpackDevServer = require('webpack-dev-server')

const
  appPaths = require('./app-paths')

class DevServer {
  constructor (quasarConfig) {
    this.webpackConfig = quasarConfig.getWebpackConfig()
    this.ctx = quasarConfig.getQuasarConfigCtx()

    const cfg = quasarConfig.getBuildConfig()
    this.opts = cfg.devServer
    this.uri = cfg.build.uri
  }

  listen () {
    debug(`Starting dev server with "${chalk.bold(this.ctx.themeName)}" theme...`)
    debug(`Will listen at ${chalk.bold(this.uri)}`)
    if (this.opts.open) {
      debug('Browser will open when build is ready.')
    }
    console.log()

    this.compiler = webpack(this.webpackConfig)
    this.compiler.plugin('done', () => {
      if (this.__started) { return }
      this.__started = true

      this.server.listen(this.opts.port, this.opts.host, () => {
        if (this.opts.open) {
          opn(this.uri)
        }
      })
    })

    // start building & launch server
    this.server = new webpackDevServer(this.compiler, this.opts)
  }

  stop () {
    this.server.close()
  }
}

module.exports = DevServer
