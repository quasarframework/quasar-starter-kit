import axios, { AxiosInstance } from 'axios';
import { boot } from 'quasar/wrappers';

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios;
});
