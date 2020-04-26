import { store } from 'quasar/wrappers';
import Vuex, { Store } from 'vuex';

// import example from './module-example';
import { ExampleStateInterface } from './module-example/state';

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */

export interface StoreInterface {
  // Define your own store structure, using submodules if needed
  example: ExampleStateInterface;
}

export default store(function ({ Vue }): Store<StoreInterface> {
  Vue.use(Vuex);

  const newStore: Store<StoreInterface> = new Vuex.Store({
    modules: {
      // example
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: !!process.env.DEV
  });

  return newStore;
});
