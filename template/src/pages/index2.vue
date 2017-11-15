<template>
  <q-page class="text-center">
    <div>Index 2</div>
    <img :src="src">
    <br>
    <img src="/statics/quasar-logo-full.svg">
    <br>
    <img src="statics/quasar-logo-full.svg">
    <br>
    <q-input v-model="src2" />
    <br>
    <img :src="src2">
    <br>
    <router-link to="/">To index 1</router-link>
  </q-page>
</template>

<style lang="stylus">
.my-class
  display flex
  align-items center
</style>

<script>
export default {
  name: 'page-index2',
  data () {
    return {
      src: 'statics/quasar-logo-full.svg',
      src2: 'statics/quasar-logo2.png_'
    }
  }
}
</script>
