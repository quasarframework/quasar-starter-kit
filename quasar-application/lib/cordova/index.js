const
  log = require('../helpers/logger')('app:cordova'),
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

  run (quasarConfig) {
    if (this.pid) {
      this.stop()
    }

    const
      cfg = quasarConfig.getBuildConfig(),
      args = ['run']

    if (cfg.ctx.targetName) {
      args.push(cfg.ctx.targetName)
    }

    return this.__runCordovaCommand(cfg.build.APP_URL, args)
  }

  build (quasarConfig, cordovaArgs) {
    const cfg = quasarConfig.getBuildConfig()
    let args = ['build']

    if (cfg.ctx.targetName) {
      args.push(cfg.ctx.targetName)
    }
    if (cordovaArgs) {
      const cArg = cordovaArgs.replace(/  /g, ' ').split(' ')
      args = args.concat(cArg)
    }

    return this.__runCordovaCommand(cfg.build.APP_URL, args)
  }

  stop () {
    if (!this.pid) { return }

    log('Shutting down Cordova process...')
    process.kill(this.pid)
    this.__cleanup()
  }

  __runCordovaCommand (url, args) {
    this.config.prepare(url)

    return new Promise((resolve, reject) => {
      this.pid = spawn(
        'cordova',
        args,
        appPaths.cordovaDir,
        code => {
          this.__cleanup()
          resolve(code)
        }
      )
    })
  }

  __cleanup () {
    this.pid = 0
    this.config.reset()
  }
}

module.exports = new CordovaRunner()
