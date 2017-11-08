// Configuration for your app

module.exports = function (ctx) {
  return {
    plugins: [
      'axios',
      'i18n',
      'some-package'
    ],
    css: [
      'my-style.styl'
    ],
    extras: [
      ctx.theme.mat ? 'roboto-font' : null,
      'material-icons'
      // 'ionicons',
      // 'fontawesome',
      // 'animate'
    ],
    supportIE: true,
    vendor: {
      add: ['404.vue'],
      remove: []
    },
    build: {
      scopeHoisting: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      test () {
        // console.log('a')
      }
    },
    devServer: {
      // https: true,
      // port: 8080,
      open: false
    },
    extendWebpack (cfg) {
      cfg.module.rules.push({
        enforce: 'pre',
        test: /\.(js|vue)$/,
        loader: 'eslint-loader',
        exclude: /(node_modules|quasar)/
      })
    }
  }
}
