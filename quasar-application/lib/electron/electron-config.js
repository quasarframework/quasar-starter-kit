const
  fs = require('fs'),
  path = require('path'),
  appPaths = require('../build/app-paths'),
  resolve = require('path').resolve,
  log = require('../helpers/logger')('app:electron-conf')
  et = require('elementtree')

const filePath = resolve(appPaths.cordovaDir, 'config.xml')

class ElectronConfig {
  //
}

module.exports = ElectronConfig
