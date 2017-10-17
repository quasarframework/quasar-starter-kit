import { sync } from 'vuex-router-sync'
import { createRouter } from 'router'
import { createStore } from 'store'
import { QApp } from 'quasar'

export function createApp (ssrContext) {
  const store = createStore()
  const router = createRouter()

  sync(store, router)

  const app = new Vue({
    router,
    store,
    ssrContext,
    render: h => h(QApp)
  })

  return { app, router, store }
}
