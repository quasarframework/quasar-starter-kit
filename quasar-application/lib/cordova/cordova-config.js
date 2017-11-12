const
  fs = require('fs'),
  path = require('path'),
  appPaths = require('../build/app-paths'),
  log = require('../helpers/logger')('app:cordova-conf')
  et = require('elementtree')

const filePath = appPaths.resolve.cordova('config.xml')

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
      el = et.SubElement(root, 'content', { src: uri })
      this.originalSrc = 'index.html'
    }
    else {
      this.originalSrc = el.get('src')
      el.set('src', uri)
    }

    let nav = root.find(`allow-navigation[@href='${uri}']`)
    if (!nav) {
      nav = et.SubElement(root, 'allow-navigation', { href: uri })
    }

    this.save()
    log('Temporary changed Cordova config.xml')
  }

  reset () {
    const root = this.doc.getroot()
    let el = root.find('content')

    if (!el) {
      el = et.SubElement(root, 'content', { src: this.originalSrc })
    }
    else {
      el.set('src', this.originalSrc)
    }

    log('Cordova config.xml was reset')
    this.save()
  }
}

module.exports = CordovaConfig
