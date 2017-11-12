const
  path = require('path'),
  resolve = path.resolve,
  join = path.join

const
  appDir = resolve(process.argv[1], '../../../..'),
  cliDir = resolve(__dirname, '../..'),
  srcDir = resolve(appDir, 'src'),
  cordovaDir = resolve(appDir, 'cordova'),
  electronDir = resolve(appDir, 'electron')

module.exports = {
  cliDir,
  appDir,
  srcDir,
  cordovaDir,
  electronDir,

  entryTemplateFile: resolve(cliDir, 'lib/templates/entry.js'),
  entryFile: resolve(appDir, '.quasar/entry.js'),

  resolve: {
    cli: dir => join(cliDir, dir),
    app: dir => join(appDir, dir),
    src: dir => join(srcDir, dir),
    cordova: dir => join(cordovaDir, dir),
    electron: dir => join(electronDir, dir)
  }
}
