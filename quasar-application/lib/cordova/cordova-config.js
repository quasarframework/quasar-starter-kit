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
    log('Updated Cordova config.xml')
  }

  prepare (APP_URL) {
    this.refresh()
    this.APP_URL = APP_URL

    const root = this.doc.getroot()
    let el = root.find('content')

    if (!el) {
      el = et.SubElement(root, 'content', { src: APP_URL })
    }
    else {
      if (el.get('src') === APP_URL) {
        // no need to update anything
        return
      }
      el.set('src', APP_URL)
    }

    let nav = root.find(`allow-navigation[@href='${APP_URL}']`)
    if (!nav) {
      nav = et.SubElement(root, 'allow-navigation', { href: APP_URL })
    }

    this.save()
  }

  reset () {
    if (!this.APP_URL || this.APP_URL === 'index.html') {
      return
    }

    const root = this.doc.getroot()
    let el = root.find('content')

    if (!el) {
      el = et.SubElement(root, 'content', { src: 'index.html' })
    }
    else {
      el.set('src', 'index.html')
    }

    let nav = root.find(`allow-navigation[@href='${this.APP_URL}']`)
    root.remove(nav)

    this.save()
  }
}

module.exports = CordovaConfig
