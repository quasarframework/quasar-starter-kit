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
  module.hot.accept(['./modules/example'], () => {
    const newModule = require('./modules/example').default

    store.hotUpdate({
      modules: {
        showcase: newModule
      }
    })
  })
}

export default store
