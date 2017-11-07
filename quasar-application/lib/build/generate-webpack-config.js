const
  chalk = require('chalk'),
  path = require('path'),
  webpack = require('webpack'),
  merge = require('webpack-merge'),
  ProgressBarPlugin = require('progress-bar-webpack-plugin')

const
  appPaths = require('../app-paths'),
  getCssUtils = require('./get-css-utils')

function appResolve (dir) {
  return path.join(appPaths.appDir, dir)
}
function srcResolve (dir) {
  return path.join(appPaths.appDir, 'frontend', dir)
}
function cliResolve (dir) {
  return path.join(appPaths.cliDir, dir)
}

module.exports = function (cfg) {
  const cssUtils = getCssUtils(cfg.ctx)

  let appEntry = [ appResolve(`.quasar/entry.js`) ]
  if (cfg.build.supportIE) {
    appEntry.unshift(cliResolve(`node_modules/quasar-framework/dist/quasar.ie.polyfills.js`))
  }

  let webpackConfig = {
    entry: {
      app: appEntry
    },
    resolve: {
      extensions: [
        `.${cfg.ctx.themeName}.js`, '.js',
        `.${cfg.ctx.themeName}.vue`, '.vue',
        '.json'
      ],
      modules: [
        appPaths.srcDir,
        appResolve('node_modules'),
        cliResolve('node_modules')
      ],
      alias: {
        quasar: cliResolve(`node_modules/quasar-framework/dist/quasar.${cfg.ctx.themeName}.esm.js`),
        'quasar-styl': cliResolve(`node_modules/quasar-framework/dist/quasar.${cfg.ctx.themeName}.styl`),
        variables: srcResolve(`themes/app.variables.styl`),
        '~': appPaths.srcDir,
        '@': srcResolve(`components`),
        layouts: srcResolve(`layouts`),
        pages: srcResolve(`pages`),
        assets: srcResolve(`assets`)
      }
    },
    resolveLoader: {
      modules: [
        appResolve('node_modules'),
        cliResolve('node_modules')
      ]
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            loaders: cssUtils.cssLoaders({
              sourceMap: cfg.build.debug,
              extract: cfg.ctx.prod
            }),
            transformToRequire: {
              video: 'src',
              source: 'src',
              img: 'src',
              image: 'xlink:href'
            }
          }
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [
            appPaths.srcDir,
            appResolve(`.quasar/entry.js`)
          ]
        },
        {
          test: /\.json$/,
          loader: 'json-loader'
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'img/[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'fonts/[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'media/[name].[hash:7].[ext]'
          }
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin(cfg.build.defines),
      new ProgressBarPlugin({
        format: ` [:bar] ${chalk.bold(':percent')} (:msg)`
      })
    ],
    performance: {
      hints: false
    }
  }

  // DEVELOPMENT build
  if (cfg.ctx.dev) {
    const
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

    webpackConfig = merge(webpackConfig, {
      // cheap-module-eval-source-map is faster for development
      devtool: '#cheap-module-eval-source-map',
      module: {
        rules: cssUtils.styleLoaders({ sourceMap: cfg.build.debug })
      },
      plugins: [
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin,
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: srcResolve(`index.template.html`),
          inject: true
        }),
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`App is running at ${cfg.build.uri}\n`],
          },
          clearConsole: true
        })
      ]
    })

    if (cfg.devServer.hot) {
      require('webpack-dev-server').addDevServerEntrypoints(webpackConfig, cfg.devServer)
      webpackConfig = merge(webpackConfig, {
        plugins: [
          new webpack.NamedModulesPlugin(),
          new webpack.HotModuleReplacementPlugin(), // HMR shows filenames in console on update
        ]
      })
    }
  }
  // PRODUCTION build
  else {
    const
      ExtractTextPlugin = require('extract-text-webpack-plugin'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin'),
      CopyWebpackPlugin = require('copy-webpack-plugin')

    webpackConfig = merge(webpackConfig, {
      devtool: cfg.build.debug ? '#source-map' : false,
      module: {
        rules: cssUtils.styleLoaders({
          sourceMap: cfg.build.debug,
          extract: true
        })
      },
      output: {
        path: appResolve(cfg.build.distDir),
        publicPath: cfg.build.publicPath,
        filename: 'js/[name].js',
        chunkFilename: 'js/[id].[chunkhash].js'
      },
      plugins: [
        // extract css into its own file
        new ExtractTextPlugin({
          filename: '[name].[contenthash].css'
        }),
        new HtmlWebpackPlugin({
          filename: path.join(appResolve(cfg.build.distDir), cfg.build.htmlFilename),
          template: srcResolve(`index.template.html`),
          inject: true,
          minify: cfg.build.debug ? {} : {
            removeComments: true,
            collapseWhitespace: true,
            removeAttributeQuotes: true
            // more options:
            // https://github.com/kangax/html-minifier#options-quick-reference
          },
          // necessary to consistently work with multiple chunks via CommonsChunkPlugin
          chunksSortMode: 'dependency'
        }),
        // keep module.id stable when vender modules does not change
        new webpack.HashedModuleIdsPlugin(),
        // split vendor js into its own file
        new webpack.optimize.CommonsChunkPlugin({
          name: 'vendor',
          minChunks: function (module, count) {
            // any required modules inside node_modules are extracted to vendor
            return (
              module.resource &&
              /\.js$/.test(module.resource) &&
              (
                module.resource.indexOf('quasar') > -1 ||
                module.resource.indexOf('node_modules') > -1
              )
            )
          }
        }),
        // extract webpack runtime and module manifest to its own file in order to
        // prevent vendor hash = require(being updated whenever app bundle is updated
        new webpack.optimize.CommonsChunkPlugin({
          name: 'manifest',
          chunks: ['vendor']
        }),
        // copy custom static assets
        new CopyWebpackPlugin([
          {
            from: srcResolve(`statics`),
            to: path.join(appResolve(cfg.build.distDir), 'statics')
          }
        ])
      ]
    })

    if (!cfg.build.debug) {
      webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          },
          sourceMap: cfg.build.debug
        })
      )
      webpackConfig.plugins.push(
        // Compress extracted CSS. We are using this plugin so that possible
        // duplicated CSS = require(different components can be deduped.
        new OptimizeCSSPlugin({
          cssProcessorOptions: {
            safe: true
          }
        })
      )
    }
  }

  return webpackConfig
}
