const debug = require('debug')('app:generator')
debug.color = 2 // force green color

const
  fs = require('fs'),
  mkdirp = require('mkdirp').sync,
  dirname = require('path').dirname,
  compileTemplate = require('lodash.template')

const appPaths = require('./app-paths')

class Generator {
  constructor (quasarConfig) {
    const content = fs.readFileSync(appPaths.entryTemplateFile, 'utf-8')
    this.template = compileTemplate(content)
    this.quasarConfig = quasarConfig
  }

  build () {
    debug(`Generating Webpack entry point`)
    const data = this.quasarConfig.getBuildConfig()
    // console.log(this.template(data))
    // process.exit(0)

    mkdirp(dirname(appPaths.entryFile))
    fs.writeFileSync(appPaths.entryFile, this.template(data), 'utf-8')

    const
      now = Date.now() / 1000,
      then = now - 10

    fs.utimes(appPaths.entryFile, then, then, function (err) { if (err) throw err })
  }
}

module.exports = Generator
