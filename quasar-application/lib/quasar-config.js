const path = require('path')
const log = require('./helpers/logger')('app:quasar-conf')

const
  fs = require('fs'),
  generateWebpackConfig = require('./build/webpack-config'),
  appPaths = require('./build/app-paths'),
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

class QuasarConfig {
  constructor (opts) {
    this.filename = resolve(appPaths.appDir, opts.filename)
    this.opts = opts
    this.ctx = getQuasarConfigCtx(opts)

    this.watch = opts.onBuildChange || opts.onAppChange
    this.refresh()

    if (this.watch) {
      // Start watching for quasar.config.js changes
      chokidar
        .watch(this.filename, { watchers: { chokidar: { ignoreInitial: true } } })
        .on('change', debounce(() => {
          log(`${opts.filename} changed`)
          this.refresh()
          if (this.webpackConfigChanged) {
            opts.onBuildChange()
          }
          else {
            opts.onAppChange()
          }
        }), 2500)
    }
  }

  getBuildConfig () {
    return this.buildConfig
  }

  getWebpackConfig () {
    return this.webpackConfig
  }

  refresh () {
    let config

    log(`Parsing ${this.opts.filename}`)

    if (fs.existsSync(this.filename)) {
      delete require.cache[this.filename]
      config = require(this.filename)
    }
    else {
      console.error(`> Could not load config file ${this.filename}`)
      process.exit(1)
    }

    const cfg = config(this.ctx)

    // if watching for changes,
    // then determine the type (webpack related or not)
    if (this.watch) {
      const newConfigSnapshot = [
        cfg.build ? encode(cfg.build) : '',
        cfg.devServer ? encode(cfg.devServer) : '',
        cfg.extendWebpack ? encode(cfg.extendWebpack) : '',
        cfg.vendor ? encode(cfg.vendor) : '',
        cfg.pwa ? encode(cfg.pwa) : ''
      ].join('')

      if (this.oldConfigSnapshot) {
        this.webpackConfigChanged = newConfigSnapshot !== this.oldConfigSnapshot
      }

      this.oldConfigSnapshot = newConfigSnapshot
    }

    let publicPath = this.ctx.dev ? '' : '/'

    if (cfg.build && cfg.build.publicPath) {
      publicPath = cfg.build.publicPath
    }

    // make sure it exists
    cfg.supportIE = cfg.supportIE || false

    cfg.build = merge({
      publicPath,
      debug: this.ctx.debug,
      extractCSS: this.ctx.prod,
      sourceMap: this.ctx.dev,
      minify: this.ctx.prod,
      distDir: `dist-${this.ctx.modeName}-${this.ctx.themeName}`,
      htmlFilename: 'index.html',
      webpackManifest: this.ctx.prod,
      useNotifier: true,
      env: {
        NODE_ENV: `"${this.ctx.prod ? 'production' : 'development'}"`,
        DEV: this.ctx.dev,
        PROD: this.ctx.prod,
        THEME: `"${this.ctx.themeName}"`,
        MODE: `"${this.ctx.modeName}"`
      }
    }, cfg.build || {})

    if (!cfg.build.devtool) {
      cfg.build.devtool = this.ctx.dev
        ? '#cheap-module-eval-source-map'
        : '#source-map'
    }

    if (this.ctx.prod && cfg.build.gzip) {
      let gzip = cfg.build.gzip === true
        ? {}
        : cfg.build.gzip
      let ext = ['js', 'css']

      if (gzip.extensions) {
        ext = gzip.extensions
        delete gzip.extensions
      }

      cfg.build.gzip = merge({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp('\\.(' + ext.join('|') + ')$'),
        threshold: 10240,
        minRatio: 0.8
      }, gzip)
    }

    if (this.ctx.dev) {
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
    }

    if (this.ctx.dev) {
      cfg.build.minify = false
      cfg.build.extractCSS = false
    }
    if (this.ctx.mode.pwa) {
      cfg.build.webpackManifest = false

      cfg.pwa = merge({
        cacheId: 'quasar-pwa-app',
        filename: 'service-worker.js',
        cacheExt: 'js,html,css,woff,ttf,eot,otf,woff,woff2,json,svg,gif,jpg,jpeg,png,wav,ogg,webm,flac,aac,mp4,mp3'
      }, cfg.pwa || {})

      cfg.pwa.manifest = merge({
        start_url: `${publicPath}${cfg.build.htmlFilename}`,
        display: 'standalone'
      }, cfg.pwa.manifest || {})

      cfg.pwa.manifest.icons = cfg.pwa.manifest.icons.map(icon => {
        icon.src = `${publicPath}${icon.src}`
        return icon
      })
    }

    cfg.ctx = this.ctx
    cfg.build.uri = `http${cfg.devServer.https ? 's' : ''}://${cfg.devServer.host}:${cfg.devServer.port}`

    this.buildConfig = cfg
    log(`Generating Webpack config`)
    let webpackConfig = generateWebpackConfig(cfg)

    if (typeof cfg.extendWebpack === 'function') {
      log(`Extending Webpack config`)
      cfg.extendWebpack(webpackConfig)
    }

    this.webpackConfig = webpackConfig
  }

}

module.exports = QuasarConfig
