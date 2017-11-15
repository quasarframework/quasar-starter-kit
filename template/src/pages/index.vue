<template>
  <q-page class="text-center">
    <div class="my-class my-extra-class gigi">The logo</div>
    <img :src="src">
    <div>{{$q.platform.is}}</div>
    <div v-if="$q.platform.is.cordova">Cordova detected: {{ cordovaDetected }}</div>
    <div>Statics is "{{ statics }}"</div>
    <img src="statics/quasar-logo-full.svg">
    <div>
      <router-link to="/index2">To index 2</router-link>
    </div>
  </q-page>
</template>

<style lang="stylus">
.my-class
  display flex
  align-items center
</style>

<script>
export default {
  name: 'page-index',
  data () {
    return {
      cordovaDetected: this.$q.cordova !== void 0,
      statics: __statics,
      src: `statics/quasar-logo-full.svg`
    }
  }
}
</script>
