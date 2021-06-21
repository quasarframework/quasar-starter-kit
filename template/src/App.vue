<template>
  <router-view />
</template>
<script{{#if preset.typescript}} lang="ts"{{/if}}>
{{#if_eq typescriptConfig "class"}}import { Vue } from 'vue-class-component'

export default class App extends Vue {}{{else}}import { defineComponent } from 'vue';

export default defineComponent({
  name: 'App'
}){{/if_eq}}
</script>
