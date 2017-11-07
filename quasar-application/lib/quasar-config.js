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

class QuasarConfig {
  constructor (opts) {
    this.filename = resolve(appPaths.appDir, opts.filename)
    this.opts = opts
    this.quasarConfigCtx = getQuasarConfigCtx(opts)

    if (opts.watch) {
      // Start watching for quasar.config.js changes
      chokidar
        .watch(this.filename, { watchers: { chokidar: { ignoreInitial: true } } })
        .on('change', debounce(() => {
          debug(`${opts.filename} changed.`)
          opts.watch()
        }), 2500)
    }
  }

  getQuasarConfigCtx () {
    return this.quasarConfigCtx
  }

  getBuildConfig () {
    return this.buildConfig
  }

  getWebpackConfig () {
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
        devServer: {
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
        }
      },
      cfg.build || {}
    )

    if (process.env.PORT) {
      cfg.build.devServer.port = process.env.PORT
    }
    if (process.env.HOSTNAME) {
      cfg.build.devServer.host = process.env.HOSTNAME
    }

    const defines = {
      'process.env': {
        NODE_ENV: `"${this.quasarConfigCtx.prod ? 'production' : 'development'}"`
      },
      'DEV': this.quasarConfigCtx.dev,
      'PROD': this.quasarConfigCtx.prod,
      '__THEME__': `"${this.quasarConfigCtx.themeName}"`
    }
    cfg.defines = cfg.defines
      ? merge(defines, cfg.defines)
      : defines

    this.buildConfig = cfg
    let webpackConfig = generateWebpackConfig(this.quasarConfigCtx, cfg)

    if (typeof cfg.extend === 'function') {
      cfg.extend(webpackConfig)
    }

    return webpackConfig
  }
}

module.exports = QuasarConfig
