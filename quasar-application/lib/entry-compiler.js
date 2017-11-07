const
  fs = require('fs'),
  mkdirp = require('mkdirp').sync,
  dirname = require('path').dirname,
  Handlebars = require('handlebars')

const appPaths = require('./app-paths')

class EntryCompiler {
  constructor (quasarConfig) {
    const content = fs.readFileSync(appPaths.entryTemplateFile, 'utf-8')
    this.template = Handlebars.compile(content)
    this.quasarConfig = quasarConfig
  }

  build () {
    const data = this.quasarConfig.getBuildConfig()
    mkdirp(dirname(appPaths.entryFile))
    fs.writeFileSync(appPaths.entryFile, this.template(data), 'utf-8')

    const
      now = Date.now() / 1000,
      then = now - 10

    fs.utimes(appPaths.entryFile, then, then, function (err) { if (err) throw err })
  }
}

module.exports = EntryCompiler
