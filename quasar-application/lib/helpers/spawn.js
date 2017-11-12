const
  logger = require('./logger'),
  log = logger('app:spawn'),
  warn = logger('app:spawn', 'red'),
  spawn = require('cross-spawn').sync

module.exports = function (cmd, params, cwd, onFail) {
  log(`Running "${cmd} ${params.join(' ')}"`)

  const runner = spawn(
    cmd,
    params,
    { stdio: 'inherit', stdout: 'inherit', stderr: 'inherit', cwd }
  )

  if (runner.status) {
    log(`Command "${cmd}" failed with exit code: ${runner.status}`)
    onFail && onFail()
    process.exit(1)
  }
}
