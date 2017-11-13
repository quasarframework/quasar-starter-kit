const
  fs = require('fs'),
  path = require('path'),
  chalk = require('chalk'),
  webpack = require('webpack'),
  ProgressBarPlugin = require('progress-bar-webpack-plugin')

const
  appPaths = require('./app-paths')

module.exports = function (cfg) {
  const
    { dependencies:appDeps } = require(appPaths.resolve.cli('package.json')),
    { dependencies:cliDeps } = require(appPaths.resolve.app('package.json'))

  const webpackConfig = {
    target: 'electron-main',
    entry: {
      'electron-main': appPaths.resolve.electron(
        `main-process/electron-main${cfg.ctx.dev ? '.dev' : ''}.js`
      )
    },
    output: {
      filename: 'electron-main.js',
      libraryTarget: 'commonjs2',
      path: appPaths.resolve.app('.quasar/electron')
    },
    externals: [
      ...Object.keys(cliDeps),
      ...Object.keys(appDeps)
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: /node_modules/
        },
        {
          test: /\.node$/,
          use: 'node-loader'
        }
      ]
    },
    resolve: {
      modules: [
        appPaths.resolve.app('node_modules')
      ],
      extensions: ['.js', '.json', '.node']
    },
    resolveLoader: {
      modules: [
        appPaths.resolve.app('node_modules'),
        appPaths.resolve.cli('node_modules')
      ]
    },
    plugins: [
      new ProgressBarPlugin({
        format: ` [:bar] ${chalk.bold(':percent')} (:msg)`
      }),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.DefinePlugin({
        'process.env': cfg.build.env
      })
    ]
  }

  if (cfg.ctx.dev) {
    webpackConfig.node = {
      __dirname: cfg.ctx.dev,
      __filename: cfg.ctx.dev
    }
  }

  if (cfg.ctx.prod) {
    const UglifyJSPlugin = require('uglifyjs-webpack-plugin')

    webpackConfig.plugins.push(
      new UglifyJSPlugin({
        parallel: true,
        sourceMap: cfg.build.sourceMap
      })
    )
  }

  return webpackConfig
}
