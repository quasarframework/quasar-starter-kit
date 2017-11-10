const warn = require('./logger')('app:ensure-argv', 'red')

module.exports = function (argv) {
  if (!['spa', 'pwa', 'cordova'].includes(argv.mode)) {
    warn(`Unknown mode "${argv.mode}"`)
    process.exit(1)
  }

  if (!['mat', 'ios'].includes(argv.theme)) {
    warn(`Unknown theme "${argv.theme}"`)
    process.exit(1)
  }

  if (argv.mode === 'cordova' && !argv.target) {
    argv.target = 'android'
  }
}
