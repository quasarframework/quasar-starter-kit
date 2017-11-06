const resolve = require('path').resolve

const
  appDir = '/work/app/template',
  srcDir = resolve(appDir, 'frontend'),
  cliDir = resolve(__dirname, '..')

module.exports = {
  appDir,
  srcDir,
  cliDir
}
