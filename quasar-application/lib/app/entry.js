import Vue from 'vue'
import Quasar from 'quasar'

import App from '~/App'
import QuasarOptions from '~/quasar-imports'

Vue.use(Quasar, QuasarOptions)

require(`themes/app.${__THEME__}.styl`)
require(`quasar-extras/roboto-font`) // TODO
require(`quasar-extras/material-icons`) // TODO
require(`css`)

import { createRouter } from 'router'
import { createStore } from 'store'

const
  router = createRouter(),
  store = createStore()

const app = {
  el: '#q-app',
  router,
  store,
  render: h => h(App)
}

const inject = function (key, value) {
  if (!key || !value) {
    throw new Error('inject(key, value) needs both a key and value')
  }

  key = '$' + key
  const installKey = `__quasar_${key}_installed__`

  if (Vue[installKey]) {
    return
  }

  Vue[installKey] = true
  if (!Vue.prototype.hasOwnProperty(key)) {
    Object.defineProperty(Vue.prototype, key, value)
  }
}

import plugins from 'plugins'

plugins.forEach(plugin => {
  if (typeof plugin === 'function') {
    plugin({ app, router, store, inject })
  }
})

/* eslint-disable no-new */
new Vue(app)
