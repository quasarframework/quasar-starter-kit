<%
function hash (str) {
  const name = str.replace(/\W+/g, '')
  return name.charAt(0).toUpperCase() + name.slice(1)
}
%>

<% if (supportIE) { %>
require('quasar-framework/dist/quasar.ie.polyfills.js')
<% } %>

import Vue from 'vue'
import Quasar from 'quasar'

import App from '~/App'
import QuasarOptions from '~/quasar-imports'

Vue.use(Quasar, QuasarOptions)

require(`~/themes/app.<%= ctx.themeName %>.styl`)

<%
extras && extras.filter(asset => asset).forEach(asset => {
%>
require('quasar-extras/<%= asset %>')
<% }) %>

<% css && css.forEach(asset => { %>
require('~/css/<%= asset %>')
<% }) %>

import { createRouter } from '~/router'
import { createStore } from '~/store'

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
  const installKey = '__quasar_' + key + '_installed__'

  if (Vue[installKey]) {
    return
  }

  Vue[installKey] = true
  if (!Vue.prototype.hasOwnProperty(key)) {
    Object.defineProperty(Vue.prototype, key, value)
  }
}

<% if (plugins) { %>
const plugins = []
<%
plugins.filter(asset => asset).forEach(asset => {
  let importName = 'plugin' + hash(asset)
%>
import <%= importName %> from '~/plugins/<%= asset %>'
plugins.push(<%= importName %>)
<% }) %>
plugins.forEach(plugin => plugin({ app, router, store, inject }))
<% } %>

/* eslint-disable no-new */
new Vue(app)
