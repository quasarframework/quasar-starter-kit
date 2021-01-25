import axios from 'axios'
import { boot } from 'quasar/wrappers';

export default boot(({ app }) => {
  app.config.globalProperties.$axios = axios
})
