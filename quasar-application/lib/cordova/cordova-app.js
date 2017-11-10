const
  log = require('../helpers/logger')('app:cordova-app'),
  CordovaConfig = require('./cordova-config')

class CordovaApp {
  constructor () {
    this.running = false
    this.config = new CordovaConfig()
  }

  stop () {
    if (!this.running) { return }

    log('Shutting down...')

    if (this.ctx.dev) {
      this.config.reset()
    }
    this.running = false
  }

  start (quasarConfig) {
    if (this.running) { return }

    log('Booting up...')

    const buildConfig = quasarConfig.getBuildConfig()
    this.ctx = buildConfig.ctx
    this.buildConfig = buildConfig
    this.config.refresh()

    if (this.ctx.dev) {
      this.config.prepare(this.buildConfig.build.uri)
    }

    this.running = true
  }
}

module.exports = CordovaApp
