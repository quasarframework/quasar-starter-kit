const path = require('path')
const log = require('./helpers/logger')('app:cordova-conf')

const
  fs = require('fs'),
  appPaths = require('./build/app-paths'),
  resolve = require('path').resolve,
  et = require('elementtree')

const filePath = resolve(appPaths.cordovaDir, 'config.xml')

class CordovaConfig {
  constructor () {
    this.refresh()
  }

  refresh () {
    const content = fs.readFileSync(filePath, 'utf-8')
    this.doc = et.parse(content)
  }

  save () {
    const content = this.doc.write({ indent: 4 })
    fs.writeFileSync(filePath, content, 'utf8')
  }

  prepareDev (uri) {
    const root = this.doc.getroot()
    let el = root.find('content')

    if (!el) {
      el = et.SubElement(root, 'content', { src: 'index.html' })
    }

    el.set('original-src', el.get('src'))
    el.set('src', uri)

    this.save()
  }

  reset () {
    const root = this.doc.getroot()
    let el = root.find('content')

    if (!el) {
      el = et.SubElement(root, 'content', { src: 'index.html' })
    }

    el.set('src', el.get('original-src'))

    this.save()
  }
}

module.exports = CordovaConfig
