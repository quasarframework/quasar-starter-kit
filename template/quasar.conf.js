// Configuration for your app

module.exports = function (ctx) {
  return {
    vendor: [
      'axios',
      'vue-i18n',
      'some-package'
    ],
    plugins: [
      'axios',
      'i18n',
      'some-package'
    ],
    css: [],
    extras: [
      ctx.mat ? 'roboto-font' : '',
      'material-icons',
      // 'ionicons',
      // 'fontawesome',
      // 'animate'
    ],
    extend (config) {
      config.module.rules.push({
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /(node_modules|quasar)/
      })
    }
  }
}
