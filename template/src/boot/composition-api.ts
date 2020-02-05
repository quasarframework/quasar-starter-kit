import VueCompositionApi from '@vue/composition-api';
import { boot } from 'quasar';

export default boot(({ Vue }) => {
  Vue.use(VueCompositionApi);
});
