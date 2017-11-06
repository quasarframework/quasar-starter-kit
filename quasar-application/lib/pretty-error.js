const PrettyError = require('pretty-error')

// Start default instance
const pe = PrettyError.start()

// Configure prettyError instance
pe.skipPackage('regenerator-runtime')
pe.skipPackage('babel-runtime')
pe.skipNodeFiles()

// Console error unhandled promises
process.on('unhandledRejection', function (err) {
  /* eslint-disable no-console */
  console.error(pe.render(err))
})

module.exports = {
  pe
}
