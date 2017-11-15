const warn = require('./logger')('app:ensure-argv', 'red')

module.exports = function (argv, command) {
  if (['dev', 'build'].includes(command)) {
    if (!['spa', 'pwa', 'cordova', 'electron'].includes(argv.mode)) {
      warn(`Unknown mode "${ argv.mode }"`)
      process.exit(1)
    }

    if (!['mat', 'ios'].includes(argv.theme)) {
      warn(`Unknown theme "${ argv.theme }"`)
      process.exit(1)
    }

    if (argv.mode === 'cordova') {
      if (!argv.target) {
        argv.target = 'android'
      }
      else if (!['android', 'ios', 'blackberry10', 'browser', 'osx', 'ubuntu', 'webos', 'windows', 'www'].includes(argv.target)) {
        warn(`Unknown target "${ argv.target }" for cordova`)
        process.exit(1)
      }
      if (command === 'dev' && (argv.hostname === undefined || ['localhost', '127.0.0.1', '::1'].includes(argv.hostname.toLowerCase()))) {
        warn('Cordova DEV requires you to specify external IP address or HOSTNAME as -H IP|HOSTNAME"')
        process.exit(1)
      }
    }

    if (argv.mode === 'electron') {
      if (!argv.target) {
        argv.target = 'all'
      }
      else if (!['all', 'darwin', 'win32', 'linux', 'mas'].includes(argv.target)) {
        warn(`Unknown target "${ argv.target }" for electron`)
        process.exit(1)
      }
    }
  }
  else if (command === 'mode') {
    if (argv.add !== undefined && !['pwa', 'cordova', 'electron'].includes(argv.add)) {
      warn(`Unknown mode "${ argv.add }" to add`)
      process.exit(1)
    }
    if (argv.remove !== undefined && !['pwa', 'cordova', 'electron'].includes(argv.remove)) {
      warn(`Unknown mode "${ argv.remove }" to remove`)
      process.exit(1)
    }
  }
}
