const
  spawn = require('../helpers/spawn'),
  webpack = require('webpack'),
  logger = require('../helpers/logger'),
  log = logger('app:electron'),
  warn = logger('app:electron', 'red'),
  path = require('path'),
  fse = require('fs-extra'),
  appPaths = require('../build/app-paths')

class ElectronRunner {
  constructor () {
    this.pid = 0
    this.watcher = null
  }

  run (quasarConfig) {
    const compiler = webpack(quasarConfig.getElectronWebpackConfig())

    return new Promise((resolve, reject) => {
      log(`Building main Electron process...`)
      this.watcher = compiler.watch({}, (err, stats) => {
        if (err) {
          console.log(err)
          return
        }

        log(`Webpack built Electron main process`)
        log()
        process.stdout.write(stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false
        }) + '\n')
        log()

        if (stats.hasErrors()) {
          warn(`Electron main build failed with errors`)
          return
        }

        this.stopElectron()
        this.startElectron()

        resolve()
      })
    })
  }

  build (quasarConfig) {
    const
      webpackConfig = quasarConfig.getElectronWebpackConfig(),
      packagerConfig = quasarConfig.getBuildConfig().electron.packager

    return new Promise((resolve, reject) => {
      log(`Building main Electron process...`)
      webpack(webpackConfig, (err, stats) => {
        if (err) { throw err }

        log(`Webpack built Electron main process`)
        log()
        process.stdout.write(stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false
        }) + '\n')
        log()

        if (stats.hasErrors()) {
          warn(`Electron main build failed with errors`)
          reject()
        }

        resolve()
      })
    }).then(() => {
      return new Promise((resolve, reject) => {
        log(`Packaging app with Electron packager...`)
        log()

        const packager = require(appPaths.resolve.app('node_modules/electron-packager'))
        packager(packagerConfig, (err, appPaths) => {
          log()

          if (err) {
            warn(`[FAIL] Electron packager could not build`)
            console.log(err + '\n')
            reject()
            return
          }

          log(`[SUCCESS] Electron packager built the app`)
          log(`Built path(s): ${appPaths.join(', ')}`)
          log()
          resolve()
        })
      })
    })
  }

  startElectron () {
    log(`Booting up Electron...`)
    this.pid = spawn(
      require(appPaths.resolve.app('node_modules/electron')),
      [
        '--inspect=5858',
        appPaths.resolve.app('.quasar/electron/electron-main.js')
      ],
      appPaths.appDir
    )
  }

  cleanup () {
    this.pid = 0
  }

  stop () {
    return new Promise((resolve, reject) => {
      const finalize = () => {
        this.stopElectron()
        resolve()
      }

      if (this.watcher) {
        this.watcher.close(finalize)
        this.watcher = null
        return
      }

      finalize()
    })
  }

  stopElectron () {
    if (!this.pid) { return }

    log('Shutting down Electron process...')
    process.kill(this.pid)
    this.cleanup()
  }
}

module.exports = new ElectronRunner()
