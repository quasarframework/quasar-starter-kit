const
  spawn = require('../helpers/spawn'),
  webpack = require('webpack'),
  onShutdown = require('../helpers/on-shutdown'),
  log = require('../helpers/logger')('app:electron-runner'),
  path = require('path')

class ElectronRunner {
  constructor () {
    this.pid = 0

    onShutdown(() => {
      this.stop()
    })
  }

  run (quasarConfig, callback) {
    this.stop()

    const
      buildConfig = quasarConfig.getBuildConfig(),
      webpackConfig = quasarConfig.getElectronWebpackConfig()

    this.ctx = buildConfig.ctx
    this.buildConfig = buildConfig

    log(`DDD promising`)
    return new Promise((resolve, reject) => {
      this.compiler = webpack(webpackConfig)
      this.compiler.watch({}, (err, stats) => {
        if (err) {
          console.log(err)
          return
        }

        // console.log(stats)
        this.startElectron()

        resolve()
      })
    })
  }

  startElectron () {
    this.stop()

    log(`Starting Electron process`)
    this.pid = spawn(
      require(appPaths.resolve.app('node_modules/electron')),
      [
        '--inspect=5858',
        appPaths.resolve.app('.quasar/electron/electron-main.js')
      ],
      appPaths.appDir,
      () => {
        this.cleanup()
      }
    )
  }

  cleanup () {
    this.pid = 0
  }

  stop () {
    if (!this.pid) { return }

    log('Shutting down Electron process...')
    process.kill(this.pid)
    this.cleanup()
  }
}

module.exports = new ElectronRunner()
