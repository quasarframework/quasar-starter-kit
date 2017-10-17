import Vue from 'vue'
import Quasar, * as All from 'quasar'

Vue.use(Quasar, {
  components: All,
  directives: All
})

if (__THEME__ === 'mat') {
  require('quasar-extras/roboto-font')
}
import 'quasar-extras/material-icons'
// import 'quasar-extras/ionicons'
// import 'quasar-extras/fontawesome'
// import 'quasar-extras/animate'
