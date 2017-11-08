const debug = require('debug')('app:conf')
debug.color = 2 // force green color

const path = require('path')

const
  fs = require('fs'),
  generateWebpackConfig = require('./build/webpack-config'),
  appPaths = require('./app-paths'),
  resolve = require('path').resolve,
  merge = require('webpack-merge'),
  chokidar = require('chokidar'),
  debounce = require('lodash.debounce')

function getQuasarConfigCtx (opts) {
  const ctx = {
    dev: opts.dev || false,
    prod: opts.prod || false,
    theme: {},
    themeName: opts.theme,
    mode: {},
    modeName: opts.mode
  }
  ctx.theme[opts.theme] = true
  ctx.mode[opts.mode] = true
  return ctx
}

function encode (obj) {
  return JSON.stringify(obj, (key, value) => {
    return typeof value === 'function'
      ? `/fn(${value.toString()})`
      : value
  })
}

function encodeConfig (obj) {
  return [
    encode(obj.build),
    encode(obj.devServer),
    encode(obj.extendWebpack)
  ].join('')
}

class QuasarConfig {
  constructor (opts) {
    this.filename = resolve(appPaths.appDir, opts.filename)
    this.opts = opts
    this.ctx = getQuasarConfigCtx(opts)

    this.watch = opts.onBuildChange || opts.onAppChange

    if (this.watch) {
      // Start watching for quasar.config.js changes
      chokidar
        .watch(this.filename, { watchers: { chokidar: { ignoreInitial: true } } })
        .on('change', debounce(() => {
          debug(`${opts.filename} changed`)
          this.refresh()
          if (this.buildChanged) {
            opts.onBuildChange()
          }
          else {
            opts.onAppChange()
          }
        }), 2500)
    }

    this.refresh()
  }

  getBuildConfig () {
    return this.buildConfig
  }

  getWebpackConfig () {
    return this.webpackConfig
  }

  refresh () {
    debug(`Parsing Quasar config file`)
    let config

    if (fs.existsSync(this.filename)) {
      delete require.cache[this.filename]
      config = require(this.filename)
    }
    else {
      console.error(`> Could not load config file ${this.filename}`)
      process.exit(1)
    }

    const cfg = config(this.ctx)
    let publicPath = this.ctx.dev ? '' : '/'

    if (cfg.build && cfg.build.publicPath) {
      publicPath = cfg.build.publicPath
    }

    // make sure it exists
    cfg.supportIE = cfg.supportIE || false

    cfg.build = merge({
      publicPath,
      debug: this.ctx.debug,
      distDir: `dist-${this.ctx.modeName}`,
      htmlFilename: 'index.html',
      defines: {
        'process.env': {
          NODE_ENV: `"${this.ctx.prod ? 'production' : 'development'}"`,
          DEV: this.ctx.dev,
          PROD: this.ctx.prod,
          THEME: `"${this.ctx.themeName}"`,
          MODE: `"${this.ctx.modeName}"`
        }
      }
    }, cfg.build || {})

    cfg.devServer = merge({
      contentBase: appPaths.srcDir,
      publicPath,
      hot: true,
      inline: true,
      overlay: true,
      quiet: true,
      historyApiFallback: true,
      noInfo: true,
      disableHostCheck: true,
      host: this.opts.host,
      port: this.opts.port,
      open: true
    }, cfg.devServer || {})

    if (process.env.PORT) {
      cfg.devServer.port = process.env.PORT
    }
    if (process.env.HOSTNAME) {
      cfg.devServer.host = process.env.HOSTNAME
    }

    if (this.watch) {
      const newBuild = encodeConfig(cfg)

      if (this.oldBuild) {
        this.buildChanged = newBuild !== this.oldBuild
      }

      this.oldBuild = newBuild
    }

    cfg.ctx = this.ctx
    cfg.build.uri = `http${cfg.devServer.https ? 's' : ''}://${cfg.devServer.host}:${cfg.devServer.port}`

    this.buildConfig = cfg
    debug(`Generating Webpack config`)
    let webpackConfig = generateWebpackConfig(cfg)

    if (typeof cfg.extendWebpack === 'function') {
      debug(`Extending Webpack config`)
      cfg.extendWebpack(webpackConfig)
    }

    this.webpackConfig = webpackConfig
  }

}

module.exports = QuasarConfig
