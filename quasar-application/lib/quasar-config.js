const debug = require('debug')('qapp:conf')
debug.color = 2 // force green color

const path = require('path')

const
  fs = require('fs'),
  generateWebpackConfig = require('./build/generate-webpack-config'),
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
    encode(obj.extend)
  ].join('')
}

class QuasarConfig {
  constructor (opts) {
    this.filename = resolve(appPaths.appDir, opts.filename)
    this.opts = opts
    this.quasarConfigCtx = getQuasarConfigCtx(opts)

    this.watch = opts.onBuildChange || opts.onAppChange

    if (this.watch) {
      // Start watching for quasar.config.js changes
      chokidar
        .watch(this.filename, { watchers: { chokidar: { ignoreInitial: true } } })
        .on('change', debounce(() => {
          debug(`${opts.filename} changed.`)
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

  getQuasarConfigCtx () {
    return this.quasarConfigCtx
  }

  getBuildConfig () {
    return this.buildConfig
  }

  getWebpackConfig () {
    return this.webpackConfig
  }

  refresh () {
    let config

    if (fs.existsSync(this.filename)) {
      delete require.cache[this.filename]
      config = require(this.filename)
    }
    else {
      console.error(`> Could not load config file ${this.filename}`)
      process.exit(1)
    }

    const cfg = config(this.quasarConfigCtx)
    let publicPath = this.quasarConfigCtx.dev ? '' : '/'

    if (cfg.build && cfg.build.publicPath) {
      publicPath = cfg.build.publicPath
    }

    cfg.build = merge(
      {
        publicPath,
        debug: this.quasarConfigCtx.dev,
        distDir: `dist-${this.quasarConfigCtx.modeName}`,
        htmlFilename: 'index.html',
        defines: {
          'process.env': {
            NODE_ENV: `"${this.quasarConfigCtx.prod ? 'production' : 'development'}"`
          },
          'DEV': this.quasarConfigCtx.dev,
          'PROD': this.quasarConfigCtx.prod,
          '__THEME__': `"${this.quasarConfigCtx.themeName}"`
        }
      },
      cfg.build || {}
    )

    cfg.devServer = merge(
      {
        contentBase: '/work/app/template/frontend/',
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
      },
      cfg.devServer || {}
    )

    if (process.env.PORT) {
      cfg.devServer.port = process.env.PORT
    }
    if (process.env.HOSTNAME) {
      cfg.devServer.host = process.env.HOSTNAME
    }

    cfg.build.uri = `http${cfg.devServer.https ? 's' : ''}://${cfg.devServer.host}:${cfg.devServer.port}`

    if (this.watch) {
      const newBuild = encodeConfig(cfg)

      if (this.oldBuild) {
        this.buildChanged = newBuild !== this.oldBuild
      }

      this.oldBuild = newBuild
    }

    this.buildConfig = cfg
    let webpackConfig = generateWebpackConfig(this.quasarConfigCtx, cfg)

    if (typeof cfg.extend === 'function') {
      cfg.extend(webpackConfig)
    }

    this.webpackConfig = webpackConfig
  }

}

module.exports = QuasarConfig
