const
  fs = require('fs'),
  chalk = require('chalk'),
  path = require('path'),
  webpack = require('webpack'),
  ProgressBarPlugin = require('progress-bar-webpack-plugin')

const
  getCssUtils = require('./get-css-utils')

module.exports = function (ctx, cfg) {
  const
    build = cfg.build,
    cssUtils = getCssUtils(ctx),
    vueLoaderConfig = {
      loaders: cssUtils.cssLoaders({
        sourceMap: ctx.debug,
        extract: ctx.prod
      }),
      transformToRequire: {
        video: 'src',
        source: 'src',
        img: 'src',
        image: 'xlink:href'
      }
    }

  function appResolve (dir) {
    return path.join(build.appDir, 'frontend', dir)
  }
  function cliResolve (dir) {
    return path.join(build.cliDir, dir)
  }

  let appEntry = [ cliResolve(`lib/app/entry.js`) ]
  if (build.supportIE) {
    appEntry.unshift(cliResolve(`node_modules/quasar-framework/dist/quasar.ie.polyfills.js`))
  }

  let webpackConfig = {
    entry: {
      app: appEntry
    },
    resolve: {
      extensions: [
        `.${build.themeName}.js`, '.js',
        `.${build.themeName}.vue`, '.vue',
        '.json'
      ],
      modules: [
        build.srcDir,
        appResolve('node_modules'),
        cliResolve('node_modules')
      ],
      alias: {
        quasar: cliResolve(`node_modules/quasar-framework/dist/quasar.${build.themeName}.esm.js`),
        'quasar-styl': cliResolve(`node_modules/quasar-framework/dist/quasar.${build.themeName}.styl`),
        variables: appResolve(`themes/app.variables.styl`),
        '~': build.srcDir,
        css: appResolve(`css`),
        layouts: appResolve(`layouts`),
        components: appResolve(`components`),
        pages: appResolve(`pages`),
        plugins: appResolve(`plugins`),
        __quasar: appResolve(`quasar`),
        router: appResolve(`router`),
        store: appResolve(`store`),
        themes: appResolve(`themes`),
        statics: appResolve(`statics`),
        assets: appResolve(`assets`)
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
          options: vueLoaderConfig(ctx)
        },
        {
          test: /\.js$/,
          loader: 'babel-loader',
          include: [
            build.srcDir,
            path.resolve(__dirname, '../app/entry.js')
          ],
          options: JSON.parse(
            fs.readFileSync(
              path.join(build.appDir, '.babelrc'),
              'utf8'
            )
          )
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
      new webpack.DefinePlugin(cfg.defines),
      new ProgressBarPlugin({
        format: ` [:bar] ${chalk.bold(':percent')} (:msg)`
      })
    ],
    performance: {
      hints: false
    }
  }

  // DEVELOPMENT build
  if (ctx.dev)
    const
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

    webpackConfig = merge(webpackConfig, {
      // cheap-module-eval-source-map is faster for development
      devtool: '#cheap-module-eval-source-map',
      module: {
        rules: cssUtils.styleLoaders({ sourceMap: build.debug })
      },
      plugins: [
        // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        // https://github.com/ampedandwired/html-webpack-plugin,
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: 'src/index.html',
          inject: true
        }),
        new FriendlyErrorsPlugin({
          clearConsole: true
        })
      ]
    })
  }
  // PRODUCTION build
  else {
    const
      ExtractTextPlugin = require('extract-text-webpack-plugin'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin'),
      CopyWebpackPlugin = require('copy-webpack-plugin')

    webpackConfig = merge(webpackConfig, {
      devtool: build.debug ? '#source-map' : false,
      module: {
        rules: styleLoaders({
          sourceMap: build.debug,
          extract: true
        })
      },
      output: {
        path: build.distDir,
        publicPath: build.publicPath,
        filename: 'js/[name].js',
        chunkFilename: 'js/[id].[chunkhash].js'
      },
      plugins: [
        // extract css into its own file
        new ExtractTextPlugin({
          filename: '[name].[contenthash].css'
        }),
        new HtmlWebpackPlugin({
          filename: path.join(build.distDir, build.htmlFilename),
          template: appResolve(`frontend/index.template.html`),
          inject: true,
          minify: build.debug ? {} : {
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
            from: appResolve(`statics`),
            to: path.join(build.distDir, 'statics')
          }
        ])
      ]
    })

    if (!build.debug) {
      webpackConfig.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          },
          sourceMap: build.debug
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
