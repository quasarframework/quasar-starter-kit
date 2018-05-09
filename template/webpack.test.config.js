// var webpack = require('webpack')

// module.exports = {
//   module: {
//     rules: [
//       {
//         test: /\.vue$/,
//         loader: 'vue-loader'
//       },
//       {
//         test: /\.js$/,
//         loader: 'babel-loader',
//         exclude: /node_modules/
//       },
//       {
//         test: /\.(png|jpg|gif|svg)$/,
//         loader: 'file-loader',
//         options: {
//           name: '[name].[ext]?[hash]'
//         }
//       }
//     ]
//   },
//   devServer: {
//     historyApiFallback: true,
//     noInfo: true
//   },
//   performance: {
//     hints: false
//   },
//   devtool: '#eval-source-map'
// }

// if (process.env.NODE_ENV === 'production') {
//   module.exports.devtool = '#source-map'
//   module.exports.plugins = (module.exports.plugins || []).concat([
//     new webpack.DefinePlugin({
//       'process.env': {
//         NODE_ENV: '"production"'
//       }
//     }),
//     new webpack.optimize.UglifyJsPlugin({
//       sourceMap: true,
//       compress: {
//         warnings: false
//       }
//     }),
//     new webpack.LoaderOptionsPlugin({
//       minimize: true
//     })
//   ])
// }

// // test specific setups
// if (process.env.NODE_ENV === 'test') {
//   module.exports.externals = [require('webpack-node-externals')()]
//   module.exports.devtool = 'inline-cheap-module-source-map'
// }
