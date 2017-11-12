const
  fs = require('fs'),
  fse = require('fs-extra'),
  appPaths = require('../build/app-paths'),
  logger = require('../helpers/logger'),
  log = logger('app:mode-cordova'),
  warn = logger('app:mode-cordova', 'red'),
  spawn = require('../helpers/spawn')

class Mode {
  isInstalled () {
    return fs.existsSync(appPaths.cordovaDir)
  }

  add ({ cordovaId = 'org.quasar.cordova.app', cordovaName = 'QuasarApp' }) {
    if (this.isInstalled()) {
      warn(`Cordova support detected already. Aborting.`)
      return
    }

    log('Creating Cordova source folder...')

    spawn(
      'cordova',
      ['create', 'src-cordova', cordovaId, cordovaName],
      appPaths.appDir,
      () => log(`Cordova support was installed`)
    )

    log(`Cordova support was added`)
  }

  remove () {
    if (!this.isInstalled()) {
      warn(`No Cordova support detected. Aborting.`)
      return
    }

    fse.removeSync(appPaths.cordovaDir)
    log(`Cordova support was removed`)
  }
}

module.exports = Mode
