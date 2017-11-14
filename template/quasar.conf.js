// Configuration for your app

module.exports = function (ctx) {
  return {
    plugins: [
      'axios'// ,
      // 'i18n',
      // 'some-package'
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
    supportIE: false,
    vendor: {
      add: ['404.vue'],
      remove: []
    },
    build: {
      scopeHoisting: true,
      // gzip: true,
      // analyze: true,
      // extractCSS: false,
      // useNotifier: false,
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
    },
    framework: {
      components: [
        'QApp',
        'QLayout',
        'QLayoutHeader',
        'QLayoutDrawer',
        'QToolbar',
        'QBtn',
        'QIcon',
        'QToolbarTitle',
        'QList',
        'QListHeader',
        'QItem',
        'QItemMain',
        'QItemSide',
        'QPageContainer',
        'QPage'
      ],
      directives: [],
      plugins: ['Cordova']
    },
    pwa: {
      cacheId: 'my-quasar-pwa-app',
      cacheExt: 'js,html,css,woff,ttf,eot,otf,woff,woff2,json,svg,gif,jpg,jpeg,png,wav,ogg,webm,flac,aac,mp4,mp3',
      manifest: {
        name: 'Quasar App',
        short_name: 'Quasar-PWA',
        description: 'Best PWA App in town!',
        icons: [
          {
            'src': 'statics/icons/icon-192x192.png',
            'sizes': '192x192',
            'type': 'image/png'
          },
          {
            'src': 'statics/icons/icon-512x512.png',
            'sizes': '512x512',
            'type': 'image/png'
          }
        ],
        background_color: '#ffffff',
        theme_color: '#027be3'
      }
    },
    electron: {
      extendPackageJson (pkg) {
        // do something with pkg -- add/remove/change props from package.json
      },
      packager: {
        ignore: /(^\/(src|test|\.[a-z]+|README|yarn|static|dist\/web))/
      }
    }
  }
}
