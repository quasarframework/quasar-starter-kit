const warn = require('./logger')('app:ensure-argv', 'red')

module.exports = function (argv, cmd) {
  if (cmd === 'mode') {
    if (![undefined, 'pwa', 'cordova', 'electron'].includes(argv.add)) {
      warn(`Unknown mode "${ argv.add }" to add`)
      wanr()
      process.exit(1)
    }
    if (![undefined, 'pwa', 'cordova', 'electron'].includes(argv.remove)) {
      warn(`Unknown mode "${ argv.remove }" to remove`)
      warn()
      process.exit(1)
    }

    return
  }

  if (!['spa', 'pwa', 'cordova', 'electron'].includes(argv.mode)) {
    warn(`Unknown mode "${ argv.mode }"`)
    warn()
    process.exit(1)
  }

  if (!['mat', 'ios'].includes(argv.theme)) {
    warn(`Unknown theme "${ argv.theme }"`)
    warn()
    process.exit(1)
  }

  if (argv.mode === 'cordova') {
    if (![undefined, 'android', 'ios', 'blackberry10', 'browser', 'osx', 'ubuntu', 'webos', 'windows'].includes(argv.target)) {
      warn(`Unknown target "${ argv.target }" for Cordova`)
      warn()
      process.exit(1)
    }
    if (cmd === 'dev' && (argv.hostname === undefined || ['localhost', '127.0.0.1', '::1'].includes(argv.hostname.toLowerCase()))) {
      warn('Cordova DEV requires you to specify external IP address or HOSTNAME as -H IP|HOSTNAME"')
      warn()
      process.exit(1)
    }
  }

  if (argv.mode === 'electron') {
    if (![undefined, 'all', 'darwin', 'win32', 'linux', 'mas'].includes(argv.target)) {
      warn(`Unknown target "${ argv.target }" for Electron`)
      warn()
      process.exit(1)
    }
    if (cmd === 'build' && ![undefined, 'ia32', 'x64', 'armv7l', 'arm64', 'all'].includes(argv.arch)) {
      warn(`Unknown architecture "${ argv.arch }" for Electron`)
      warn()
      process.exit(1)
    }
  }
}
