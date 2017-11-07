const resolve = require('path').resolve

const
  cliDir = resolve(__dirname, '..'),
  appDir = resolve(process.argv[1], '../../../..'),
  srcDir = resolve(appDir, 'frontend')

module.exports = {
  appDir,
  srcDir,
  cliDir
}
