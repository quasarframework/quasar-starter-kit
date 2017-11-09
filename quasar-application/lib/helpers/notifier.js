const path = require('path')

const
  appPaths = require('../build/app-paths'),
  icon = path.join(appPaths.cliDir, 'assets/quasar-logo.png')

module.exports = function ({ title = 'Quasar', message = '', subtitle = '', onClick }) {
  // require it only if necessary
  const notifier = require('node-notifier')

  notifier.notify({
    title,
    message,
    subtitle,
    icon,
    timeout: onClick ? 5 : null,
    actions: 'Close'
  }, (err, response, metadata) => {
    if (
      typeof onClick === 'function' &&
      response === 'activate' &&
      metadata.activationValue !== 'Close'
    ) {
      onClick()
    }
  })
}
