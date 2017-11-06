const
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

const QuasarConfig = function (opts) {
  this.filename = resolve(appPaths.appDir, opts.filename)
  this.opts = opts
  this.quasarConfigCtx = getQuasarConfigCtx(opts)

  if (opts.watch) {
    // Start watching for quasar.config.js changes
    chokidar
      .watch(this.filename, { watchers: { chokidar: { ignoreInitial: true } } })
      .on('all', debounce(() => {
        debug(`${opts.filename} changed. Rebuilding...`)
        opts.watch(this.getWebpackConfig())
      }), 2500)
  }
}

QuasarConfig.prototype.getQuasarConfigCtx = function () {
  return this.quasarConfigCtx
}

QuasarConfig.prototype.getWebpackConfig = function () {
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

  const build = cfg.build || {}
  cfg.build = merge(
    {
      publicPath: this.quasarConfigCtx.dev ? '' : '/',
      debug: this.quasarConfigCtx.dev,
      distDir: `dist-${this.quasarConfigCtx.modeName}`,
      devOpenBrowser: true,
      devProxyTable: {},
      prodPurifyCSS: false,
      htmlFilename: 'index.html'
    },
    build,
    {
      appDir: appPaths.appDir,
      port: this.opts.port || process.env.PORT || build.port || 8080,
      srcDir: appPaths.srcDir,
      cliDir: appPaths.cliDir
    }
  )
  cfg.build.distDir = resolve(appPaths.appDir, cfg.build.distDir)
  cfg.build.themeName = this.quasarConfigCtx.themeName

  const defines = {
    'process.env': {
      NODE_ENV: `"${this.quasarConfigCtx.prod ? 'production' : 'development'}"`
    },
    'DEV': this.quasarConfigCtx.dev,
    'PROD': this.quasarConfigCtx.prod,
    '__THEME__': `"${this.quasarConfigCtx.themeName}"`
  }
  cfg.defines = cfg.defines && cfg.defines[this.quasarConfigCtx.prod ? 'prod' : 'dev']
    ? merge(defines, cfg.defines[this.quasarConfigCtx.prod ? 'prod' : 'dev'])
    : defines


  let webpackConfig = generateWebpackConfig(this.quasarConfigCtx, cfg)

  if (typeof cfg.extend === 'function') {
    cfg.extend(webpackConfig)
  }

  return webpackConfig
}
