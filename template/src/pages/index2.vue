<template>
  <q-page class="text-center">
    <div>Index 2</div>
    <img :src="src">
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
      src: '/statics/quasar-logo-full.svg'
    }
  }
}
</script>
