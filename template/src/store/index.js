import Vue from 'vue'
import Vuex from 'vuex'

import example from './modules/example'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    example
  }
})

if (process.env.DEV && module.hot) {
  module.hot.accept(['./modules/showcase'], () => {
    const newShowcase = require('./modules/showcase').default

    store.hotUpdate({
      modules: {
        showcase: newShowcase
      }
    })
  })
}

export default store
