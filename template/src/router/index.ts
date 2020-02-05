import { HasSsrBootParams, HasStoreBootParams } from 'quasar';
import { VueConstructor } from 'vue';
import VueRouter from 'vue-router';
{{#preset.vuex}}import { StoreInterface } from '../store';
{{/preset.vuex}}import routes from './routes';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

type RouterBootParams = {
  Vue: VueConstructor;
} & HasSsrBootParams &
  HasStoreBootParams{{#preset.vuex}}<StoreInterface>{{/preset.vuex}};

export default function({ Vue }: RouterBootParams) {
  Vue.use(VueRouter);

  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  });

  return Router;
}
