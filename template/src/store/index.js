import Vue from 'vue'
import Vuex from 'vuex'

import example from './module-example'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    example
  }
})

if (process.env.DEV && module.hot) {
  module.hot.accept(['./module-example'], () => {
    const newModule = require('./module-example').default
    store.hotUpdate({ modules: { example: newModule } })
  })
}

export default store
