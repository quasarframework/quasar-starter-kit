const
  log = require('../helpers/logger')('app:cordova-runner'),
  CordovaConfig = require('./cordova-config'),
  spawn = require('../helpers/spawn'),
  onShutdown = require('../helpers/on-shutdown'),
  appPaths = require('../build/app-paths')

class CordovaRunner {
  constructor () {
    this.pid = 0
    this.config = new CordovaConfig()

    onShutdown(() => {
      this.stop()
    })
  }

  run (quasarConfig, callback) {
    if (this.pid) {
      this.stop()
    }

    const buildConfig = quasarConfig.getBuildConfig()
    this.ctx = buildConfig.ctx
    this.buildConfig = buildConfig
    this.config.refresh()

    if (this.ctx.dev) {
      this.config.prepare(buildConfig.build.uri)
    }

    this.pid = spawn(
      'cordova',
      [this.ctx.dev ? 'run' : 'build', this.ctx.targetName],
      appPaths.cordovaDir,
      () => {
        this.cleanup()
        callback && callback(code)
      }
    )
  }

  cleanup () {
    this.pid = 0
    if (this.ctx.dev) {
      this.config.reset()
    }
  }

  stop () {
    if (!this.pid) { return }

    log('Shutting down Cordova process...')
    process.kill(this.pid)
    this.cleanup()
  }
}

module.exports = new CordovaRunner()
