const resolve = require('path').resolve

const
  appDir = resolve(process.argv[1], '../../../..'),
  cliDir = resolve(__dirname, '..')

module.exports = {
  appDir,
  srcDir: resolve(appDir, 'src'),
  cliDir,

  entryTemplateFile: resolve(cliDir, 'lib/templates/entry.js'),
  entryFile: resolve(appDir, '.quasar/entry.js')
}
