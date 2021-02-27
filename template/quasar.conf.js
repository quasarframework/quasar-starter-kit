/*
 * This file runs in a Node context (it's NOT transpiled by Babel), so use only
 * the ES6 features that are supported by your Node version. https://node.green/
 */

// Configuration for your app
// https://quasar.dev/quasar-cli/quasar-conf-js

{{#preset.lint}}
/* eslint-env node */
{{#preset.typescript}}
/* eslint-disable @typescript-eslint/no-var-requires */
{{else}}
const ESLintPlugin = require('eslint-webpack-plugin')
{{/preset.typescript}}
{{#if_eq lintConfig "airbnb"}}
/* eslint func-names: 0 */
/* eslint global-require: 0 */
{{/if_eq}}
{{/preset.lint}}
const { configure } = require('quasar/wrappers');

module.exports = configure(function (/* ctx */) {
  return {
    // https://quasar.dev/quasar-cli/supporting-ts
    supportTS: {{#if preset.typescript}}{{#if preset.lint}}{
      tsCheckerConfig: {
        eslint: {
          enabled: true,
          files: './src/**/*.{ts,tsx,js,jsx,vue}',
        },
      }
    }{{else}}true{{/if}}{{else}}false{{/if}},

    // https://quasar.dev/quasar-cli/prefetch-feature
    // preFetch: true,

    // app boot file (/src/boot)
    // --> boot files are part of "main.js"
    // https://quasar.dev/quasar-cli/boot-files
    boot: [
      {{#preset.i18n}}
      'i18n',
      {{/preset.i18n}}
      {{#preset.axios}}
      'axios',
      {{/preset.axios}}
    ],

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-css
    css: [
      'app.{{#if_eq css "none"}}css{{/if_eq}}{{#if_eq css "scss"}}scss{{/if_eq}}{{#if_eq css "sass"}}sass{{/if_eq}}'
    ],

    // https://github.com/quasarframework/quasar/tree/dev/extras
    extras: [
      // 'ionicons-v4',
      // 'mdi-v5',
      // 'fontawesome-v5',
      // 'eva-icons',
      // 'themify',
      // 'line-awesome',
      // 'roboto-font-latin-ext', // this or either 'roboto-font', NEVER both!

      'roboto-font', // optional, you are not bound to it
      'material-icons', // optional, you are not bound to it
    ],

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-build
    build: {
      vueRouterMode: 'hash', // available values: 'hash', 'history'

      // transpile: false,

      // Add dependencies for transpiling with Babel (Array of string/regex)
      // (from node_modules, which are by default not transpiled).
      // Applies only if "transpile" is set to true.
      // transpileDependencies: [],

      // rtl: false, // https://quasar.dev/options/rtl-support
      // preloadChunks: true,
      // showProgress: false,
      // gzip: true,
      // analyze: true,

      // Options below are automatically set depending on the env, set them if you want to override
      // extractCSS: false,

      // https://quasar.dev/quasar-cli/handling-webpack
      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      {{#preset.typescript}}chainWebpack (/* chain */) {
        //
      },
      {{else}}{{#preset.lint}}chainWebpack (chain) {
        chain.plugin('eslint-webpack-plugin')
          .use(ESLintPlugin, [{ extensions: [ 'js', 'vue' ] }])
      },
      {{else}}chainWebpack (/* chain */) {
        //
      },{{/preset.lint}}{{/preset.typescript}}
    },

    // Full list of options: https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-devServer
    devServer: {
      https: false,
      port: 8080,
      open: true // opens browser window automatically
    },

    // https://quasar.dev/quasar-cli/quasar-conf-js#Property%3A-framework
    framework: {
      config: {},

      // iconSet: 'material-icons', // Quasar icon set
      // lang: 'en-US', // Quasar language pack

      // For special cases outside of where the auto-import stategy can have an impact
      // (like functional components as one of the examples),
      // you can manually specify Quasar components/directives to be available everywhere:
      //
      // components: [],
      // directives: [],

      // Quasar plugins
      plugins: []
    },

    // animations: 'all', // --- includes all animations
    // https://quasar.dev/options/animations
    animations: [],

    // https://quasar.dev/quasar-cli/developing-ssr/configuring-ssr
    ssr: {
      pwa: false
    },

    // https://quasar.dev/quasar-cli/developing-pwa/configuring-pwa
    pwa: {
      workboxPluginMode: 'GenerateSW', // 'GenerateSW' or 'InjectManifest'
      workboxOptions: {}, // only for GenerateSW
      manifest: {
        name: `{{ productName }}`,
        short_name: `{{ productName }}`,
        description: `{{ description }}`,
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#027be3',
        icons: [
          {
            src: 'icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-256x256.png',
            sizes: '256x256',
            type: 'image/png'
          },
          {
            src: 'icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-cordova-apps/configuring-cordova
    cordova: {
      // noIosLegacyBuildFlag: true, // uncomment only if you know what you are doing
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-capacitor-apps/configuring-capacitor
    capacitor: {
      hideSplashscreen: true
    },

    // Full list of options: https://quasar.dev/quasar-cli/developing-electron-apps/configuring-electron
    electron: {
      bundler: 'packager', // 'packager' or 'builder'

      packager: {
        // https://github.com/electron-userland/electron-packager/blob/master/docs/api.md#options

        // OS X / Mac App Store
        // appBundleId: '',
        // appCategoryType: '',
        // osxSign: '',
        // protocol: 'myapp://path',

        // Windows only
        // win32metadata: { ... }
      },

      builder: {
        // https://www.electron.build/configuration/configuration

        appId: '{{ name }}'
      },

      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      {{#preset.typescript}}chainWebpack (/* chain */) {
        // do something with the Electron main process Webpack cfg
        // extendWebpackMain also available besides this chainWebpackMain
      },
      {{else}}{{#preset.lint}}chainWebpackMain (chain) {
        chain.plugin('eslint-webpack-plugin')
          .use(ESLintPlugin, [{ extensions: [ 'js' ] }])
      },
      {{else}}chainWebpackMain (/* chain */) {
        // do something with the Electron main process Webpack cfg
        // extendWebpackMain also available besides this chainWebpackMain
      },{{/preset.lint}}{{/preset.typescript}}

      // "chain" is a webpack-chain object https://github.com/neutrinojs/webpack-chain
      {{#preset.typescript}}chainWebpackPreload (/* chain */) {
        // do something with the Electron main process Webpack cfg
        // extendWebpackPreload also available besides this chainWebpackPreload
      },
      {{else}}{{#preset.lint}}chainWebpackPreload (chain) {
        chain.plugin('eslint-webpack-plugin')
          .use(ESLintPlugin, [{ extensions: [ 'js' ] }])
      },
      {{else}}chainWebpackPreload (/* chain */) {
        // do something with the Electron main process Webpack cfg
        // extendWebpackPreload also available besides this chainWebpackPreload
      },{{/preset.lint}}{{/preset.typescript}}
    }
  }
});
