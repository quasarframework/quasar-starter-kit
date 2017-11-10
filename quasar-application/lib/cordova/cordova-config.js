const
  fs = require('fs'),
  path = require('path'),
  appPaths = require('../build/app-paths'),
  resolve = require('path').resolve,
  log = require('../helpers/logger')('app:cordova-conf')
  et = require('elementtree')

const filePath = resolve(appPaths.cordovaDir, 'config.xml')

class CordovaConfig {
  refresh () {
    const content = fs.readFileSync(filePath, 'utf-8')
    this.doc = et.parse(content)
  }

  save () {
    const content = this.doc.write({ indent: 4 })
    fs.writeFileSync(filePath, content, 'utf8')
  }

  prepare (uri) {
    const root = this.doc.getroot()
    let el = root.find('content')

    if (!el) {
      el = et.SubElement(root, 'content', { src: 'index.html' })
    }

    el.set('src', uri)
    this.uri = uri

    this.save()
    log('Temporary changed Cordova config.xml')
  }

  reset () {
    const root = this.doc.getroot()
    let el = root.find('content')

    if (!el) {
      el = et.SubElement(root, 'content', { src: this.uri })
    }

    el.set('src', 'index.html')

    log('Cordova config.xml was reset')
    this.save()
  }
}

module.exports = CordovaConfig
