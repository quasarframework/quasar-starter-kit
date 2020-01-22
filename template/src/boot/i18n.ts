import { boot } from 'quasar';
import messages from 'src/i18n';
import VueI18n from 'vue-i18n';

declare module 'vue/types/vue' {
  interface Vue {
    i18n: VueI18n;
  }
}

export const i18n = new VueI18n({
  locale: "en-us",
  fallbackLocale: "en-us",
  messages
});

export default boot(({ app, Vue }) => {
  Vue.use(VueI18n);

  // Set i18n instance on app
  app.i18n = i18n;
});